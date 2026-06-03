# PLAN.md — Plan de implementación
## Sistema de Seguimiento a Egresados — Universidad en el Campo
## Comité de Cafeteros de Caldas

Este archivo es el resumen ejecutivo del plan de trabajo para Claude Code.
El contexto técnico completo está en `PROYECTO.md`.
El código de Google Apps Script está en `GAS.md`.

---

## Estructura general

9 meses divididos en 4 fases. Al cerrar cada mes se despliega en GitHub Pages.

| Mes | Fase | Actividad |
|---|---|---|
| 1 | Fundamentos | Diseño y arquitectura ✓ |
| 2 | Fundamentos | Diseño del formulario ✓ |
| 3 | Desarrollo | Setup del proyecto + GAS ← **empezamos aquí** |
| 4 | Desarrollo | Formulario — Secciones 1 a 4 |
| 5 | Desarrollo | Formulario — Secciones 5 a 8 + envío |
| 6 | Dashboard | Panel admin — estructura y datos |
| 7 | Dashboard | Panel admin — gráficas e indicadores |
| 8 | Cierre | Vistas por institución + pulimiento |
| 9 | Cierre | Pruebas, ajustes y lanzamiento |

---

## Arquitectura general

- **Una sola app React + Vite** en la raíz del repositorio.
- **Un solo `vite.config.js`**, un solo `package.json`, un solo `.env`.
- React Router maneja las rutas del formulario y del admin.
- GitHub Actions construye desde la raíz y despliega en GitHub Pages.

**Rutas:**

| Ruta | Vista |
|---|---|
| `/` | Formulario para egresados |
| `/admin` | Dashboard del panel admin |
| `/admin/egresados` | Tabla de registros con filtros |
| `/admin/egresados/:id` | Detalle de un egresado |
| `/admin/instituciones` | Tokens y enlaces por institución |
| `/admin/institucion?token=xxx` | Vista reducida por institución |

**URLs en producción:**
- Formulario: `https://alianzaeducacionrural.github.io/seguimiento-egresados/`
- Admin: `https://alianzaeducacionrural.github.io/seguimiento-egresados/admin`

---

## Mes 3 — Setup del proyecto + GAS

### Objetivo
Repositorio inicializado, app corriendo en GitHub Pages y GAS desplegado.

### Acciones

**1. Inicializar la app React + Vite en la raíz**
```bash
# Desde la raíz del repositorio (ya clonado)
npm create vite@latest . -- --template react
```

**2. Instalar dependencias**
```bash
npm install
npm install react-router-dom
npm install recharts
```

**3. Configurar vite.config.js**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/seguimiento-egresados/',
})
```

**4. Crear .env en la raíz**
```env
VITE_GAS_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
```
Reemplazar con la URL del Web App de GAS una vez desplegado.

**5. Crear .gitignore**
```
node_modules/
dist/
.env
.DS_Store
```

**6. Crear el workflow GitHub Actions**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**7. Copiar el código de GAS**
- Abrir el Google Sheet → Extensiones → Apps Script.
- Borrar contenido por defecto.
- Copiar el bloque de código del archivo `GAS.md`.
- Guardar y hacer nueva implementación como Web App:
  - Ejecutar como: yo
  - Acceso: cualquier usuario
- Copiar la URL generada → pegarla en `.env` como `VITE_GAS_URL`.

**8. Primer push**
```bash
git add .
git commit -m "Mes 3: setup inicial del proyecto"
git push origin main
```

### Entregable
- `https://alianzaeducacionrural.github.io/seguimiento-egresados/` → activo
- GAS respondiendo a `GET /?action=listas`

---

## Mes 4 — Formulario: Secciones 1 a 4

### Objetivo
Formulario navegable con las primeras 4 secciones, validaciones y
lógica condicional, desplegado en GitHub Pages.

### Acciones

