# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Proyecto

Plataforma web de seguimiento a egresados del programa **La Universidad en el Campo** del Comité de Cafeteros de Caldas. El formulario físico de referencia está en [docs/Anexo 5. Seguimiento de Egresados.pdf](docs/Anexo%205.%20Seguimiento%20de%20Egresados.pdf) y la especificación completa en [PROYECTO.md](PROYECTO.md).

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (JSX), sin librerías de UI externas en el formulario |
| API / Backend | Google Apps Script (GAS) Web App |
| Base de datos | Google Sheets (4 pestañas) |
| Despliegue | GitHub Pages vía GitHub Actions |
| Gráficas (admin) | Recharts |

---

## Comandos

App unificada en la raíz del repositorio:

```bash
npm install
npm run dev     # servidor de desarrollo — http://localhost:5173
npm run build   # build para producción (output en dist/)
npm run preview # previsualizar el build
```

El despliegue a GitHub Pages lo hace el workflow `.github/workflows/deploy.yml` automáticamente en cada push a `main`.

---

## Rutas

| Ruta | Vista |
|---|---|
| `/seguimiento-egresados/` | Formulario de 8 secciones para egresados |
| `/seguimiento-egresados/admin` | Dashboard (admin completo) |
| `/seguimiento-egresados/admin/egresados` | Tabla de egresados |
| `/seguimiento-egresados/admin/egresados/:id` | Detalle de un egresado |
| `/seguimiento-egresados/admin/instituciones` | Instituciones con egresados |
| `/seguimiento-egresados/?token=xxx` | Vista de institución (sin NavBar) |

---

## Arquitectura

```
src/App.jsx   →  BrowserRouter(basename="/seguimiento-egresados/")
              →  Route "/"         → Formulario
              →  Route "/admin/*"  → AdminWrapper (carga todos los registros)
              →  ?token=xxx        → VistaInstitucion (sin Router Routes)

src/formulario/  →  GET  VITE_GAS_URL?action=listas    (carga selects al montar)
                 →  POST VITE_GAS_URL                   (envío del formulario)

src/admin/       →  GET  VITE_GAS_URL?action=registros          (todos los registros)
                 →  GET  VITE_GAS_URL?action=registros&token=xxx (filtrado por institución)

gas/Code.gs      →  Google Sheets (4 pestañas: respuestas, instituciones, universidades, config)
```

**Variable de entorno** (configurada en `.env` local; usar secret `VITE_GAS_URL` en GitHub para producción):
```env
VITE_GAS_URL=https://script.google.com/macros/s/AKfycbw2EVV2WxhZ8bI4RxJSqLCLJyfzuaE_FIugP16Pbe4ewAQm6qHRh7M0Wd1VRWuBgCZGMA/exec
```

---

## Estructura `src/`

```
src/
  App.jsx                    — Router raíz, detección de token, AdminWrapper
  App.module.css             — Estilos de estados de carga y VistaInstitucion
  formulario/
    Formulario.jsx           — Navegación entre secciones, submit
    Formulario.module.css
    sections/Section1…8.jsx  — Un componente por sección; comparten Section.module.css
    hooks/useFormulario.js   — Estado global, validación por sección y envío
    utils/municipios.js      — 27 municipios de Caldas (hardcodeado)
    utils/api.js             — cargarListas(), enviarFormulario()
    utils/validar.js         — validarSeccion(n, datos) → objeto de errores
    components/ProgressBar   — Barra de progreso de sección
    components/ConsentModal  — Modal autorización Ley 1581 (Sección 8)
  admin/
    views/Dashboard.jsx      — Métricas clave y gráficas Recharts
    views/TablaEgresados.jsx — Tabla con búsqueda y filtro; clic → /admin/egresados/:id
    views/DetalleEgresado.jsx— Todas las respuestas de un registro
    views/Instituciones.jsx  — Instituciones derivadas de registros
    hooks/useEgresados.js    — useEgresados(token) carga desde GAS; null = todos
    utils/api.js             — cargarRegistros(token)
    utils/formatear.js       — formatearFecha, formatearBooleano, formatearLabel + mapas
    components/NavBar.jsx    — Navegación sticky del admin
```

**Datos hardcodeados** (no vienen de GAS):
- 27 municipios de Caldas en `src/formulario/utils/municipios.js`

**Datos desde GAS** (`action=listas`):
- Instituciones educativas por municipio → select Section2
- Lista de universidades → select Section2

---

## GAS — notas críticas

El código completo de `gas/Code.gs` está en [GAS.md](GAS.md). Puntos clave:

- **POST con CORS:** GAS no acepta `Content-Type: application/json` desde orígenes externos. El formulario envía body como `text/plain`; GAS parsea con `JSON.parse(e.postData.contents)`. No cambiar este patrón.
- **Arrays → Sheets:** Checkboxes se aplanan a string separado por comas con `aplanar()`. Al leerlos desde el admin hacer `split(', ')`.
- **Encabezados automáticos:** `guardarRespuesta()` crea encabezados la primera vez si la pestaña `respuestas` está vacía.
- **Nueva implementación requerida:** Cada cambio en `Code.gs` requiere nueva implementación en GAS (no editar la existente).
- **`generarTokensFaltantes()`:** Función manual para crear tokens de instituciones nuevas. Lee `dominio_github_pages` de la pestaña `config`.

---

## Convenciones de código

- Componentes: PascalCase (`Section1.jsx`, `ProgressBar.jsx`)
- Hooks: prefijo `use` (`useFormulario.js`)
- Utilidades: camelCase (`formatear.js`)
- Estilos: CSS Modules (`.module.css`) por componente, diseño mobile-first

---

## Lógica condicional del formulario (resumen)

| Campo | Se muestra si... |
|---|---|
| `s1_municipio_otro` | `s1_municipio_residencia === "Otro municipio"` |
| `s2_ie_bachillerato` | `s2_municipio_bachillerato` tiene valor |
| `s2_razon_no_continuo` | `s2_continuo_superior === false` |
| `s2_nivel_uec` … `s2_anio_grad_uec` | `s2_estudio_uec === true` |
| `s2_continuo_postgrado` | `s2_estudio_uec === true` |
| `s2_nivel_postgrado` … `s2_programa_postgrado` | `s2_continuo_postgrado === true` |
| `s2_razon_no_postgrado` | `s2_continuo_postgrado === false && s2_estudio_uec === true` |
| `s3_linea_insercion` … `s3_formacion_contribuyo` | `s3_trabaja !== "no" \|\| s3_ha_trabajado === true` |
| `s4_tipo_emprendimiento` | `s4_ha_emprendido === true` |
| `s5_area_ppps`, `s5_aplica_conocimientos` | `s5_implemento_ppps === true` |
| `s6_razon_empalme` | `s6_empalme_generacional === true` |

---

## Vite config

```js
// vite.config.js (raíz)
base: '/seguimiento-egresados/'
```

Después del primer despliegue, actualizar `dominio_github_pages` en la pestaña `config` del Sheets para que `generarTokensFaltantes()` construya las URLs correctas.
