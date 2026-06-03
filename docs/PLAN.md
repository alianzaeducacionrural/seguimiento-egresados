# PLAN.md — Plan de implementación
## Sistema de Seguimiento a Egresados — Universidad en el Campo
## Comité de Cafeteros de Caldas

Este archivo es el plan de trabajo mes a mes para Claude Code.
El contexto técnico completo está en `PROYECTO.md`.
El código de Google Apps Script está en `GAS.md`.

---

## Resumen general

9 meses divididos en 4 fases. Al cerrar cada mes se hace un despliegue
en GitHub Pages para mostrar avances reales.

| Mes | Fase | Actividad | Estado |
|---|---|---|---|
| 1 | Fundamentos | Diseño y arquitectura | ✅ Completo |
| 2 | Fundamentos | Diseño del formulario | ✅ Completo |
| 3 | Desarrollo | Setup + implementación completa | ✅ Completo |
| 4 | Desarrollo | Activación, configuración y pruebas | ← **siguiente** |
| 5 | Dashboard | Refinamiento del panel admin | Pendiente |
| 6 | Dashboard | Gráficas avanzadas y filtros cruzados | Pendiente |
| 7 | Cierre | Vistas por institución + exportación | Pendiente |
| 8 | Cierre | Prueba interna con el equipo | Pendiente |
| 9 | Cierre | Piloto real + lanzamiento oficial | Pendiente |

---

## Mes 3 — Setup + implementación completa ✅

### Qué se hizo

Se avanzó más de lo planeado originalmente. En lugar de dos aplicaciones
Vite separadas, se construyó una **app React unificada** en la raíz del
repositorio con React Router.

**Estructura real del proyecto:**
```
seguimiento-egresados/
├── src/
│   ├── App.jsx                    — Router raíz + detección de token
│   ├── formulario/
│   │   ├── Formulario.jsx         — Navegación entre secciones y submit
│   │   ├── sections/Section1…8   — Las 8 secciones con lógica condicional
│   │   ├── hooks/useFormulario.js — Estado global, validación, envío
│   │   ├── utils/api.js           — cargarListas(), enviarFormulario()
│   │   ├── utils/municipios.js    — 27 municipios de Caldas (hardcodeado)
│   │   └── utils/validar.js       — validarSeccion(n, datos)
│   └── admin/
│       ├── views/Dashboard.jsx    — Métricas + gráficas Recharts
│       ├── views/TablaEgresados   — Tabla con búsqueda y filtros
│       ├── views/DetalleEgresado  — Detalle completo de un registro
│       ├── views/Instituciones    — Lista de IE con egresados
│       ├── hooks/useEgresados.js  — Carga desde GAS (con o sin token)
│       └── components/NavBar.jsx  — Navegación sticky del admin
├── gas/Code.gs                    — Backend completo en Google Apps Script
├── vite.config.js                 — base: '/seguimiento-egresados/'
├── package.json                   — Dependencias unificadas
└── .github/workflows/deploy.yml  — CI/CD a GitHub Pages
```

**Rutas de la app:**
| Ruta | Vista |
|---|---|
| `/seguimiento-egresados/` | Formulario de 8 secciones |
| `/seguimiento-egresados/admin` | Dashboard del admin |
| `/seguimiento-egresados/admin/egresados` | Tabla de egresados |
| `/seguimiento-egresados/admin/egresados/:id` | Detalle de un egresado |
| `/seguimiento-egresados/admin/instituciones` | Instituciones registradas |
| `/seguimiento-egresados/?token=xxx` | Vista de institución (sin NavBar) |

**Para correr en desarrollo:**
```bash
npm install
npm run dev   # http://localhost:5173
```

### Lo que queda pendiente de este mes
- Desplegar el GAS en Google Apps Script (manual, requiere acceso al Sheets)
- Activar GitHub Pages en el repositorio
- Agregar el secret `VITE_GAS_URL` en GitHub

---

## Mes 4 — Activación, configuración y pruebas

### Objetivo
Dejar el sistema completamente operativo: GAS desplegado, GitHub Pages activo,
formulario enviando datos reales a Google Sheets, y admin mostrando esos datos.

### Acciones

**1. Desplegar Google Apps Script**

- Abrir el Google Sheet → **Extensiones → Apps Script**
- Borrar el código por defecto
- Copiar el contenido de `gas/Code.gs`
- **Implementar → Nueva implementación**
  - Tipo: Aplicación web
  - Ejecutar como: Yo
  - Acceso: Cualquier usuario (anónimo)
- Copiar la URL generada (ya está en `.env` y en CLAUDE.md, verificar que coincida)

