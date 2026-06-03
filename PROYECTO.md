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
| Frontend | React + Vite (JSX) |
| API / Backend | Google Apps Script (GAS) Web App |
| Base de datos | Google Sheets |
| Despliegue | GitHub Pages (via GitHub Actions) |
| Editor | VS Code con Claude Code |

---

## Estructura del repositorio

```
seguimiento-egresados/
├── formulario/                  # App React — formulario para egresados
│   ├── src/
│   │   ├── components/
│   │   ├── sections/            # Una carpeta por sección del formulario (8 secciones)
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── admin/                       # App React — panel de administración
│   ├── src/
│   │   ├── components/
│   │   ├── views/               # Tabla, Detalle, Dashboard, Institución
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── gas/                         # Google Apps Script
│   └── Code.gs                  # Web App: endpoints POST y GET
├── docs/                        # Documentación del proyecto
│   ├── plan_implementacion.docx
│   └── Anexo_5__Seguimiento_de_Egresados.pdf
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions: deploy automático a GitHub Pages
├── PROYECTO.md                  # Este archivo — contexto para Claude Code
└── README.md
```

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
Ingresada manualmente por el Comité (municipio e institución).
`id`, `token` y `url` los genera GAS con la función `generarTokensFaltantes()`.

```
id | municipio | institucion_educativa | token | url
```

Municipios presentes en el Sheets (27 municipios de Caldas):
Aguadas, Anserma, Aranzazu, Belalcázar, Chinchiná, Filadelfia, La Dorada,
La Merced, Manizales, Manzanares, Marmato, Marquetalia, Marulanda, Neira,
Norcasia, Pácora, Palestina, Pensilvania, Riosucio, Risaralda, Salamina,
Samaná, San José, Supía, Victoria, Villamaría, Viterbo.

