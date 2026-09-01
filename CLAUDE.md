# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Graduate tracking platform ("Seguimiento a Egresados") for the **"La Universidad en el Campo" (UEC)** rural education program run by Comité de Cafeteros de Caldas, Colombia. It consists of a public multi-step form for graduates to self-report and an admin dashboard for program coordinators to view results. All data is stored in Google Sheets; the backend is a Google Apps Script (GAS) Web App.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build for production to dist/
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages at `https://alianzaeducacionrural.github.io/seguimiento-egresados/`.

## Environment

Create a `.env` file at the project root:

```env
VITE_GAS_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

The GAS URL is the "current web app URL" from the Apps Script deployment. It is read in `src/utils/api.js` (shared by the form and the admin).

## Architecture

```
React (Vite, GitHub Pages)
   ├── /                    → 8-section graduate survey form
   └── /admin/*             → Admin dashboard (currently public; token gate planned)

         ↓ fetch (GET/POST)

Google Apps Script Web App  ←→  Google Sheets (4 sheets)
  doGet(?action=listas)              respuestas    — form submissions
  doGet(?action=registros&token=)   instituciones — tokens per institution
  doGet(?action=instituciones)      universidades — university list
  doPost()                           config        — global settings
```

The app lives under `basename="/seguimiento-egresados/"` (set in both `src/App.jsx` and `vite.config.js`).

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Formulario` | 8-section graduate form (public) |
| `/admin` | `Dashboard` | Summary cards (charts land in Mes 7) |
| `/admin/egresados` | `TablaEgresados` | Searchable/filterable table, 20/page, CSV export |
| `/admin/egresados/:id` | `DetalleEgresado` | Individual record detail (`:id` = original index) |
| `/admin/instituciones` | `Instituciones` | Institution list with shareable token links |
| `/admin/institucion?token=xxx` | _(planned, Mes 7)_ | Institution-scoped reduced view |
| `*` | redirect → `/` | Unknown paths |

The admin section detects a `?token=xxx` query param to filter records per institution. No login — auth is token-based.

## Source Structure

The form lives at the top level of `src/` (flat, no `src/formulario/` folder);
everything admin-related lives under `src/admin/`.

```
src/
├── App.jsx                   # Root router (form route + nested /admin routes)
├── Formulario.jsx            # Section navigation + submit
├── Formulario.module.css
├── sections/                 # Seccion1.jsx … Seccion8.jsx (+ Seccion.module.css)
├── components/               # CampoTexto/Select/Radio/Checkbox/Fecha/Textarea, BarraProgreso, ModalConsentimiento
├── hooks/
│   ├── useFormulario.js      # form state + submit
│   └── useListas.js          # GET ?action=listas (municipios, instituciones, universidades)
├── utils/
│   ├── api.js                # cargarListas, cargarRegistros, cargarInstituciones, enviarFormulario
│   ├── validaciones.js       # validarSeccion(n, datos)
│   └── municipios.js         # 27 Caldas municipalities (hardcoded, single source of truth)
└── admin/
    ├── AdminLayout.jsx       # sidebar + header + <Outlet>; loads registros once, shares via useOutletContext()
    ├── Admin.module.css      # shared styles for all admin views
    ├── hooks/useEgresados.js # GET ?action=registros; adds stable _id (original index)
    ├── utils/
    │   ├── formatear.js      # coded-value → label maps, date formatting
    │   ├── campos.js         # answer structure grouped by section (drives detail view + CSV)
    │   └── exportarCsv.js    # client-side CSV download of filtered rows
    └── views/
        ├── Dashboard.jsx        # /admin — summary cards (charts deferred to Mes 7)
        ├── TablaEgresados.jsx   # /admin/egresados — search + municipio/institución/año filters, 20/page, CSV
        ├── DetalleEgresado.jsx  # /admin/egresados/:id — all answers by section
        └── Instituciones.jsx    # /admin/instituciones — municipio/institución/token + copy-link
```

## Google Apps Script — Critical Notes

`gas/Code.gs` + `gas/appsscript.json` are the versioned source of truth; `GAS.md` mirrors the code and documents setup/deploy.

- **Deploy with clasp:** `@google/clasp` (global) is authenticated as the sheet owner; `gas/.clasp.json` holds the Script ID. Workflow: `npm run gas:push` → `npm run gas:version -- "msg"` (prints `Created version N`) → `npm run gas:redeploy -- -V N -d "msg"`. Always `redeploy` the **existing** production deployment `AKfycbw2EVV2WxhZ8bI4RxJSqLCLJyfzuaE_FIugP16Pbe4ewAQm6qHRh7M0Wd1VRWuBgCZGMA` (the one behind `VITE_GAS_URL`) — never `clasp deploy`, which mints a new URL. `AKfycbygk…` is the `@HEAD` test deployment (serves the last push).
- **CORS:** GAS does not support preflight requests. The frontend must send POST with `Content-Type: text/plain` (not `application/json`) to avoid triggering a preflight. The body is still JSON-stringified.
- **Array fields:** GAS flattens repeated-value fields (checkboxes) by joining with `, ` via the `aplanar()` helper before writing to Sheets.
- **Token generation:** Run `generarTokensFaltantes()` manually from the Apps Script editor after adding new institutions to the `instituciones` sheet. It writes `url` as `<dominio>/admin/institucion?token=<token>` via the `urlInstitucion()` helper. `migrarUrlsInstituciones()` rewrites every `url` cell if that format ever changes.
- **GET action routing:** `doGet(e)` switches on `e.parameter.action` (`listas`, `registros`, or `instituciones`). `instituciones` (added Mes 6, live since deployment v4) returns the full institution list with `id`, `municipio`, `nombre`, `token`, `url`.

## Form — Section Summary

| Section | Topic |
|---|---|
| 1 | Personal info (ID, name, birthdate, municipality, contact, zone) |
| 2 | Educational trajectory (high school, university, postgrad) |
| 3 | Employment (current/past work, sector, relation to UEC) |
| 4 | Entrepreneurship (projects, rotation fund, business line) |
| 5 | Pedagogical projects (PPP implementation) |
| 6 | Social impact (generational overlap) |
| 7 | Feedback (strategies, improvements, recommendations) |
| 8 | Contact & data-treatment consent (Law 1581) |

Key conditional logic: fields in sections 2–4 are gated behind yes/no questions (e.g., continued studies, currently employed, has an enterprise). `validarSeccion()` in `src/utils/validaciones.js` handles required-field checks per section.

## Code Conventions

- Components: PascalCase (`TablaEgresados.jsx`)
- Hooks: `use` prefix (`useFormulario.js`, `useEgresados.js`)
- Utilities: camelCase (`formatear.js`, `validaciones.js`)
- Styles: CSS Modules co-located with component (`Component.module.css`); the admin shares one `src/admin/Admin.module.css`
- Municipalities list in `src/utils/municipios.js` is the single source of truth for the 27 Caldas municipalities — update there if needed.

## Key Documentation Files

- `PROYECTO.md` — complete technical specification (routes, API contract, Sheets schema, full form field list)
- `GAS.md` — Google Apps Script setup, deployment steps, and annotated source
- `docs/PLAN.md` — 9-month implementation roadmap with current status per phase
