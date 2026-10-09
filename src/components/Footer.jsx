import { useState } from 'react';

export default function Footer({ store }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [darkLogoFailed, setDarkLogoFailed] = useState(false);

  // Footer tiene fondo oscuro siempre -> intentamos usar la versión con fondo transparente/claro
  const logoSrc = !darkLogoFailed ? "/logo-dark.png" : "/logo.png";

  const zones = (store?.deliveryZones || []).join(" · ");

  return (
    <footer>
      {!logoFailed && (
        <img
          className="fLogoImg"
          src={logoSrc}
          alt={store?.name || "Livia"}
          onError={() => {
            if (!darkLogoFailed) {
              setDarkLogoFailed(true); // try /logo.png
            } else {
              setLogoFailed(true); // fallback to text only
            }
          }}
        />
      )}
      {/* Only show the brand text block if the image failed OR if there's no slogan */}
      {logoFailed && (
        <>
          <div className="fLogo">{store?.name || "Livia"}</div>
          <div className="fSub">{store?.slogan || "Tienda Natural"}</div>
        </>
      )}
      <div className="fInfo">
        {zones}<br />
        {store?.whatsapp && <a href={`https://wa.me/${store.whatsapp}`}>WhatsApp</a>}
        {store?.instagram && <> · <a href={`https://instagram.com/${store.instagram.replace("@","")}`} target="_blank" rel="noreferrer">Instagram</a></>}
      </div>
      {store?.hours && <div className="fInfo" style={{ marginTop: 8, fontSize: 12 }}>{store.hours}</div>}
      {store?.address && <div className="fInfo" style={{ marginTop: 4, fontSize: 12 }}>{store.address}</div>}
      <div className="fInfo" style={{ marginTop: 14, fontSize: 11, opacity: .6 }}>
        Vigencia de precios: 7 días posteriores a la fecha de publicación
      </div>
    </footer>
  );
}