### Pestaña `universidades`
Columna A con encabezado `Universidad`. El Comité agrega o quita universidades
directamente en el Sheets y se actualizan automáticamente en el formulario vía GAS.

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
dominio_github_pages | https://<usuario>.github.io/seguimiento-egresados
```

---

## API — Google Apps Script (GAS)

El archivo `gas/Code.gs` se despliega como Web App en Google Apps Script.
URL base: definida en variable de entorno `VITE_GAS_URL` en ambas apps.

### POST / — Guardar respuesta del formulario

**Request body (JSON):**
```json
{
  "version": "1.0",
  "timestamp": "2026-06-03T10:00:00Z",
  "s1": {
    "tipo_documento": "CC",
    "numero_documento": "1234567890",
    "nombre": "...",
    "fecha_nacimiento": "2000-01-15",
    "municipio_residencia": "Riosucio",
    "municipio_otro": "",
    "correo": "...",
    "telefono": "3001234567",
    "zona": "rural"
  },
  "s2": {
    "municipio_bachillerato": "Riosucio",
    "ie_bachillerato": "Florencia",
    "anio_graduacion_media": 2020,
    "continuo_superior": true,
    "razon_no_continuo": "",
    "estudio_uec": true,
    "nivel_uec": ["Técnica profesional"],
    "ie_programa_uec": "...",
    "nombre_programa_uec": "...",
    "universidad_uec": "Universidad de Caldas",
    "anio_grad_uec": 2023,
    "continuo_postgrado": false,
    "nivel_postgrado": "",
    "institucion_postgrado": "",
    "programa_postgrado": "",
    "razon_no_postgrado": ["Recursos económicos"]
  },
  "s3": {
    "trabaja": "tiempo_completo",
    "ha_trabajado": true,
    "linea_insercion": false,
    "empleo_relacionado": true,
    "sector": ["Agricultura y ganadería"],
    "tipo_contrato": "formal",
    "formacion_contribuyo": "en_parte"
  },
  "s4": {
    "ha_emprendido": true,
    "tipo_emprendimiento": ["Productivo"],
    "fondo_rotatorio": false,
    "linea_empresarismo": false,
    "habilidades_emprender": true
  },
  "s5": {
    "implemento_ppps": true,
    "area_ppps": ["Agricultura"],
    "aplica_conocimientos": true
  },
  "s6": {
    "empalme_generacional": true,
    "razon_empalme": ["Trabajo en actividades que fortalecen el desarrollo rural"]
  },
  "s7": {
    "estrategias_escuela_nueva": ["Trabajo en equipo", "Uso de guías"],
    "aspectos_mejorar": "...",
    "recomendaria": "si",
    "comentarios_adicionales": "..."
  },
  "s8": {
    "contacto_telefono": "",
    "contacto_correo": "",
    "autorizacion": true
  }
}
```

**Response:**
```json
{ "ok": true, "mensaje": "Respuesta registrada correctamente" }
```

### GET /?action=listas — Cargar listas para los selects del formulario

Devuelve municipios agrupados con sus instituciones y la lista de universidades
en una sola llamada. Se ejecuta al montar el formulario.

**Response:**
```json
{
  "ok": true,
  "municipios": ["Aguadas", "Anserma", "Aranzazu", "..."],
  "instituciones": {
    "Aguadas": ["El Edén", "Encimadas", "La Mermita", "Rioarriba", "San Antonio de Arma", "Viboral"],
    "Anserma": ["Alto Nubia", "El Horro", "..."],
    "...": []
  },
  "universidades": [
    "Universidad de Caldas",
    "Universidad de Manizales",
    "Universidad Católica de Manizales",
    "Universidad Autónoma",
    "IES CINOC"
  ]
}
```

### GET /?action=registros — Leer registros (panel admin y vistas por institución)

- **Sin token** → devuelve todos los registros (uso exclusivo del panel admin).
- **Con token válido** → devuelve solo los registros de esa institución.
- **Con token inválido** → `{ "ok": false, "error": "Token no válido" }`.

**Request:** `GET /?action=registros` o `GET /?action=registros&token=a3f9k2`

**Response:**
```json
{
  "ok": true,
  "institucion": "Florencia",
  "municipio": "Riosucio",
  "total": 42,
  "registros": [ { "timestamp": "...", "s1_nombre": "...", "s1_municipio_residencia": "..." } ]
}
```

### Función manual `generarTokensFaltantes()`

Función que el Comité ejecuta desde el editor de Google Apps Script cuando
agrega instituciones nuevas en la pestaña `instituciones` sin `id`/`token`/`url`.

**Lógica:**
1. Recorre todas las filas de `instituciones` desde la fila 2.
2. Si tiene `municipio` e `institucion_educativa` pero `id` vacío:
   - Genera `id` correlativo al último existente.
   - Genera `token` de 6 caracteres alfanuméricos únicos.
   - Lee `dominio_github_pages` de la pestaña `config`.
   - Construye `url`: `<dominio>/admin/?token=<token>`.
   - Escribe `id`, `token` y `url` en esa fila.
3. Muestra un resumen de cuántas filas se procesaron.

---

## Formulario — diseño completo por secciones

Navegación lineal con barra de progreso. 8 secciones.
Las listas de instituciones y universidades se cargan desde GAS al montar
la app (`GET /?action=listas`) y se guardan en estado global.

---

### Sección 1 — Información general

| # | Campo | Tipo | Opciones / Validación |
|---|---|---|---|
| 1.1 | Tipo de documento | Select | CC / TI / CE / PA |
| 1.2 | Número de documento | Text | Requerido, solo números |
| 1.3 | Nombre completo | Text | Requerido, mín. 3 caracteres |
| 1.4 | Fecha de nacimiento | Date | Requerido |
| 1.5 | Municipio de residencia | Select | 27 municipios de Caldas (hardcodeados) + "Otro municipio" |
| 1.6 | Si "Otro municipio": ¿cuál? | Text | Requerido si 1.5 = "Otro municipio" |
| 1.7 | Correo electrónico | Email | Requerido, formato válido |
| 1.8 | Teléfono de contacto | Text | Requerido, 10 dígitos |
| 1.9 | ¿Resides en zona rural o urbana? | Radio | Rural / Urbana |

**Nota:** los 27 municipios van hardcodeados en el frontend porque son datos
fijos de residencia, no de instituciones. No se cargan desde GAS.

---

### Sección 2 — Trayectoria educativa

**Parte A — Egreso de educación media**

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 2.1 | Municipio donde terminó bachillerato | Select | 27 municipios de Caldas (hardcodeados) | Siempre visible |
| 2.2 | IE donde terminó bachillerato | Select | Dependiente de 2.1 → desde GAS (`instituciones`) | Siempre visible |
| 2.3 | Año de graduación | Select | 2010 → año actual | Siempre visible |
| 2.4 | ¿Continuó con estudios superiores? | Radio | Sí / No | Siempre visible |
| 2.5 | Si No: razón principal | Checkbox | Recursos económicos / Distancia / Necesidad de trabajar / Otro (texto) | Si 2.4 = No |

**Parte B — Estudios con La Universidad en el Campo**

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 2.6 | ¿Cursó estudios con La Universidad en el Campo? | Radio | Sí / No | Siempre visible |
| 2.7 | Nivel cursado | Checkbox | Técnica profesional / Tecnológica profesional | Si 2.6 = Sí |
| 2.8 | IE donde cursó el programa técnico o tecnológico | Text libre | Requerido | Si 2.6 = Sí |
| 2.9 | Nombre del programa | Text libre | Requerido | Si 2.6 = Sí |
| 2.10 | Universidad | Select | Desde GAS (`universidades`) | Si 2.6 = Sí |
| 2.11 | Año de graduación | Select | 2010 → año actual | Si 2.6 = Sí |
| 2.12 | ¿Continuó estudios después de graduarse? | Radio | Sí / No | Si 2.6 = Sí |
| 2.13 | Nivel de estudios posteriores | Radio | Tecnológica / Universitaria / Posgrado | Si 2.12 = Sí |
| 2.14 | Nombre de la institución | Text libre | Requerido | Si 2.12 = Sí |
| 2.15 | Programa o carrera | Text libre | Requerido | Si 2.12 = Sí |
| 2.16 | Si No continuó: razón principal | Checkbox | Recursos económicos / Distancia / Necesidad de trabajar / Otro (texto) | Si 2.12 = No |

---

### Sección 3 — Situación laboral e inserción en el mercado

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 3.1 | ¿Actualmente trabajas? | Radio | Sí, tiempo completo / Sí, medio tiempo / No | Siempre visible |
| 3.2 | ¿Has trabajado desde que egresaste? | Radio | Sí / No | Siempre visible |
| 3.3 | ¿Fue a través de la Línea de Inserción Laboral? | Radio | Sí / No | Si 3.1 ≠ No o 3.2 = Sí |
| 3.4 | ¿Tu empleo está relacionado con tu formación? | Radio | Sí / No | Si 3.1 ≠ No o 3.2 = Sí |
| 3.5 | Sector en el que trabajas o trabajaste | Checkbox | Agricultura y ganadería / Industria / Servicios / Comercio / Educación / Otro (texto) | Si 3.1 ≠ No o 3.2 = Sí |
| 3.6 | Tipo de contrato en tu empleo más reciente | Radio | Formal (con prestaciones) / Informal / No aplica | Si 3.1 ≠ No o 3.2 = Sí |
| 3.7 | ¿Tu formación en Escuela Nueva contribuyó a obtener tu trabajo? | Radio | Sí / No / En parte | Si 3.1 ≠ No o 3.2 = Sí |

---

### Sección 4 — Emprendimiento y recursos de apoyo

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 4.1 | ¿Has emprendido un negocio o proyecto propio? | Radio | Sí / No | Siempre visible |
| 4.2 | Tipo de emprendimiento | Checkbox | Productivo / Social / Cultural / Tecnológico / Científico / Deportivo / Otro (texto) | Si 4.1 = Sí |
| 4.3 | ¿Accediste al Fondo Rotatorio durante tu formación? | Radio | Sí / No | Siempre visible |
| 4.4 | ¿Fuiste beneficiario de la Línea de Empresarismo? | Radio | Sí / No | Siempre visible |
| 4.5 | ¿Tu formación en Escuela Nueva te ayudó a desarrollar habilidades para emprender? | Radio | Sí / No | Siempre visible |

---

### Sección 5 — Proyectos Pedagógicos Productivos

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 5.1 | ¿Implementaste algún PPPS durante tu formación? | Radio | Sí / No | Siempre visible |
| 5.2 | ¿En qué área desarrollaste tu proyecto? | Checkbox | Agricultura / Ganadería / Transformación de alimentos / Artesanías / Servicios / Otro (texto) | Si 5.1 = Sí |
| 5.3 | ¿Sigues aplicando esos conocimientos en tu vida actual? | Radio | Sí / No | Si 5.1 = Sí |

---

### Sección 6 — Impacto social y generacional

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 6.1 | ¿Te consideras parte del empalme generacional en tu comunidad? | Radio | Sí / No | Siempre visible |
| 6.2 | ¿Por qué te consideras parte del empalme generacional? | Checkbox | Trabajo en actividades que fortalecen el desarrollo rural / Continúo con la tradición familiar en el sector productivo / Participo en iniciativas comunitarias o liderazgos locales / Otro (texto) | Si 6.1 = Sí |

---

### Sección 7 — Retroalimentación sobre el modelo

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 7.1 | ¿Qué estrategias de Escuela Nueva han contribuido más a tu desarrollo? | Checkbox | Trabajo en equipo / Uso de guías / Actividades de conjunto / Gobierno Estudiantil / Escuela y Café / Escuela y Seguridad Alimentaria / Escuela Virtual / Roles de trabajo / Emprendimiento / Empresarismo / Otro (texto) | Siempre visible |
| 7.2 | ¿Qué aspectos deberían mejorarse en el modelo? | Textarea | Requerido, mín. 10 caracteres | Siempre visible |
| 7.3 | ¿Recomendarías el modelo a otros jóvenes? | Radio | Sí / No / Tal vez | Siempre visible |
| 7.4 | ¿Hay algo más que quisieras compartir sobre tu experiencia? | Textarea | Opcional | Siempre visible |

---

### Sección 8 — Contacto y autorización

| # | Campo | Tipo | Opciones / Validación | Condicional |
|---|---|---|---|---|
| 8.1 | Teléfono de contacto adicional | Text | Opcional, 10 dígitos | Siempre visible |
| 8.2 | Correo electrónico de contacto adicional | Email | Opcional, formato válido | Siempre visible |
| 8.3 | Autorización de tratamiento de datos | Checkbox único | Requerido — no puede enviar sin marcarlo | Siempre visible |

**Comportamiento del consentimiento (8.3):**
El checkbox muestra el texto resumido:
*"Autorizo al Comité de Cafeteros de Caldas — Federación Nacional de Cafeteros
para recolectar y tratar mis datos personales conforme a la Ley 1581 de 2012."*

Al lado del texto hay un enlace **"Ver texto completo"** que abre un modal
con el texto íntegro de la autorización (tomado del PDF del formulario físico),
sin salir del formulario ni abrir otra pestaña. El egresado puede leerlo,
cerrar el modal y marcar el checkbox.

---

### Lógica condicional — resumen global

| Campo | Se muestra si... |
|---|---|
| `s1_municipio_otro` | `s1_municipio_residencia === "Otro municipio"` |
| `s2_ie_bachillerato` | `s2_municipio_bachillerato` tiene valor seleccionado |
| `s2_razon_no_continuo` | `s2_continuo_superior === false` |
| `s2_nivel_uec` … `s2_anio_grad_uec` | `s2_estudio_uec === true` |
| `s2_continuo_postgrado` | `s2_estudio_uec === true` |
| `s2_nivel_postgrado` … `s2_programa_postgrado` | `s2_continuo_postgrado === true` |
| `s2_razon_no_postgrado` | `s2_continuo_postgrado === false && s2_estudio_uec === true` |
| `s3_linea_insercion` … `s3_formacion_contribuyo` | `s3_trabaja !== "no" || s3_ha_trabajado === true` |
| `s4_tipo_emprendimiento` | `s4_ha_emprendido === true` |
| `s5_area_ppps` y `s5_aplica_conocimientos` | `s5_implemento_ppps === true` |
| `s6_razon_empalme` | `s6_empalme_generacional === true` |

---

## Panel de administración — vistas

| Vista | Ruta | Descripción |
|---|---|---|
| Dashboard | `/` | Métricas clave, gráficas resumen |
| Tabla de egresados | `/egresados` | Listado completo con filtros y búsqueda |
| Detalle de egresado | `/egresados/:id` | Todas las respuestas de un registro |
| Gestión de instituciones | `/instituciones` | Ver instituciones, token y botón "Copiar enlace" |
| Vista institución | `/?token=xxx` | Panel reducido solo con datos de esa institución |

**Vista gestión de instituciones:** solo lectura. Muestra `municipio`,
`institucion_educativa`, `token` y un botón **Copiar enlace** que copia
la `url` al portapapeles. La creación de instituciones se hace directo en Sheets.

---

## Despliegue — GitHub Pages

```
https://<usuario>.github.io/seguimiento-egresados/formulario/
https://<usuario>.github.io/seguimiento-egresados/admin/
```

```js
// formulario/vite.config.js
base: '/seguimiento-egresados/formulario/'

