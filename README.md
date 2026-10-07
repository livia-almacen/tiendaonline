# Livia Tienda - Catálogo web + Pedidos por WhatsApp

Web pública de **Livia Tienda Natural** (dietética en Jesús María, Córdoba).
Catálogo navegable + carrito + checkout que arma el pedido como mensaje de WhatsApp.

Alimentada por el JSON que exporta la app de gestión **Amapola**,
servido desde un GitHub Gist (para no requerir redeploy en cada actualización).

## Stack

- React 18 + Vite 5
- CSS plano con variables para tema claro/oscuro
- localStorage para persistir carrito y preferencia de tema
- Catálogo servido desde un GitHub Gist (editable en caliente)
- Deploy en Netlify

---

## Instalación local (primera vez)

### Requisitos
- Node.js 18+ instalado ([descargar](https://nodejs.org))
- Git ([descargar](https://git-scm.com/download/win)) si lo vas a versionar

### Pasos

```bash
cd livia-tienda
npm install
npm run dev
```

Abre http://localhost:5173 y verás el catálogo de ejemplo desde /public/catalogo.json

Para probar la versión de producción localmente:
```bash
npm run build
npm run start
```

---

## Configurar el GitHub Gist (una sola vez)

El catálogo real NO vive dentro del proyecto. Vive en un GitHub Gist
que podés editar desde la web sin tocar código ni redeployar.

### 1. Crear el Gist

- Entrá a https://gist.github.com (logueado con tu usuario)
- En "Filename including extension": `catalogo.json`
- En el contenido: pegá el JSON que exportaste desde Amapola
- Elegí **Create secret gist**
  - "Secret" quiere decir que no sale listado en tu perfil ni en búsquedas
  - PERO sigue siendo accesible por cualquiera que tenga el link
  - Es la opción correcta para este uso (los precios son públicos de todas formas)

### 2. Obtener la URL raw

- Una vez creado el Gist, hacé clic en el botón **Raw** arriba a la derecha del archivo
- Se abre el JSON crudo en una nueva pestaña
- Copiá la URL de esa pestaña. Va a tener este formato:
  ```
  https://gist.githubusercontent.com/TU_USUARIO/GIST_ID/raw/COMMIT_HASH/catalogo.json
  ```

### 3. Limpiar la URL (⚠ paso importante)

Tenés que **borrar el `/COMMIT_HASH/`** del medio. Debe quedar así:
```
https://gist.githubusercontent.com/TU_USUARIO/GIST_ID/raw/catalogo.json
```

**Por qué:** si dejás el commit hash, la URL apunta a UNA versión específica del Gist.
Cuando edites el Gist después, la web va a seguir leyendo la versión vieja.
Al borrar el hash, la URL apunta siempre a la última versión.

### 4. Pegarla en el proyecto

Abrí `src/config.js` y pegá la URL en `CATALOG_GIST_URL`:

```js
export const CATALOG_GIST_URL = "https://gist.githubusercontent.com/TU_USUARIO/GIST_ID/raw/catalogo.json";
```

Guardá, hacé `git commit` y `git push`. Netlify rebuildea una vez con el nuevo config
y a partir de ahí la web lee siempre del Gist.

---

## Flujo de actualización del catálogo

Cuando necesites cambiar precios, agregar productos, etc:

1. En Amapola → pestaña **Catálogo Web** → **Exportar catálogo JSON**
2. Abrís el Gist en gist.github.com
3. Clic en **Edit**
4. Borrás todo el contenido viejo y pegás el nuevo JSON
5. Clic en **Update secret gist** abajo
6. **Listo**. La web muestra el catálogo nuevo en los próximos minutos
   (el CDN de GitHub cachea raw de Gist ~5 minutos)

No hace falta commits, pushes, deploys ni esperar a Netlify.

---

## Estructura del proyecto

```
livia-tienda/
├── public/
│   ├── catalogo.json         ← Fallback local (sólo para dev)
│   ├── favicon.svg
│   └── productos/            ← Imágenes de productos
├── src/
│   ├── main.jsx
│   ├── App.jsx               ← Root component
│   ├── config.js             ← ⭐ URL del Gist se configura acá
│   ├── styles.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── views/
│   │   ├── CatalogView.jsx
│   │   ├── ProductDetailView.jsx
│   │   ├── CartView.jsx
│   │   └── CheckoutView.jsx
│   ├── hooks/
│   │   ├── useCatalog.js     ← Lee del Gist o del local según config
│   │   ├── useCart.js
│   │   └── useTheme.js
│   └── utils/
│       ├── format.js
│       ├── icons.jsx
│       └── placeholder.js
├── index.html
├── vite.config.js
├── netlify.toml
└── package.json
```

---

## Agregar imágenes de productos

Las imágenes SÍ viven dentro del proyecto (no en el Gist, porque el Gist solo es para texto):

1. Preparar la foto cuadrada, ideal 800×800 px, formato .jpg o .webp, bajo 200KB
2. Guardarla en `public/productos/` con el nombre exacto que configuraste en Amapola
   - Si en Amapola el campo `webImage` dice `almendras-naturales.jpg`,
     el archivo debe estar en `public/productos/almendras-naturales.jpg`
3. Commit y push al repo

Los productos sin imagen muestran un emoji por categoría. No rompen la web.

---

## Deploy en Netlify

1. Crear cuenta gratuita en netlify.com
2. Conectar la cuenta con GitHub
3. Netlify dashboard → **Add new site** → **Import from Git** → **GitHub**
4. Seleccionar el repo `livia-tienda`
5. La configuración viene del `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy site** → tarda ~1 minuto
7. Queda en `https://<nombre>.netlify.app`
8. En Site settings → Change site name → `livia-tienda` para que quede `livia-tienda.netlify.app`

### Dominio propio
Si querés usar `livia.com.ar` por ejemplo:
1. Comprarlo en nic.ar (~$15.000/año)
2. En Netlify → Domain management → Add custom domain
3. Seguir las instrucciones para apuntar los DNS

---

## Mantenimiento

- **Carrito**: se guarda en `localStorage` del navegador del cliente (clave `livia_cart_v1`)
- **Preferencia de tema**: se guarda en `localStorage` (clave `livia_theme`)
- **Caché del Gist**: GitHub cachea el raw ~5 minutos. Para forzar refresh antes,
  el navegador del cliente tiene que hacer hard-reload (Ctrl+F5)

---

## Modos de operación

- **Dev local sin Gist**: dejás `CATALOG_GIST_URL = ""` en config.js y la web lee de `/public/catalogo.json`
- **Prod con Gist**: `CATALOG_GIST_URL` tiene la URL del Gist y la web la usa
- **Fallback automático**: si el Gist falla (red, down, URL mal), la web intenta
  caer al `/public/catalogo.json` como respaldo. Útil para evitar quedar sin
  nada que mostrar si GitHub tiene un bache.
