# Sistema de Seguimiento a Egresados
## Iniciativa La Universidad en el Campo — Comité de Cafeteros de Caldas

---

## Contexto

Este proyecto es una plataforma web para el seguimiento de egresados del programa
**La Universidad en el Campo**, del Modelo de Educación Rural con Escuela Nueva,
adelantado por el Comité de Cafeteros de Caldas en el departamento de Caldas, Colombia.

El plan de implementación completo está en `/docs/plan_implementacion.docx`.
El formulario físico de referencia está en `/docs/Anexo_5__Seguimiento_de_Egresados.pdf`.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (JSX) — app única con React Router |
| API / Backend | Google Apps Script (GAS) Web App |
| Base de datos | Google Sheets |
| Despliegue | GitHub Pages (via GitHub Actions) |
| Editor | VS Code con Claude Code |

---

## Estructura del repositorio

```
seguimiento-egresados/          # raíz = app React única
├── src/
│   ├── components/             # componentes reutilizables
│   │   ├── CampoTexto.jsx
│   │   ├── CampoSelect.jsx
│   │   ├── CampoRadio.jsx
│   │   ├── CampoCheckbox.jsx
│   │   ├── CampoFecha.jsx
│   │   ├── CampoTextarea.jsx
│   │   ├── BarraProgreso.jsx
│   │   ├── BotonSiguiente.jsx
│   │   ├── BotonAnterior.jsx
│   │   └── ModalConsentimiento.jsx
│   ├── sections/               # secciones del formulario
│   │   ├── Seccion1.jsx
│   │   ├── Seccion2.jsx
│   │   ├── Seccion3.jsx
│   │   ├── Seccion4.jsx
│   │   ├── Seccion5.jsx
│   │   ├── Seccion6.jsx
│   │   ├── Seccion7.jsx
│   │   └── Seccion8.jsx
│   ├── admin/                  # vistas del panel de administración
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── TablaEgresados.jsx
│   │   │   ├── FiltrosBusqueda.jsx
│   │   │   └── BotonExportar.jsx
│   │   └── views/
│   │       ├── Dashboard.jsx
│   │       ├── Egresados.jsx
│   │       ├── DetalleEgresado.jsx
│   │       ├── Instituciones.jsx
│   │       └── VistaInstitucion.jsx
│   ├── hooks/
│   │   ├── useFormulario.js    # estado global del formulario
│   │   ├── useListas.js        # carga municipios, instituciones y universidades
│   │   └── useEgresados.js     # carga registros desde GAS para el admin
│   ├── utils/
│   │   ├── api.js              # funciones fetch hacia GAS
│   │   ├── validaciones.js
│   │   └── municipios.js       # lista hardcodeada de 27 municipios de Caldas
│   ├── App.jsx                 # router principal
│   ├── App.module.css
│   └── main.jsx
├── public/
├── docs/
│   ├── plan_implementacion.docx
│   └── Anexo_5__Seguimiento_de_Egresados.pdf
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── vite.config.js
├── package.json
├── .env                        # único archivo de variables de entorno
├── .gitignore
├── PROYECTO.md
├── PLAN.md
├── GAS.md
└── README.md
```

---

## Rutas de la aplicación

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | Formulario | Formulario para egresados — secciones 1 a 8 |
| `/admin` | Dashboard | Métricas clave y gráficas resumen |
| `/admin/egresados` | Tabla | Listado completo con filtros y búsqueda |
| `/admin/egresados/:id` | Detalle | Todas las respuestas de un registro |
| `/admin/instituciones` | Instituciones | Ver tokens y copiar enlace por institución |
| `/admin/institucion` | Vista institución | Panel reducido filtrado por `?token=xxx` |

---