// admin/vite.config.js
base: '/seguimiento-egresados/admin/'
```

El workflow `.github/workflows/deploy.yml` construye ambas apps y publica
en la rama `gh-pages` en cada push a `main`.

Una vez publicado, actualizar `dominio_github_pages` en la pestaña `config`
del Sheets para que GAS genere correctamente las URLs de instituciones.

---

## Variables de entorno

```env
# formulario/.env y admin/.env
VITE_GAS_URL=https://script.google.com/macros/s/XXXXXXXXX/exec
```

---

## Convenciones de código

- Componentes en PascalCase: `FormularioSection1.jsx`
- Hooks con prefijo `use`: `useFormulario.js`, `useEgresados.js`
- Utilidades en camelCase: `formatearFecha.js`, `validarCampos.js`
- Estilos: CSS Modules (`.module.css`) por componente
- Sin librerías de UI externas en el formulario (diseño propio, mobile-first)
- Para gráficas en el admin: Recharts

---

## Estado actual del proyecto

Mes 2 de 9 — diseño del formulario completado.
El siguiente paso (Mes 3) es el setup del proyecto en VS Code:
inicializar los proyectos React + Vite, crear el repositorio en GitHub,
configurar GitHub Actions y escribir el código de GAS.

En el Mes 3 se genera el archivo `GAS.md` con el código completo de Google
Apps Script, listo para que Claude Code lo implemente.