import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Icon } from '../utils/icons';
import { useInView } from '../hooks/useInView';

export default function CatalogView({ store, categories, products, onSelectProduct }) {
   const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [sortBy, setSortBy] = useState("name-asc");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  const allCats = ["Todos", ...(categories || [])];

  // Precio mínimo de un producto (la presentación más barata)
  const getMinPrice = (p) => p.presentations?.length
    ? Math.min(...p.presentations.map(pr => pr.price))
    : p.price;

  const isOutOfStock = (p) => p.stockStatus === "agotado" || (p.stock !== undefined && p.stock <= 0);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (cat !== "Todos" && p.category !== cat) return false;
      if (hideOutOfStock && isOutOfStock(p)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q)
            || (p.description || "").toLowerCase().includes(q)
            || p.category.toLowerCase().includes(q);
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":   return a.name.localeCompare(b.name);
        case "name-desc":  return b.name.localeCompare(a.name);
        case "price-asc":  return getMinPrice(a) - getMinPrice(b);
        case "price-desc": return getMinPrice(b) - getMinPrice(a);
        case "availability": {
          const oa = isOutOfStock(a) ? 1 : 0;
          const ob = isOutOfStock(b) ? 1 : 0;
          if (oa !== ob) return oa - ob;
          return a.name.localeCompare(b.name);
        }
        default: return 0;
      }
    });
  }, [products, cat, search, sortBy, hideOutOfStock]);

  const outOfStockCount = products.filter(isOutOfStock).length;

  return (
    <>
      <section className="hero">
        {!logoFailed && (
          <img
            src="/logo.png"
            alt={store?.name || "Livia"}
            className="heroLogo animDropIn"
            onError={() => setLogoFailed(true)}
          />
        )}
        <h2 className="animDropIn delay-1">
          <span className="heroLeaf" aria-hidden="true">🌿</span>
          {store?.heroLine1 || "Alimentación consciente"}
          <br />
          {store?.heroLine2 || "en la puerta de tu casa"}
        </h2>
        <p className="animDropIn delay-2">
          Frutos secos, semillas, cereales, especias y productos naturales seleccionados con cuidado.
          Hacé tu pedido y coordinamos entrega o retiro.
        </p>
      </section>

      <div className="searchBar">
        <div className="searchInp">
          <Icon name="search" size={18} />
          <input
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="catChips">
          {allCats.map(c => (
            <button
              key={c}
              className={`chip ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

            <main>
        <div className="controlsBar">
          <span className="resultCount">
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          </span>
          <div className="controlsRight">
            <label className="toggleFilter">
              <input
                type="checkbox"
                checked={hideOutOfStock}
                onChange={e => setHideOutOfStock(e.target.checked)}
              />
              <span>Solo disponibles{outOfStockCount > 0 ? ` (${outOfStockCount} agotados)` : ""}</span>
            </label>
            <select
              className="sortSelect"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Ordenar productos"
            >
              <option value="name-asc">Nombre (A → Z)</option>
              <option value="name-desc">Nombre (Z → A)</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="availability">Disponibles primero</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--txL)" }}>
            Sin resultados
          </div>
        ) : (
          <div
            ref={gridRef}
            className={`grid ${gridInView ? "animStagger" : ""}`}
            key={cat + "-" + search + "-" + sortBy + "-" + hideOutOfStock}
          >
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="gridCardWrap"
                style={{ animationDelay: gridInView ? `${Math.min(i * 60, 500)}ms` : "0ms" }}
              >
                <ProductCard product={p} onClick={onSelectProduct} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