**1. Estructura de carpetas en `src/`**
```
src/
├── components/
│   ├── CampoTexto.jsx
│   ├── CampoSelect.jsx
│   ├── CampoRadio.jsx
│   ├── CampoCheckbox.jsx
│   ├── CampoFecha.jsx
│   ├── CampoTextarea.jsx
│   ├── BarraProgreso.jsx
│   ├── BotonSiguiente.jsx
│   ├── BotonAnterior.jsx
│   └── ModalConsentimiento.jsx
├── sections/
│   ├── Seccion1.jsx  →  Seccion8.jsx
├── admin/
│   ├── components/
│   └── views/
├── hooks/
│   ├── useFormulario.js
│   ├── useListas.js
│   └── useEgresados.js
├── utils/
│   ├── api.js
│   ├── validaciones.js
│   └── municipios.js
├── App.jsx
└── main.jsx
```

**2. Municipios en `src/utils/municipios.js`**
```js
export const MUNICIPIOS_CALDAS = [
  'Aguadas','Anserma','Aranzazu','Belalcázar','Chinchiná',
  'Filadelfia','La Dorada','La Merced','Manizales','Manzanares',
  'Marmato','Marquetalia','Marulanda','Neira','Norcasia',
  'Pácora','Palestina','Pensilvania','Riosucio','Risaralda',
  'Salamina','Samaná','San José','Supía','Victoria',
  'Villamaría','Viterbo',
];
```

**3. Hook `useListas`** — al montar la app hace `GET /?action=listas`
y guarda municipios, instituciones y universidades en estado global.

**4. Sección 1** — tipo documento, número, nombre, fecha nacimiento,
municipio residencia (select hardcodeado + campo "Otro"), correo,
teléfono, zona rural/urbana.

**5. Sección 2** — lógica condicional completa según `PROYECTO.md`.
Municipio bachillerato: hardcodeado. IE bachillerato: dependiente de municipio,
desde GAS. Universidad: select desde GAS. Años: 2010 → año actual.

**6. Sección 3** — situación laboral. Preguntas 3.3–3.7 visibles
solo si trabaja o ha trabajado.

**7. Sección 4** — emprendimiento. Tipo visible solo si ha emprendido.

**8. Diseño mobile-first**, sin librerías de UI externas. CSS Modules.

### Entregable
Formulario con secciones 1–4 navegables y validadas en GitHub Pages.

---

## Mes 5 — Formulario: Secciones 5 a 8 + envío

### Objetivo
Formulario 100% funcional con envío real a Google Sheets.

### Acciones

**1. Sección 5** — PPPS. Área y aplicación visibles si implementó PPPS.

**2. Sección 6** — impacto social. Razón visible si empalme = Sí.

**3. Sección 7** — retroalimentación. Estrategias checkbox múltiple,
aspectos y comentarios en textarea.

**4. Sección 8** — contacto y autorización.
- Checkbox de consentimiento requerido para enviar.
- Enlace "Ver texto completo" abre modal con la autorización íntegra
  (Ley 1581 de 2012, texto del formulario físico en `docs/`).

**5. Integración con GAS**
```js
// src/utils/api.js
export async function enviarFormulario(datos) {
  const res = await fetch(import.meta.env.VITE_GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(datos),
  });
  return res.json();
}
```
Nota: `Content-Type: text/plain` es requisito de GAS para recibir POST.

**6. Pantalla de confirmación** tras envío exitoso.

**7. Manejo de errores** de red con mensajes claros al usuario.

### Entregable
Formulario completo con envío real a Google Sheets.

---

## Mes 6 — Panel admin: estructura y datos

### Objetivo
Panel admin con navegación, tabla de egresados y detalle individual.

### Acciones

**1. React Router** — configurar todas las rutas del admin en `App.jsx`.

**2. Layout del admin** — Sidebar + Header compartidos en rutas `/admin/*`.

**3. Vista tabla `/admin/egresados`**
- Columnas: nombre, municipio, IE, año graduación, trabaja, fecha envío.
- Filtros: municipio, institución, año de graduación, búsqueda por nombre.
- Paginación de 20 registros por página.
- Botón "Exportar CSV".

