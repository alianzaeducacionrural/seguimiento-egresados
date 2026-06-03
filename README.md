# Seguimiento a Egresados — La Universidad en el Campo

Plataforma web para el seguimiento de egresados del programa **La Universidad en el Campo**, del Modelo de Educación Rural con Escuela Nueva adelantado por el Comité de Cafeteros de Caldas.

## Aplicaciones

| App | URL en producción | Descripción |
|---|---|---|
| Formulario | `/seguimiento-egresados/formulario/` | Formulario de 8 secciones para egresados |
| Admin | `/seguimiento-egresados/admin/` | Panel de consulta y análisis |
| Admin (IE) | `/seguimiento-egresados/admin/?token=xxx` | Vista reducida por institución |

## Desarrollo local

```bash
# Formulario
cd formulario
npm install
npm run dev       # http://localhost:5173

# Admin
cd admin
npm install
npm run dev       # http://localhost:5174
```

Copiar `.env.example` → `.env` en cada carpeta y completar `VITE_GAS_URL`.

## Build

```bash
cd formulario && npm run build
cd admin && npm run build
```

El deploy a GitHub Pages se hace automáticamente vía `.github/workflows/deploy.yml` en cada push a `main`. La URL de GAS debe estar configurada como **secret** `VITE_GAS_URL` en el repositorio de GitHub.

## Google Apps Script

El código del backend está en `gas/Code.gs`. Para desplegarlo:

1. Abrir el Google Sheet → **Extensiones → Apps Script**
2. Pegar el contenido de `gas/Code.gs`
3. **Implementar → Nueva implementación** → Tipo: Aplicación web → Acceso: Cualquier usuario
4. Copiar la URL generada → pegarla en `.env` como `VITE_GAS_URL`

Cuando se agreguen instituciones nuevas en el Sheets sin token, ejecutar `generarTokensFaltantes()` desde el editor de GAS.

## Stack

- React + Vite (JSX) — sin librerías de UI externas en el formulario
- Recharts — gráficas en el admin
- React Router — navegación en el admin
- Google Apps Script — API + base de datos
- Google Sheets — almacenamiento (4 pestañas: `respuestas`, `instituciones`, `universidades`, `config`)
- GitHub Actions + GitHub Pages — CI/CD