## Configuración — vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/seguimiento-egresados/',
})
```

---

## Variables de entorno — .env

```env
VITE_GAS_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
```

Un solo archivo `.env` en la raíz. No se sube al repositorio.

---

## Base de datos — Google Sheets

Una sola hoja de cálculo con 4 pestañas.

### Pestaña `respuestas`
Una fila por egresado. Columnas en el mismo orden que las secciones del formulario.

```
timestamp | version |
s1_tipo_documento | s1_numero_documento | s1_nombre | s1_fecha_nacimiento |
s1_municipio_residencia | s1_municipio_otro | s1_correo | s1_telefono | s1_zona |
s2_municipio_bachillerato | s2_ie_bachillerato | s2_anio_graduacion_media |
s2_continuo_superior | s2_razon_no_continuo |
s2_estudio_uec | s2_nivel_uec | s2_ie_programa_uec | s2_nombre_programa_uec |
s2_universidad_uec | s2_anio_grad_uec |
s2_continuo_postgrado | s2_nivel_postgrado | s2_institucion_postgrado |
s2_programa_postgrado | s2_razon_no_postgrado |
s3_trabaja | s3_ha_trabajado | s3_linea_insercion | s3_empleo_relacionado |
s3_sector | s3_tipo_contrato | s3_formacion_contribuyo |
s4_ha_emprendido | s4_tipo_emprendimiento | s4_fondo_rotatorio |
s4_linea_empresarismo | s4_habilidades_emprender |
s5_implemento_ppps | s5_area_ppps | s5_aplica_conocimientos |
s6_empalme_generacional | s6_razon_empalme |
s7_estrategias_escuela_nueva | s7_aspectos_mejorar | s7_recomendaria |
s7_comentarios_adicionales |
s8_contacto_telefono | s8_contacto_correo | s8_autorizacion
```

### Pestaña `instituciones`
Ingresada manualmente por el Comité. `id`, `token` y `url` los genera GAS
con la función manual `generarTokensFaltantes()`.

```
id | municipio | institucion_educativa | token | url
```

Municipios presentes (27 municipios de Caldas):
Aguadas, Anserma, Aranzazu, Belalcázar, Chinchiná, Filadelfia, La Dorada,
La Merced, Manizales, Manzanares, Marmato, Marquetalia, Marulanda, Neira,
Norcasia, Pácora, Palestina, Pensilvania, Riosucio, Risaralda, Salamina,
Samaná, San José, Supía, Victoria, Villamaría, Viterbo.

### Pestaña `universidades`
Columna A con encabezado `Universidad`. El Comité agrega o quita universidades
directamente en Sheets y se actualizan automáticamente en el formulario vía GAS.

Universidades actuales:
- Universidad de Caldas
- Universidad de Manizales
- Universidad Católica de Manizales
- Universidad Autónoma
- IES CINOC

### Pestaña `config`
```
clave                | valor
version_formulario   | 1.0
fecha_activacion     | 2026-06-03
activo               | true
dominio_github_pages | https://alianzaeducacionrural.github.io/seguimiento-egresados
```

---

## API — Google Apps Script (GAS)

URL base: `VITE_GAS_URL` en el archivo `.env`.

### GET /?action=listas
Devuelve municipios, instituciones y universidades para los selects del formulario.
Se ejecuta al montar la app.

**Response:**
```json
{
  "ok": true,
  "municipios": ["Aguadas", "Anserma", "..."],
  "instituciones": {
    "Aguadas": ["El Edén", "Encimadas", "..."],
    "Anserma": ["Alto Nubia", "..."]
  },
  "universidades": ["Universidad de Caldas", "..."]
}
```

### GET /?action=registros
Sin token → todos los registros (admin).
Con token → solo los registros de esa institución.

**Response:**
```json
{
  "ok": true,
  "institucion": "Florencia",
  "municipio": "Riosucio",
  "total": 42,
  "registros": [ { "timestamp": "...", "s1_nombre": "..." } ]
}
```

### POST /
Guarda una respuesta del formulario en la pestaña `respuestas`.
El body debe enviarse como `Content-Type: text/plain` (requisito de GAS).

**Response:**
```json
{ "ok": true, "mensaje": "Respuesta registrada correctamente" }
```

### Función manual `generarTokensFaltantes()`
Se ejecuta desde el editor de GAS. Recorre `instituciones`, detecta filas
sin `id`/`token`/`url` y los genera automáticamente.

---

## Formulario — diseño completo por secciones

### Sección 1 — Información general

| # | Campo | Tipo | Validación / Opciones |
|---|---|---|---|
| 1.1 | Tipo de documento | Select | CC / TI / CE / PA — Requerido |
| 1.2 | Número de documento | Text | Requerido, solo números |
| 1.3 | Nombre completo | Text | Requerido, mín. 3 caracteres |
| 1.4 | Fecha de nacimiento | Date | Requerido |
| 1.5 | Municipio de residencia | Select | 27 municipios de Caldas + "Otro municipio" — Requerido |
| 1.6 | Si "Otro municipio": ¿cuál? | Text | Requerido si 1.5 = "Otro municipio" |
| 1.7 | Correo electrónico | Email | Requerido, formato válido |
| 1.8 | Teléfono de contacto | Text | Requerido, 10 dígitos |
| 1.9 | ¿Resides en zona rural o urbana? | Radio | Rural / Urbana — Requerido |

### Sección 2 — Trayectoria educativa

**Parte A — Educación media**

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 2.1 | Municipio donde terminó bachillerato | Select | 27 municipios de Caldas (hardcodeados) | Siempre |
| 2.2 | IE donde terminó bachillerato | Select | Dependiente de 2.1 → desde GAS | Siempre |
| 2.3 | Año de graduación | Select | 2010 → año actual | Siempre |
| 2.4 | ¿Continuó con estudios superiores? | Radio | Sí / No | Siempre |
| 2.5 | Si No: razón principal | Checkbox | Recursos / Distancia / Trabajo / Otro (texto) | Si 2.4 = No |

**Parte B — Universidad en el Campo**

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 2.6 | ¿Cursó estudios con La Universidad en el Campo? | Radio | Sí / No | Siempre |
| 2.7 | Nivel cursado | Checkbox | Técnica profesional / Tecnológica profesional | Si 2.6 = Sí |
| 2.8 | IE donde cursó el programa técnico o tecnológico | Text | Requerido | Si 2.6 = Sí |
| 2.9 | Nombre del programa | Text | Requerido | Si 2.6 = Sí |
| 2.10 | Universidad | Select | Desde GAS (`universidades`) | Si 2.6 = Sí |
| 2.11 | Año de graduación | Select | 2010 → año actual | Si 2.6 = Sí |
| 2.12 | ¿Continuó estudios después de graduarse? | Radio | Sí / No | Si 2.6 = Sí |
| 2.13 | Nivel de estudios posteriores | Radio | Tecnológica / Universitaria / Posgrado | Si 2.12 = Sí |
| 2.14 | Nombre de la institución | Text | Requerido | Si 2.12 = Sí |
| 2.15 | Programa o carrera | Text | Requerido | Si 2.12 = Sí |
| 2.16 | Si No continuó: razón principal | Checkbox | Recursos / Distancia / Trabajo / Otro (texto) | Si 2.12 = No |

### Sección 3 — Situación laboral

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 3.1 | ¿Actualmente trabajas? | Radio | Sí tiempo completo / Sí medio tiempo / No | Siempre |
| 3.2 | ¿Has trabajado desde que egresaste? | Radio | Sí / No | Siempre |
| 3.3 | ¿Fue a través de la Línea de Inserción Laboral? | Radio | Sí / No | Si 3.1 ≠ No o 3.2 = Sí |
| 3.4 | ¿Tu empleo está relacionado con tu formación? | Radio | Sí / No | Si 3.1 ≠ No o 3.2 = Sí |
| 3.5 | Sector en el que trabajas o trabajaste | Checkbox | Agricultura / Industria / Servicios / Comercio / Educación / Otro | Si 3.1 ≠ No o 3.2 = Sí |
| 3.6 | Tipo de contrato en tu empleo más reciente | Radio | Formal / Informal / No aplica | Si 3.1 ≠ No o 3.2 = Sí |
| 3.7 | ¿Tu formación en Escuela Nueva contribuyó a obtener tu trabajo? | Radio | Sí / No / En parte | Si 3.1 ≠ No o 3.2 = Sí |

### Sección 4 — Emprendimiento

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 4.1 | ¿Has emprendido un negocio o proyecto propio? | Radio | Sí / No | Siempre |
| 4.2 | Tipo de emprendimiento | Checkbox | Productivo / Social / Cultural / Tecnológico / Científico / Deportivo / Otro | Si 4.1 = Sí |
| 4.3 | ¿Accediste al Fondo Rotatorio? | Radio | Sí / No | Siempre |
| 4.4 | ¿Fuiste beneficiario de la Línea de Empresarismo? | Radio | Sí / No | Siempre |
| 4.5 | ¿Escuela Nueva te ayudó a desarrollar habilidades para emprender? | Radio | Sí / No | Siempre |

### Sección 5 — Proyectos Pedagógicos Productivos

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 5.1 | ¿Implementaste algún PPPS? | Radio | Sí / No | Siempre |
| 5.2 | ¿En qué área? | Checkbox | Agricultura / Ganadería / Transformación de alimentos / Artesanías / Servicios / Otro | Si 5.1 = Sí |
| 5.3 | ¿Sigues aplicando esos conocimientos? | Radio | Sí / No | Si 5.1 = Sí |

### Sección 6 — Impacto social y generacional

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 6.1 | ¿Te consideras parte del empalme generacional? | Radio | Sí / No | Siempre |
| 6.2 | ¿Por qué? | Checkbox | Desarrollo rural / Tradición familiar / Iniciativas comunitarias / Otro | Si 6.1 = Sí |

### Sección 7 — Retroalimentación

| # | Campo | Tipo | Opciones | Condicional |
|---|---|---|---|---|
| 7.1 | ¿Qué estrategias de Escuela Nueva han contribuido más? | Checkbox | Trabajo en equipo / Uso de guías / Actividades de conjunto / Gobierno Estudiantil / Escuela y Café / Escuela y Seguridad Alimentaria / Escuela Virtual / Roles de trabajo / Emprendimiento / Empresarismo / Otro | Siempre |
| 7.2 | ¿Qué aspectos deberían mejorarse? | Textarea | Requerido, mín. 10 caracteres | Siempre |
| 7.3 | ¿Recomendarías el modelo a otros jóvenes? | Radio | Sí / No / Tal vez | Siempre |
| 7.4 | ¿Hay algo más que quisieras compartir? | Textarea | Opcional | Siempre |

### Sección 8 — Contacto y autorización

| # | Campo | Tipo | Validación | Condicional |
|---|---|---|---|---|
| 8.1 | Teléfono de contacto adicional | Text | Opcional, 10 dígitos | Siempre |
| 8.2 | Correo de contacto adicional | Email | Opcional, formato válido | Siempre |
| 8.3 | Autorización de tratamiento de datos | Checkbox | Requerido para enviar | Siempre |

El checkbox muestra el texto resumido con un enlace **"Ver texto completo"**
que abre un modal con la autorización íntegra (Ley 1581 de 2012).
El formulario no se puede enviar sin marcarlo.

---

### Lógica condicional — resumen global

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
| `s5_area_ppps` y `s5_aplica_conocimientos` | `s5_implemento_ppps === true` |
| `s6_razon_empalme` | `s6_empalme_generacional === true` |

---

## Convenciones de código

- Componentes en PascalCase: `Seccion1.jsx`, `TablaEgresados.jsx`
- Hooks con prefijo `use`: `useFormulario.js`, `useEgresados.js`
- Utilidades en camelCase: `validaciones.js`, `municipios.js`
- Estilos: CSS Modules (`.module.css`) por componente
- Sin librerías de UI externas en el formulario (diseño propio, mobile-first)
- Para gráficas en el admin: Recharts

---

## Despliegue — GitHub Pages

URL base del proyecto:
`https://alianzaeducacionrural.github.io/seguimiento-egresados/`

El `vite.config.js` debe tener `base: '/seguimiento-egresados/'`.
GitHub Actions construye desde la raíz y publica en la rama `gh-pages`.

---

## Estado actual del proyecto

Mes 2 de 9 completado — diseño del formulario cerrado.
Mes 3: setup del proyecto en VS Code con Claude Code.