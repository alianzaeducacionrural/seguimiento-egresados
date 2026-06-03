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

The GAS URL is the "current web app URL" from the Apps Script deployment. Both the form (`src/formulario/utils/api.js`) and admin (`src/admin/utils/api.js`) read this variable.

## Architecture

```
React (Vite, GitHub Pages)
   ├── /                    → 8-section graduate survey form
   └── /admin/*             → Admin dashboard (protected by institution token)

         ↓ fetch (GET/POST)

Google Apps Script Web App  ←→  Google Sheets (4 sheets)
  doGet(?action=listas)           respuestas   — form submissions
  doGet(?action=registros         instituciones — tokens per institution
        &token=xxx)               universidades — university list
  doPost()                        config        — global settings
```

The app lives under `basename="/seguimiento-egresados/"` (set in both `src/App.jsx` and `vite.config.js`).

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Formulario` | 8-section graduate form (public) |
| `/admin` | `Dashboard` | Metrics & charts |
| `/admin/egresados` | `TablaEgresados` | Searchable/filterable table |
| `/admin/egresados/:id` | `DetalleEgresado` | Individual record detail |
| `/admin/instituciones` | `Instituciones` | Institution list with shareable token links |
| `/admin/institucion?token=xxx` | filtered `TablaEgresados` | Institution-scoped view |

The admin section detects a `?token=xxx` query param to filter records per institution. No login — auth is token-based.

## Source Structure

```
src/
├── App.jsx                   # Root router
├── formulario/               # Graduate self-report form
│   ├── Formulario.jsx        # Section navigation + submit
│   ├── sections/             # Section1.jsx … Section8.jsx
│   ├── hooks/useFormulario.js
│   └── utils/
│       ├── api.js            # cargarListas(), enviarFormulario()
│       ├── municipios.js     # 27 Caldas municipalities (hardcoded)
│       └── validar.js        # validarSeccion(n, datos)
└── admin/                    # Admin dashboard
    ├── views/                # Dashboard, TablaEgresados, DetalleEgresado, Instituciones
    ├── components/NavBar.jsx
    ├── hooks/useEgresados.js # cargarRegistros(token) from GAS
    └── utils/
        ├── api.js            # cargarRegistros(token)
        └── formatear.js      # Date, boolean, label formatting helpers
```

## Google Apps Script — Critical Notes

See `GAS.md` for full backend documentation and `gas/Code.gs` for the source.

- **CORS:** GAS does not support preflight requests. The frontend must send POST with `Content-Type: text/plain` (not `application/json`) to avoid triggering a preflight. The body is still JSON-stringified.
- **Array fields:** GAS flattens repeated-value fields (checkboxes) by joining with `, ` via the `aplanar()` helper before writing to Sheets.
- **Token generation:** Run `generarTokensFaltantes()` manually from the Apps Script editor after adding new institutions to the `instituciones` sheet.
- **GET action routing:** `doGet(e)` switches on `e.parameter.action` (`listas` or `registros`).

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

Key conditional logic: fields in sections 2–4 are gated behind yes/no questions (e.g., continued studies, currently employed, has an enterprise). `validarSeccion()` in `formulario/utils/validar.js` handles required-field checks per section.

## Code Conventions

- Components: PascalCase (`TablaEgresados.jsx`)
- Hooks: `use` prefix (`useFormulario.js`, `useEgresados.js`)
- Utilities: camelCase (`formatear.js`, `validar.js`)
- Styles: CSS Modules co-located with component (`Component.module.css`)
- Municipalities list in `formulario/utils/municipios.js` is the single source of truth for the 27 Caldas municipalities — update there if needed.

## Key Documentation Files

- `PROYECTO.md` — complete technical specification (routes, API contract, Sheets schema, full form field list)
- `GAS.md` — Google Apps Script setup, deployment steps, and annotated source
- `docs/PLAN.md` — 9-month implementation roadmap with current status per phase
