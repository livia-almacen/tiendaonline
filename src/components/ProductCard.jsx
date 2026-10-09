import { fmt } from '../utils/format';
import { getPlaceholder } from '../utils/placeholder';

export default function ProductCard({ product, onClick }) {
  const minPrice = product.presentations?.length
    ? Math.min(...product.presentations.map(p => p.price))
    : product.price;
  const stockBadge = product.stockStatus === "agotado"
    ? <span className="badge badgeStock">Agotado</span>
    : product.stockStatus === "poco"
    ? <span className="badge">Últimas unidades</span>
    : null;
  return (
    <div className="card" onClick={() => onClick(product)}>
      <div className="cardImg">
        {product.image
          ? <img src={`/productos/${product.image}`} alt={product.name} onError={e => { e.target.style.display = "none"; }} />
          : <span className="cardImgEmoji">{getPlaceholder(product.category)}</span>
        }
        {stockBadge}
      </div>
      <div className="cardBody">
        <div className="cardCat">{product.category}</div>
        <div className="cardName">{product.name}</div>
        <div className="cardPrice">
          {product.presentations?.length > 1 && <span className="from">Desde</span>}
          {fmt(minPrice)}
        </div>
      </div>
    </div>
  );
}
