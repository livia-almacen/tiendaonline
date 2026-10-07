// Format a number as ARS currency
export const fmt = (n) => "$" + Number(n).toLocaleString("es-AR");

// Compute the final price for a presentation given the base product
export function presentationPrice(product, pres) {
  // If the presentation already has a price (comes from the pricelist), use it
  if (pres.price !== undefined && pres.price !== null) return pres.price;

  const isWeight = product.type === "weight";
  if (!isWeight) return pres.qty * product.price;

  // Weight product: convert units to the product's base unit
  let qtyInBase = pres.qty;
  const u = pres.unit;
  const pu = product.unit;
  if (u === "g" && pu === "kg") qtyInBase = pres.qty / 1000;
  else if (u === "100g" && pu === "kg") qtyInBase = pres.qty / 10;
  else if (u === "kg" && pu === "g") qtyInBase = pres.qty * 1000;
  else if (u === "kg" && pu === "100g") qtyInBase = pres.qty * 10;
  else if (u === "100g" && pu === "g") qtyInBase = pres.qty * 100;
  else if (u === "g" && pu === "100g") qtyInBase = pres.qty / 100;

  return qtyInBase * product.price;
}
