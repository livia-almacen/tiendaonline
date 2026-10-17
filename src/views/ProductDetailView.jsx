import { useEffect, useState } from 'react';
import { fmt } from '../utils/format';
import { Icon } from '../utils/icons';
import { getPlaceholder } from '../utils/placeholder';
import { getMaxQtyForPresentation, getRemainingStock, formatStock } from '../utils/stock';

export default function ProductDetailView({ product, cart, onBack, onAddToCart }) {
  const [selectedPres, setSelectedPres] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const pres = product.presentations[selectedPres];
  const total = pres.price * qty;

  // Validación de stock
  const remaining = getRemainingStock(product, cart);
  const hasStockData = remaining !== Infinity;
  const maxQty = getMaxQtyForPresentation(product, pres, cart);
  const isOutByStatus = product.stockStatus === "agotado";
  const isOutByCart = hasStockData && remaining <= 0;
  const isOut = isOutByStatus || isOutByCart;
  const atMaxForPresentation = hasStockData && qty >= maxQty;
  const noUnitsForThisPres = hasStockData && maxQty <= 0 && !isOut;

  // Si cambiás de presentación y la qty actual ya no entra en el stock, ajustar
  useEffect(() => {
    if (hasStockData && maxQty !== Infinity && qty > maxQty) {
      setQty(Math.max(1, maxQty));
    }
  }, [selectedPres, maxQty, hasStockData]);

  const stockText = isOut
    ? "Sin stock disponible"
    : product.stockStatus === "poco"
    ? "⚡ Últimas unidades"
    : "✓ Disponible";
  const stockClass = isOut ? "agotado" : product.stockStatus === "poco" ? "poco" : "";

  const handleAdd = () => {
    if (isOut || noUnitsForThisPres) return;
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
              <button
                className="qtyBtn"
                onClick={() => setQty(q => q + 1)}
                disabled={atMaxForPresentation}
                title={atMaxForPresentation ? "Alcanzaste el stock disponible" : ""}
              >+</button>
            </div>
          </div>

          {/* Aviso de stock */}
          {hasStockData && !isOut && (
            <div style={{
              fontSize: 12, color: "var(--txM)",
              textAlign: "right", marginTop: -6, marginBottom: 12,
              fontStyle: "italic"
            }}>
              {noUnitsForThisPres
                ? <span style={{ color: "var(--dg)", fontWeight: 700 }}>⚠ Esta presentación supera el stock restante ({formatStock(product)})</span>
                : atMaxForPresentation
                ? <span style={{ color: "var(--ac)", fontWeight: 700 }}>Alcanzaste el stock disponible</span>
                : maxQty <= 5
                ? <>Stock disponible: {formatStock(product)} · podés agregar hasta {maxQty}</>
                : null}
            </div>
          )}

          <button
            className="btnPrimary"
            onClick={handleAdd}
            disabled={isOut || noUnitsForThisPres}
            style={added ? { background: "var(--gD)" } : {}}
          >
            {isOut
              ? "Producto sin stock"
              : noUnitsForThisPres
              ? "No alcanza el stock para esta presentación"
              : added
              ? "✓ Agregado al carrito"
              : `Agregar al carrito · ${fmt(total)}`}
          </button>
        </div>
      </div>
    </main>
  );
}
