# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Proyecto

Plataforma web de seguimiento a egresados del programa **La Universidad en el Campo** del Comité de Cafeteros de Caldas. El formulario físico de referencia está en [docs/Anexo 5. Seguimiento de Egresados.pdf](docs/Anexo%205.%20Seguimiento%20de%20Egresados.pdf) y la especificación completa en [PROYECTO.md](PROYECTO.md).

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (JSX), sin librerías de UI externas |
| API / Backend | Google Apps Script (GAS) Web App |
| Base de datos | Google Sheets (4 pestañas) |
| Despliegue | GitHub Pages vía GitHub Actions |
| Gráficas (admin) | Recharts |

---

## Comandos

Cada app (`formulario/` y `admin/`) se maneja de forma independiente:

```bash
cd formulario   # o cd admin
npm install
npm run dev     # servidor de desarrollo
npm run build   # build para producción (output en dist/)
npm run preview # previsualizar el build
```

El despliegue a GitHub Pages lo hace el workflow `.github/workflows/deploy.yml` automáticamente en cada push a `main` — construye ambas apps y publica en la rama `gh-pages`.

---

## Arquitectura

```
formulario/   →  GET  VITE_GAS_URL?action=listas    (carga selects al montar)
              →  POST VITE_GAS_URL                   (envío del formulario)

admin/        →  GET  VITE_GAS_URL?action=registros          (todos los registros)
              →  GET  VITE_GAS_URL?action=registros&token=xxx (filtrado por institución)

gas/Code.gs   →  Google Sheets (4 pestañas: respuestas, instituciones, universidades, config)
```

**Variable de entorno requerida en ambas apps:**
```env
# formulario/.env  y  admin/.env
VITE_GAS_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
```

---

## Estructura `formulario/src/`

- `sections/` — Un componente por sección (`Section1.jsx` … `Section8.jsx`). Navegación lineal con barra de progreso.
- `hooks/useFormulario.js` — Estado global del formulario y lógica de envío.
- `utils/` — `validarCampos.js`, `formatearFecha.js`, etc.

**Datos hardcodeados en el frontend** (no vienen de GAS):
- Los 27 municipios de Caldas para los selects de residencia (s1) y bachillerato (s2.1).

**Datos que sí vienen de GAS** (`action=listas`):
- Instituciones educativas por municipio (para el select s2.2, dependiente del municipio elegido en s2.1).
- Lista de universidades (s2.10).

---

## Estructura `admin/src/`

- `views/` — `Dashboard.jsx`, `TablaEgresados.jsx`, `DetalleEgresado.jsx`, `Instituciones.jsx`.
- `hooks/useEgresados.js` — Carga y filtrado de registros.
- Ruta `/?token=xxx` muestra una vista reducida solo con datos de la institución del token.

---

## GAS — notas críticas

El código completo de `gas/Code.gs` está en [GAS.md](GAS.md). Puntos clave:

- **POST con CORS:** GAS no acepta `Content-Type: application/json` desde orígenes externos. El formulario debe enviar el body como `text/plain`; GAS lo parsea con `JSON.parse(e.postData.contents)`. No cambiar este patrón.
- **Arrays → Sheets:** Los checkboxes con múltiples valores se aplanan a string separado por comas con la función `aplanar()`. Al leerlos desde el admin hay que hacer `split(', ')`.
- **Encabezados automáticos:** `guardarRespuesta()` crea los encabezados en la primera fila la primera vez que se envía un formulario (si la pestaña `respuestas` está vacía).
- **Nueva implementación requerida:** Cada cambio en `Code.gs` requiere crear una nueva implementación en GAS (no editar la existente) para que tome efecto en producción.
- **`generarTokensFaltantes()`:** Función manual que se ejecuta desde el editor de GAS cuando se agregan instituciones nuevas al Sheets sin `id`/`token`/`url`. Lee `dominio_github_pages` de la pestaña `config` para construir las URLs.

---

## Convenciones de código

- Componentes: PascalCase (`FormularioSection1.jsx`)
- Hooks: prefijo `use` (`useFormulario.js`)
- Utilidades: camelCase (`formatearFecha.js`)
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

## Vite config — bases para GitHub Pages

```js
// formulario/vite.config.js
base: '/seguimiento-egresados/formulario/'

// admin/vite.config.js
base: '/seguimiento-egresados/admin/'
```

Después del primer despliegue, actualizar `dominio_github_pages` en la pestaña `config` del Sheets para que `generarTokensFaltantes()` construya las URLs correctas.
