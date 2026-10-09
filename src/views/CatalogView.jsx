import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Icon } from '../utils/icons';
import { useInView } from '../hooks/useInView';

export default function CatalogView({ store, categories, products, onSelectProduct }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [logoFailed, setLogoFailed] = useState(false);
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  const allCats = ["Todos", ...(categories || [])];

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (cat !== "Todos" && p.category !== cat) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q)
            || (p.description || "").toLowerCase().includes(q)
            || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, cat, search]);

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
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--txL)" }}>
            Sin resultados
          </div>
        ) : (
          <div
            ref={gridRef}
            className={`grid ${gridInView ? "animStagger" : ""}`}
            key={cat + "-" + search}
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
