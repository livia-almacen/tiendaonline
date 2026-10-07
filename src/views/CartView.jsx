import { fmt } from '../utils/format';
import { Icon } from '../utils/icons';
import { getPlaceholder } from '../utils/placeholder';

export default function CartView({ cart, subtotal, onBack, onCheckout, onRemove, onUpdateQty }) {
  if (cart.length === 0) {
    return (
      <main className="fadeIn">
        <button className="backLink" onClick={onBack}><Icon name="back" size={14} /> Seguir comprando</button>
        <div className="cartWrap">
          <div className="cartTitle">Tu carrito</div>
          <div className="cartEmpty">
            <div className="em">🛒</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Todavía no agregaste productos</div>
            <div style={{ fontSize: 13 }}>Explorá el catálogo y armá tu pedido</div>
            <button className="btnGhost" style={{ marginTop: 20 }} onClick={onBack}>Ir al catálogo</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fadeIn">
      <button className="backLink" onClick={onBack}><Icon name="back" size={14} /> Seguir comprando</button>
      <div className="cartWrap">
        <div className="cartTitle">Tu carrito</div>
        <div className="cartSub">{cart.length} producto{cart.length > 1 ? "s" : ""} en tu pedido</div>

        {cart.map((it, i) => (
          <div key={i} className="cartItem">
            <div className="cartItemImg">
              {it.image
                ? <img src={`/productos/${it.image}`} alt={it.name} onError={e => { e.target.style.display = "none"; }} />
                : <span>{getPlaceholder(it.category)}</span>
              }
            </div>
            <div className="cartItemInfo">
              <div className="cartItemName">{it.name}</div>
              <div className="cartItemPres">Presentación: {it.pres.label} · Cantidad: {it.qty}</div>
              <div className="cartItemPrice">{fmt(it.pres.price * it.qty)}</div>
            </div>
            <div className="cartItemActions">
              <button className="removeBtn" onClick={() => onRemove(i)} title="Quitar">×</button>
              <div className="qtyCtl">
                <button className="qtyBtn" onClick={() => onUpdateQty(i, -1)}>−</button>
                <span className="qtyVal">{it.qty}</span>
                <button className="qtyBtn" onClick={() => onUpdateQty(i, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}

        <div className="cartSummary">
          <div className="summaryRow"><span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span><span>{fmt(subtotal)}</span></div>
          <div className="summaryRow"><span>Envío</span><span style={{ fontStyle: "italic", color: "var(--txL)", fontSize: 12 }}>A coordinar por WhatsApp</span></div>
          <div className="summaryRow total"><span>Total estimado</span><span>{fmt(subtotal)}</span></div>
          <div className="summaryNote">Sujeto a confirmación de disponibilidad. Vigencia de precios: 7 días.</div>
        </div>

        <button className="btnPrimary" style={{ marginTop: 20 }} onClick={onCheckout}>
          Finalizar pedido →
        </button>
      </div>
    </main>
  );
}