**2. Configurar las pestañas del Google Sheets**

La pestaña `respuestas` se crea automáticamente con el primer envío.
Las otras tres hay que crearlas manualmente:

- **`instituciones`** — columnas: `municipio`, `nombre`, `id`, `token`, `url`
  Llenar con las instituciones educativas del programa por municipio.

- **`universidades`** — columna: `nombre`
  Llenar con las universidades aliadas del programa UEC.

- **`config`** — columnas: `clave`, `valor`
  Agregar la fila: `dominio_github_pages` | `https://alianzaeducacionrural.github.io/seguimiento-egresados/`

**3. Generar tokens para las instituciones**

Desde el editor de Google Apps Script, ejecutar manualmente la función:
```
generarTokensFaltantes()
```
Esto llena las columnas `id`, `token` y `url` para cada institución en el Sheets.

**4. Activar GitHub Pages**

En el repositorio de GitHub → **Settings → Pages**:
- Source: **Deploy from a branch**
- Branch: `gh-pages` / `/ (root)`
- Guardar

El workflow se dispara automáticamente en cada push a `main`.

**5. Agregar el secret de GitHub Actions**

En el repositorio de GitHub → **Settings → Secrets and variables → Actions**:
- Nombre: `VITE_GAS_URL`
- Valor: URL del Web App de GAS (la misma que está en `.env`)

Sin este secret el build de producción falla silenciosamente.

**6. Verificar el primer deploy**

Hacer un push cualquiera a `main` y confirmar que:
- El workflow en **Actions** termina verde
- La rama `gh-pages` se actualiza
- `https://alianzaeducacionrural.github.io/seguimiento-egresados/` carga el formulario

**7. Prueba de extremo a extremo**

- [ ] Abrir el formulario en producción
- [ ] Diligenciar las 8 secciones con datos de prueba
- [ ] Verificar que aparece una fila nueva en la pestaña `respuestas` del Sheets
- [ ] Abrir el admin en `/admin` y verificar que el registro aparece
- [ ] Abrir el detalle del registro y verificar que todos los campos son correctos
- [ ] Probar la vista de institución con un token real: `/seguimiento-egresados/?token=xxx`

**8. Prueba del formulario en móvil**

- [ ] Abrir en un teléfono Android / iOS
- [ ] Verificar que todos los campos se ven bien
- [ ] Verificar que los selects y checkboxes funcionan con toque

**9. Correcciones tras prueba**

Aplicar los ajustes que surjan de los puntos 7 y 8 antes de dar el mes por cerrado.

### Entregable
Sistema completamente operativo en producción:
- `https://alianzaeducacionrural.github.io/seguimiento-egresados/` → formulario activo
- `https://alianzaeducacionrural.github.io/seguimiento-egresados/admin` → admin activo
- GAS respondiendo a peticiones reales
- Al menos un registro de prueba completo en Google Sheets

---

## Meses 5–9 — Roadmap (sin ejecución detallada)

> La ejecución detallada de estos meses se define cuando llegue el momento.

| Mes | Objetivo principal |
|---|---|
| **5** | Refinamiento del panel admin: paginación, exportación CSV, mejoras de UX en la tabla |
| **6** | Gráficas avanzadas en el Dashboard: filtros cruzados por municipio/institución/año |
| **7** | Vista por institución con gráficas propias; enlace de tokens desde el panel admin |
| **8** | Prueba interna con el equipo del Comité; ajustes según feedback real |
| **9** | Piloto con instituciones reales, lanzamiento oficial, documentación de uso |

---

## URLs del proyecto

| Recurso | URL |
|---|---|
| Repositorio | https://github.com/alianzaeducacionrural/seguimiento-egresados |
| Formulario (producción) | https://alianzaeducacionrural.github.io/seguimiento-egresados/ |
| Panel admin (producción) | https://alianzaeducacionrural.github.io/seguimiento-egresados/admin |
| Google Sheets | https://docs.google.com/spreadsheets/d/1vDxjtAe2bUPx2gUt1HMI2rlx6r1FfGBYKnv6BjaJd0k |

---

## Archivos de contexto disponibles

| Archivo | Contenido |
|---|---|
| `PROYECTO.md` | Arquitectura, stack, diseño del formulario sección por sección, API de GAS |
| `GAS.md` | Código completo de Google Apps Script listo para copiar y desplegar |
| `CLAUDE.md` | Guía técnica para Claude Code: comandos, estructura, convenciones |
| `docs/PLAN.md` | Este archivo — plan de trabajo mes a mes |
| `docs/Anexo 5. Seguimiento de Egresados.pdf` | Formulario físico original de referencia |
