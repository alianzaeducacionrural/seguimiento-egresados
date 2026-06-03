// Valida los campos requeridos de cada sección.
// Retorna un string con el mensaje de error, o null si la sección es válida.
export function validarSeccion(numero, datos) {
  switch (numero) {
    case 1: return validarSeccion1(datos.s1 ?? {})
    case 2: return validarSeccion2(datos.s2 ?? {})
    case 3: return validarSeccion3(datos.s3 ?? {})
    case 4: return validarSeccion4(datos.s4 ?? {})
    // Secciones 5–8 se implementan en Mes 5; pasan automáticamente por ahora
    default: return null
  }
}

function requerido(valor, mensaje) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return mensaje
  return null
}

function validarSeccion1(s) {
  return (
    requerido(s.tipo_documento, 'Selecciona el tipo de documento') ||
    requerido(s.numero_documento, 'Ingresa el número de documento') ||
    requerido(s.nombre, 'Ingresa tu nombre completo') ||
    requerido(s.fecha_nacimiento, 'Ingresa tu fecha de nacimiento') ||
    requerido(s.municipio_residencia, 'Selecciona el municipio de residencia') ||
    (s.municipio_residencia === 'Otro municipio'
      ? requerido(s.municipio_otro, 'Indica el nombre del municipio')
      : null) ||
    requerido(s.correo, 'Ingresa tu correo electrónico') ||
    requerido(s.telefono, 'Ingresa tu teléfono de contacto') ||
    requerido(s.zona, 'Indica si resides en zona rural o urbana')
  )
}

function validarSeccion2(s) {
  return (
    requerido(s.municipio_bachillerato, 'Selecciona el municipio donde terminaste el bachillerato') ||
    requerido(s.ie_bachillerato, 'Selecciona la institución educativa') ||
    requerido(s.anio_graduacion_media, 'Selecciona el año de graduación') ||
    requerido(s.continuo_superior, '¿Continuaste con estudios superiores? Selecciona una opción') ||
    requerido(s.estudio_uec, '¿Cursaste estudios con La Universidad en el Campo? Selecciona una opción')
  )
}

function validarSeccion3(s) {
  return (
    requerido(s.trabaja, 'Indica si actualmente trabajas') ||
    requerido(s.ha_trabajado, 'Indica si has trabajado desde que egresaste')
  )
}

function validarSeccion4(s) {
  return (
    requerido(s.ha_emprendido, 'Indica si has emprendido un negocio o proyecto propio') ||
    requerido(s.fondo_rotatorio, 'Indica si accediste al Fondo Rotatorio') ||
    requerido(s.linea_empresarismo, 'Indica si fuiste beneficiario de la Línea de Empresarismo') ||
    requerido(s.habilidades_emprender, 'Indica si Escuela Nueva te ayudó a desarrollar habilidades para emprender')
  )
}
