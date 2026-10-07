import { useState } from 'react';
import { fmt } from '../utils/format';
import { Icon } from '../utils/icons';
import { getPlaceholder } from '../utils/placeholder';

export default function ProductDetailView({ product, onBack, onAddToCart }) {
  const [selectedPres, setSelectedPres] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const pres = product.presentations[selectedPres];
  const total = pres.price * qty;
  const isOut = product.stockStatus === "agotado";

  const stockText = isOut
    ? "Sin stock disponible"
    : product.stockStatus === "poco"
    ? "⚡ Últimas unidades"
    : "✓ Disponible";
  const stockClass = isOut ? "agotado" : product.stockStatus === "poco" ? "poco" : "";

  const handleAdd = () => {
    if (isOut) return;
    onAddToCart(product, pres, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="fadeIn">
      <button className="backLink" onClick={onBack}>
        <Icon name="back" size={14} /> Volver al catálogo
      </button>
      <div className="detailWrap">
        <div className="detailImg">
          {product.image
            ? <img src={`/productos/${product.image}`} alt={product.name} onError={e => { e.target.style.display = "none"; }} />
            : <span>{getPlaceholder(product.category)}</span>
          }
        </div>
        <div className="detailInfo">
          <div className="cat">{product.category}</div>
          <h2>{product.name}</h2>
          <div className={`stockLabel ${stockClass}`}>{stockText}</div>
          {product.description && <p className="desc">{product.description}</p>}

          <div className="presTitle">Elegí una presentación</div>
          <div className="presList">
            {product.presentations.map((p, i) => (
              <div
                key={i}
                className={`presRow ${selectedPres === i ? "selected" : ""}`}
                onClick={() => setSelectedPres(i)}
              >
                <div className="presInfo">
                  <div className="presQty">{selectedPres === i ? "✓" : ""}</div>
                  <span className="presLabel">{p.label}</span>
                </div>
                <div className="presPrice">{fmt(p.price)}</div>
              </div>
            ))}
          </div>

          <div className="qtyRow">
            <span className="qtyLabel">Cantidad</span>
            <div className="qtyCtl">
              <button className="qtyBtn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
              <span className="qtyVal">{qty}</span>
              <button className="qtyBtn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="btnPrimary"
            onClick={handleAdd}
            disabled={isOut}
            style={added ? { background: "var(--gD)" } : {}}
          >
            {isOut
              ? "Producto sin stock"
              : added
              ? "✓ Agregado al carrito"
              : `Agregar al carrito · ${fmt(total)}`}
          </button>
        </div>
      </div>
    </main>
  );
}
