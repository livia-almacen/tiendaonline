import { useState } from 'react';
import { fmt } from '../utils/format';
import { Icon } from '../utils/icons';

export default function CheckoutView({ store, cart, subtotal, onBack, onSent }) {
  const [delivery, setDelivery] = useState("envio"); // "envio" | "retiro"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState(store?.deliveryZones?.[0] || "");
  const [notes, setNotes] = useState("");

  const zones = store?.deliveryZones || [];

  const isValid = name.trim() && phone.trim() && (delivery === "retiro" || (address.trim() && zone));

  const buildMessage = () => {
    const lines = [];
    lines.push(`🌿 *NUEVO PEDIDO - ${store?.name || "Livia"}*`);
    lines.push("");
    lines.push("📋 *Detalle del pedido:*");
    cart.forEach(it => {
      lines.push(`• ${it.name} ${it.pres.label} x${it.qty} — ${fmt(it.pres.price * it.qty)}`);
    });
    lines.push("");
    lines.push(`💰 *Total estimado:* ${fmt(subtotal)}`);
    if (delivery === "envio") lines.push("_(no incluye costo de envío)_");
    lines.push("");
    lines.push("👤 *Cliente:*");
    lines.push(`Nombre: ${name}`);
    lines.push(`Teléfono: ${phone}`);
    lines.push("");
    lines.push("📦 *Entrega:*");
    if (delivery === "retiro") {
      lines.push(`Retiro en local (${store?.address || "a coordinar"})`);
    } else {
      lines.push(`Envío a domicilio`);
      lines.push(`Dirección: ${address}`);
      lines.push(`Zona: ${zone}`);
      lines.push("_El costo del envío se coordina según distancia y monto del pedido._");
    }
    if (notes.trim()) {
      lines.push("");
      lines.push(`📝 Notas: ${notes}`);
    }
    lines.push("");
    lines.push(`🕐 Enviado: ${new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}`);
    return lines.join("\n");
  };

  const handleSend = () => {
    if (!isValid) return;
    const msg = encodeURIComponent(buildMessage());
    const whatsapp = store?.whatsapp;
    if (!whatsapp) {
      alert("Falta configurar el número de WhatsApp del negocio");
      return;
    }
    const url = `https://wa.me/${whatsapp}?text=${msg}`;
    window.open(url, "_blank");
    if (onSent) onSent();
  };

  return (
    <main className="fadeIn">
      <button className="backLink" onClick={onBack}><Icon name="back" size={14} /> Volver al carrito</button>
      <div className="checkWrap">
        <div className="cartTitle" style={{ marginBottom: 20 }}>Finalizar pedido</div>

        <div className="formSection">
          <div className="formTitle">📦 ¿Cómo querés recibirlo?</div>
          <div className="deliveryOpts">
            <div className={`deliveryOpt ${delivery === "retiro" ? "selected" : ""}`} onClick={() => setDelivery("retiro")}>
              <div className="icon">🏪</div>
              <div className="title">Retiro en local</div>
              <div className="sub">{store?.address || "Coordinamos horario"}</div>
            </div>
            <div className={`deliveryOpt ${delivery === "envio" ? "selected" : ""}`} onClick={() => setDelivery("envio")}>
              <div className="icon">🛵</div>
              <div className="title">Envío a domicilio</div>
              <div className="sub">Jesús María y zona</div>
            </div>
          </div>
          {delivery === "envio" && (
            <div className="envInfo">
              <strong>Costo del envío:</strong> se coordina por WhatsApp según distancia y monto del pedido. Zonas: {zones.join(", ")}.
            </div>
          )}
        </div>

        <div className="formSection">
          <div className="formTitle">👤 Tus datos</div>
          <div className="field">
            <label>Nombre y apellido *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Juan Pérez" />
          </div>
          <div className="field">
            <label>Teléfono *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="3515551234" inputMode="tel" />
          </div>
          {delivery === "envio" && (
            <>
              <div className="field">
                <label>Dirección *</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Belgrano 456" />
              </div>
              <div className="field">
                <label>Localidad *</label>
                <select value={zone} onChange={e => setZone(e.target.value)}>
                  {zones.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="field">
            <label>Notas (opcional)</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preferencias, horarios, instrucciones de entrega..." />
          </div>
        </div>

        <div className="formSection">
          <div className="formTitle">💰 Resumen del pedido</div>
          <div className="summaryRow"><span>{cart.length} producto{cart.length > 1 ? "s" : ""} ({cart.reduce((s, i) => s + i.qty, 0)} items)</span><span>{fmt(subtotal)}</span></div>
          <div className="summaryRow total"><span>Total estimado</span><span>{fmt(subtotal)}</span></div>
        </div>

        <button className="whatsBtn" onClick={handleSend} disabled={!isValid} style={!isValid ? { opacity: .5, cursor: "not-allowed", boxShadow: "none" } : {}}>
          <Icon name="whats" size={22} color="#fff" />
          Enviar pedido por WhatsApp
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--txL)", marginTop: 12 }}>
          Al enviar, se abre WhatsApp con tu pedido ya redactado para que lo mandes al negocio.
        </p>
      </div>
    </main>
  );
}
