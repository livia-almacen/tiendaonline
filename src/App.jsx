import { useState } from 'react';
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

  const [view, setView] = useState("catalog"); // catalog | detail | cart | checkout
  const [selected, setSelected] = useState(null);

  const goHome = () => { setView("catalog"); setSelected(null); };
  const goCart = () => setView("cart");
  const goCheckout = () => setView("checkout");
  const openProduct = (p) => { setSelected(p); setView("detail"); };

  const handleOrderSent = () => {
    // Clear the cart and go back to catalog after order is sent to WhatsApp
    clear();
    setView("catalog");
    setSelected(null);
  };

  if (loading) {
    return (
      <>
        <Header store={{ name: "Livia", slogan: "Tienda Natural" }} cartCount={0} theme={theme} onToggleTheme={toggle} onGoHome={() => {}} onGoCart={() => {}} />
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
        <Header store={{ name: "Livia", slogan: "Tienda Natural" }} cartCount={0} theme={theme} onToggleTheme={toggle} onGoHome={() => {}} onGoCart={() => {}} />
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
        store={store}
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
