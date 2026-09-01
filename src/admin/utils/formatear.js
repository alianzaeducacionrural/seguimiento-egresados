// Traducción de valores codificados del Sheet a texto legible para el admin.

const MAPA_VALOR = {
  // Sí / No y variantes
  si: 'Sí',
  no: 'No',
  en_parte: 'En parte',
  tal_vez: 'Tal vez',
  no_aplica: 'No aplica',

  // Documento
  CC: 'Cédula de ciudadanía',
  TI: 'Tarjeta de identidad',
  CE: 'Cédula de extranjería',
  PA: 'Pasaporte',

  // Zona
  rural: 'Zona rural',
  urbana: 'Zona urbana',

  // Situación laboral
  tiempo_completo: 'Sí, tiempo completo',
  medio_tiempo: 'Sí, medio tiempo',
  formal: 'Formal',
  informal: 'Informal',

  // Niveles educativos
  tecnica: 'Técnica profesional',
  tecnologica: 'Tecnológica',
  universitaria: 'Universitaria',
  posgrado: 'Posgrado',

  // Razones para no continuar estudios
  recursos: 'Falta de recursos',
  distancia: 'Distancia / acceso',
  trabajo: 'Trabajo o familia',

  // Sectores
  agricultura: 'Agricultura',
  industria: 'Industria',
  servicios: 'Servicios',
  comercio: 'Comercio',
  educacion: 'Educación',
  ganaderia: 'Ganadería',
  transformacion_alimentos: 'Transformación de alimentos',
  artesanias: 'Artesanías',

  // Tipo de emprendimiento
  productivo: 'Productivo',
  social: 'Social',
  cultural: 'Cultural',
  tecnologico: 'Tecnológico',
  cientifico: 'Científico',
  deportivo: 'Deportivo',

  // Empalme generacional
  desarrollo_rural: 'Desarrollo rural',
  tradicion_familiar: 'Tradición familiar',
  iniciativas_comunitarias: 'Iniciativas comunitarias',

  // Estrategias Escuela Nueva
  trabajo_equipo: 'Trabajo en equipo',
  uso_guias: 'Uso de guías',
  actividades_conjunto: 'Actividades de conjunto',
  gobierno_estudiantil: 'Gobierno Estudiantil',
  escuela_cafe: 'Escuela y Café',
  seguridad_alimentaria: 'Escuela y Seguridad Alimentaria',
  escuela_virtual: 'Escuela Virtual',
  roles_trabajo: 'Roles de trabajo',
  emprendimiento: 'Emprendimiento',
  empresarismo: 'Empresarismo',

  otro: 'Otro',
}

// Etiqueta legible de un valor suelto (un token).
function etiqueta(token) {
  const limpio = String(token).trim()
  if (limpio === '') return ''
  if (MAPA_VALOR[limpio]) return MAPA_VALOR[limpio]
  // Fallback: guiones_bajos → espacios, primera en mayúscula.
  const texto = limpio.replace(/_/g, ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Formatea un valor de celda (string simple o lista unida por ", " desde GAS).
export function formatearValor(valor) {
  if (valor === null || valor === undefined) return '—'
  const bruto = String(valor).trim()
  if (bruto === '') return '—'
  if (bruto.includes(', ')) {
    return bruto.split(',').map(t => etiqueta(t)).filter(Boolean).join(', ')
  }
  return etiqueta(bruto)
}

// Versión corta para celdas de tabla (Sí / No / —).
export function formatearSiNo(valor) {
  const v = String(valor ?? '').trim()
  if (v === '') return '—'
  return MAPA_VALOR[v] || etiqueta(v)
}

// timestamp ISO → "dd/mm/aaaa, HH:MM"
export function formatearFecha(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const aaaa = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${aaaa}, ${hh}:${min}`
}

// timestamp ISO → "dd/mm/aaaa" (sin hora)
export function formatearFechaCorta(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}
