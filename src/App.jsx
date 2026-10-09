import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CatalogView from './views/CatalogView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import { useCatalog } from './hooks/useCatalog';
import { useCart } from './hooks/useCart';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { catalog, loading, error, reload } = useCatalog();
  const { cart, addItem, removeItem, updateQty, clear, count, subtotal } = useCart();
  const { theme, toggle } = useTheme();

  const [view, setView] = useState("catalog");
  const [selected, setSelected] = useState(null);

  // Browser back button support
  useEffect(() => {
    if (!window.history.state || !window.history.state.liviaView) {
      window.history.replaceState({ liviaView: "catalog" }, "");
    }
    const handlePopState = (e) => {
      const state = e.state || { liviaView: "catalog" };
      const newView = state.liviaView || "catalog";
      if (newView === "detail" && state.productId && catalog?.products) {
        const product = catalog.products.find(p => p.id === state.productId);
        if (product) {
          setSelected(product);
          setView("detail");
          return;
        }
      }
      if (newView !== "detail") setSelected(null);
      setView(newView);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [catalog]);

  const pushView = (newView, extraState = {}) => {
    window.history.pushState({ liviaView: newView, ...extraState }, "");
    setView(newView);
  };

  const goHome = () => { setSelected(null); pushView("catalog"); };
  const goCart = () => pushView("cart");
  const goCheckout = () => pushView("checkout");
  const openProduct = (p) => { setSelected(p); pushView("detail", { productId: p.id }); };

  const handleOrderSent = () => {
    clear();
    setSelected(null);
    pushView("catalog");
  };

  if (loading) {
    return (
      <>
        <Header cartCount={0} theme={theme} onToggleTheme={toggle} onGoHome={() => {}} onGoCart={() => {}} />
        <div className="loader">
          <div className="spinner"></div>
          <div>Cargando catálogo...</div>
        </div>
      </>
    );
  }

  if (error || !catalog) {
    return (
      <>
        <Header cartCount={0} theme={theme} onToggleTheme={toggle} onGoHome={() => {}} onGoCart={() => {}} />
        <div className="errorState">
          <div className="em">⚠️</div>
          <h3>No se pudo cargar el catálogo</h3>
          <p>{error || "Error desconocido"}</p>
          <button className="btnGhost" style={{ marginTop: 16 }} onClick={reload}>Reintentar</button>
        </div>
      </>
    );
  }

  const { store, categories, products } = catalog;

  return (
    <>
      <Header
        cartCount={count}
        onGoHome={goHome}
        onGoCart={goCart}
        theme={theme}
        onToggleTheme={toggle}
      />

      {view === "catalog" && (
        <CatalogView
          store={store}
          categories={categories}
          products={products}
          onSelectProduct={openProduct}
        />
      )}

      {view === "detail" && selected && (
        <ProductDetailView
          product={selected}
          onBack={goHome}
          onAddToCart={addItem}
        />
      )}

      {view === "cart" && (
        <CartView
          cart={cart}
          subtotal={subtotal}
          onBack={goHome}
          onCheckout={goCheckout}
          onRemove={removeItem}
          onUpdateQty={updateQty}
        />
      )}

      {view === "checkout" && (
        <CheckoutView
          store={store}
          cart={cart}
          subtotal={subtotal}
          onBack={goCart}
          onSent={handleOrderSent}
        />
      )}

      <Footer store={store} />
    </>
  );
}
