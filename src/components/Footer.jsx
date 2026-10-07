export default function Footer({ store }) {
  const zones = (store?.deliveryZones || []).join(" · ");
  return (
    <footer>
      <div className="fLogo">{store?.name || "Livia"}</div>
      <div className="fSub">{store?.slogan || "Tienda Natural"}</div>
      <div className="fInfo">
        {zones}<br />
        {store?.whatsapp && <a href={`https://wa.me/${store.whatsapp}`}>WhatsApp</a>}
        {store?.instagram && <> · <a href={`https://instagram.com/${store.instagram.replace("@","")}`} target="_blank" rel="noreferrer">Instagram</a></>}
      </div>
      {store?.hours && <div className="fInfo" style={{ marginTop: 8, fontSize: 12 }}>{store.hours}</div>}
      <div className="fInfo" style={{ marginTop: 14, fontSize: 11, opacity: .6 }}>
        Vigencia de precios: 7 días posteriores a la fecha de publicación
      </div>
    </footer>
  );
}
