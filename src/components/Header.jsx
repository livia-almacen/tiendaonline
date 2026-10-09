import { Icon } from '../utils/icons';

export default function Header({ cartCount, onGoHome, onGoCart, theme, onToggleTheme }) {
  return (
    <header className="header">
      {/* El logo se movió al hero, el header queda solo con las acciones a la derecha */}
      <div className="headerSpacer" onClick={onGoHome}></div>
      <div className="hActions">
        <button className="iconBtn" title={theme === "dark" ? "Modo claro" : "Modo oscuro"} onClick={onToggleTheme}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
        </button>
        <button className="iconBtn" title="Carrito" onClick={onGoCart}>
          <Icon name="cart" size={20} />
          {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