**4. Vista detalle `/admin/egresados/:id`**
- Todas las respuestas organizadas por sección.
- Botón volver.

**5. Vista instituciones `/admin/instituciones`**
- Tabla con municipio, institución, token y botón "Copiar enlace".

**6. Hook `useEgresados`** — hace `GET /?action=registros` y expone
los datos al panel admin.

### Entregable
Panel admin con tabla, detalle e instituciones con datos reales.

---

## Mes 7 — Panel admin: gráficas e indicadores

### Objetivo
Dashboard con métricas clave y gráficas interactivas (Recharts).

### Acciones

**1. Métricas principales**
- Total egresados, % continuaron estudios, % estudió con UEC,
  % trabaja actualmente, % ha emprendido.

**2. Gráficas con Recharts**
- Distribución por municipio → BarChart horizontal
- Sector laboral → PieChart
- Continuidad educativa → BarChart agrupado
- Tipo de emprendimiento → PieChart
- ¿Recomendaría el modelo? → PieChart
- Egresados por año de graduación → LineChart

**3. Filtros cruzados** — filtrar todas las gráficas por municipio,
institución y año de graduación.

**4. Vista institución `/admin/institucion?token=xxx`**
- Panel reducido con las mismas gráficas filtradas por token.
- Sin sidebar. Header con nombre de la institución.
- Token inválido → mensaje de error.

**5. Diseño responsive** para tablet y móvil.

### Entregable
Dashboard completo con gráficas, filtros y vista por institución.

---

## Mes 8 — Pulimiento y pruebas internas

### Objetivo
Sistema completo revisado y probado con el equipo del Comité.

### Acciones

**1. Revisión del formulario** en móvil, tablet y escritorio.
**2. Verificar lógica condicional** completa en todas las secciones.
**3. Verificar datos** en Google Sheets tras envíos de prueba.
**4. Revisión del admin** — gráficas, filtros, exportación, tokens.
**5. Estados de carga** en todas las peticiones a GAS.
**6. Manejo de error** si GAS no responde.
**7. Prueba interna** con el equipo del Comité y ajustes finales.
**8. Ejecutar `generarTokensFaltantes()`** en GAS para todas las instituciones.

### Entregable
Sistema completo probado internamente, tokens generados para todas las IEs.

---

## Mes 9 — Lanzamiento

### Objetivo
Lanzamiento oficial con instituciones piloto y documentación entregada.

### Acciones

**1. Piloto** con 2–3 instituciones. Recoger feedback.
**2. Ajustes finales** según feedback.
**3. Compartir enlaces** a instituciones desde el panel admin.
**4. Documentación de uso** en un `.md`:
   - Cómo llenar el formulario (egresados)
   - Cómo ver datos de la institución (coordinadores)
   - Cómo gestionar el Sheets y ejecutar GAS (Comité)
**5. Dominio personalizado** (opcional) — configurar en GitHub Pages
   y actualizar `dominio_github_pages` en la pestaña `config` del Sheets.
**6. Lanzamiento oficial** con todas las instituciones del programa.

### Entregable
Sistema en producción + documentación de uso entregada.

---

## URLs del proyecto

| Recurso | URL |
|---|---|
| Repositorio | https://github.com/alianzaeducacionrural/seguimiento-egresados |
| Formulario | https://alianzaeducacionrural.github.io/seguimiento-egresados/ |
| Panel admin | https://alianzaeducacionrural.github.io/seguimiento-egresados/admin |
| Google Sheets | https://docs.google.com/spreadsheets/d/1vDxjtAe2bUPx2gUt1HMI2rlx6r1FfGBYKnv6BjaJd0k |

---

## Archivos de contexto

| Archivo | Contenido |
|---|---|
| `PROYECTO.md` | Arquitectura, stack, estructura, formulario completo, API |
| `GAS.md` | Código completo de Google Apps Script |
| `PLAN.md` | Este archivo — plan mes a mes con acciones concretas |
| `docs/Anexo_5__Seguimiento_de_Egresados.pdf` | Formulario físico original |