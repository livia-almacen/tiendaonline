// ═══════════════════════════════════════════════════════
// CONFIGURACIÓN DEL CATÁLOGO
// ═══════════════════════════════════════════════════════
//
// La web lee el catálogo desde un GitHub Gist (recomendado) o,
// si CATALOG_GIST_URL está vacía, desde /public/catalogo.json
// como fallback local.
//
// CÓMO CONFIGURAR EL GIST:
//
// 1. Entrá a https://gist.github.com (logueado con tu cuenta de GitHub)
// 2. En "Filename including extension" poné: catalogo.json
// 3. En el contenido pegá el JSON que exportaste desde Amapola
// 4. Elegí "Create secret gist" (no es privado, pero no sale listado
//    públicamente ni es indexable por buscadores)
// 5. Una vez creado, hacé clic en el botón "Raw" (arriba a la derecha
//    del archivo). Se abre una nueva pestaña con el JSON crudo.
// 6. Copiá la URL de esa pestaña. Va a tener este formato:
//
//    https://gist.githubusercontent.com/USUARIO/GIST_ID/raw/COMMIT_HASH/catalogo.json
//
// 7. ⚠ IMPORTANTE: BORRÁ el /COMMIT_HASH/ de la URL así:
//
//    https://gist.githubusercontent.com/USUARIO/GIST_ID/raw/catalogo.json
//
//    Esto hace que la URL siempre apunte a la ÚLTIMA versión del Gist.
//    Si dejás el hash, la web quedará leyendo siempre la versión del
//    momento del copy-paste y no verá actualizaciones.
//
// 8. Pegá esa URL abajo entre las comillas.
//
// Para actualizar el catálogo después:
//   - Entrás al Gist → Edit → reemplazás el contenido → Save
//   - La web lee la versión nueva al instante (con ~5min de caché del CDN)
//
// ═══════════════════════════════════════════════════════

export const CATALOG_GIST_URL = "";

// Dejar en "" para usar el /public/catalogo.json local durante el desarrollo.
// Poner la URL completa del raw del Gist para producción.
//
// Ejemplo (reemplazar con la tuya):
// export const CATALOG_GIST_URL = "https://gist.githubusercontent.com/marianovc/abc123def456/raw/catalogo.json";
