// ═══════════════════════════════════════════════════════
// VALIDACIÓN DE STOCK
// Lógica para determinar cuánto stock queda disponible,
// considerando lo que ya está en el carrito. Soporta
// productos "por unidad" (miel, aceite) y "por peso"
// (almendras, chía), con conversión de unidades.
// ═══════════════════════════════════════════════════════

// Convierte la cantidad de una presentación a la unidad base del producto.
// Ejemplo: producto con unit="kg", presentación {qty:500, unit:"g"} → 0.5
export function presentationToBaseQty(product, pres) {
  if (!product || !pres) return 0;
  const u = pres.unit;
  const pu = product.unit;
  if (u === pu) return pres.qty;
  if (u === "g"    && pu === "kg")   return pres.qty / 1000;
  if (u === "100g" && pu === "kg")   return pres.qty / 10;
  if (u === "kg"   && pu === "g")    return pres.qty * 1000;
  if (u === "kg"   && pu === "100g") return pres.qty * 10;
  if (u === "100g" && pu === "g")    return pres.qty * 100;
  if (u === "g"    && pu === "100g") return pres.qty / 100;
  return pres.qty; // unidades no reconocidas: asumimos misma unidad
}

// Suma lo que ya hay en el carrito del mismo producto, convertido a la unidad base.
export function getStockInCart(product, cart) {
  if (!cart || !product) return 0;
  return cart
    .filter(item => item.productId === product.id)
    .reduce((sum, item) => sum + presentationToBaseQty(product, item.pres) * item.qty, 0);
}

// Devuelve el stock disponible restante (en la unidad base del producto).
// Si el JSON es viejo y no trae el campo stock, devuelve Infinity (no limita).
export function getRemainingStock(product, cart) {
  if (product.stock === undefined || product.stock === null) return Infinity;
  const totalStock = Number(product.stock) || 0;
  const inCart = getStockInCart(product, cart);
  return Math.max(0, totalStock - inCart);
}

// Cantidad máxima de la presentación que todavía se puede agregar al carrito.
export function getMaxQtyForPresentation(product, pres, cart) {
  const remaining = getRemainingStock(product, cart);
  if (remaining === Infinity) return Infinity;
  const presQtyInBase = presentationToBaseQty(product, pres);
  if (presQtyInBase <= 0) return Infinity;
  return Math.floor(remaining / presQtyInBase);
}

// Lo mismo pero considerando que una cantidad X de esta presentación ya está
// contabilizada en el carrito (para los controles +/- en el carrito).
export function getMaxQtyForCartItem(product, pres, currentQtyInCart, cart) {
  if (product.stock === undefined || product.stock === null) return Infinity;
  const totalStock = Number(product.stock) || 0;
  const inCart = getStockInCart(product, cart);
  const presQtyInBase = presentationToBaseQty(product, pres);
  if (presQtyInBase <= 0) return Infinity;
  // Lo que ya ocupa este item en el carrito
  const thisItemInBase = presQtyInBase * currentQtyInCart;
  // Lo que ocupan OTROS items del mismo producto
  const othersInBase = inCart - thisItemInBase;
  // Stock disponible para este item (sin contar otros)
  const availableForThis = totalStock - othersInBase;
  return Math.floor(availableForThis / presQtyInBase);
}

// Devuelve el stock como texto formateado para mostrar al usuario.
export function formatStock(product) {
  if (product.stock === undefined || product.stock === null) return null;
  const s = Number(product.stock) || 0;
  if (product.type === "weight") {
    if (s >= 1) return `${s % 1 === 0 ? s : s.toFixed(2)} ${product.unit}`;
    if (product.unit === "kg") return `${Math.round(s * 1000)} g`;
    return `${s} ${product.unit}`;
  }
  return `${s} ${s === 1 ? product.unit : product.unit + "s"}`;
}
