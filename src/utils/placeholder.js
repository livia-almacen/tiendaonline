// Returns an emoji placeholder for products without a real image
const EMOJI_BY_CATEGORY = {
  "Frutos Secos": "🌰",
  "Semillas": "🌱",
  "Cereales": "🌾",
  "Legumbres": "🫘",
  "Especias": "🌶️",
  "Infusiones": "🍵",
  "Endulzantes": "🍯",
  "Aceites": "🫒",
  "Harinas": "🌾",
  "Snacks": "🥨",
  "Bebidas": "🥤",
  "Panificados": "🍞",
};

export function getPlaceholder(category) {
  return EMOJI_BY_CATEGORY[category] || "🌿";
}
