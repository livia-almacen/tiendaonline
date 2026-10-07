import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Icon } from '../utils/icons';

export default function CatalogView({ store, categories, products, onSelectProduct }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");

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
        <div className="decor">🌿</div>
        <h2>{store?.heroLine1 || "Alimentación consciente"}<br />{store?.heroLine2 || "en la puerta de tu casa"}</h2>
        <p>Frutos secos, semillas, cereales, especias y productos naturales seleccionados con cuidado. Hacé tu pedido y coordinamos entrega o retiro.</p>
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
          <div className="grid fadeIn">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onClick={onSelectProduct} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
