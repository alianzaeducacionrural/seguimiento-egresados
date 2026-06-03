// Valida los campos requeridos de cada sección del formulario.
// Retorna null si la sección es válida, o un string con el mensaje de error.
export function validarSeccion(numero, datos) {
  switch (numero) {
    case 1: return validarSeccion1(datos.s1 ?? {})
    case 2: return validarSeccion2(datos.s2 ?? {})
    case 3: return validarSeccion3(datos.s3 ?? {})
    case 4: return validarSeccion4(datos.s4 ?? {})
    case 5: return validarSeccion5(datos.s5 ?? {})
    case 6: return validarSeccion6(datos.s6 ?? {})
    case 7: return validarSeccion7(datos.s7 ?? {})
    case 8: return validarSeccion8(datos.s8 ?? {})
    default: return null
  }
}

function requerido(valor, mensaje) {
  if (!valor || String(valor).trim() === '') return mensaje
  return null
}

function validarSeccion1(s) {
  return (
    requerido(s.tipo_documento, 'Selecciona el tipo de documento') ||
    requerido(s.numero_documento, 'Ingresa el número de documento') ||
    requerido(s.nombre, 'Ingresa tu nombre completo') ||
    requerido(s.fecha_nacimiento, 'Ingresa tu fecha de nacimiento') ||
    requerido(s.municipio_residencia, 'Selecciona el municipio de residencia') ||
    (s.municipio_residencia === 'Otro municipio' && requerido(s.municipio_otro, 'Indica el municipio')) ||
    requerido(s.correo, 'Ingresa tu correo electrónico') ||
    requerido(s.telefono, 'Ingresa tu teléfono de contacto') ||
    requerido(s.zona, 'Selecciona si resides en zona rural o urbana')
  )
}

function validarSeccion2(s) {
  return (
    requerido(s.municipio_bachillerato, 'Selecciona el municipio donde terminaste bachillerato') ||
    requerido(s.ie_bachillerato, 'Selecciona la institución educativa') ||
    requerido(s.anio_graduacion_media, 'Selecciona el año de graduación') ||
    requerido(s.continuo_superior, 'Indica si continuaste con estudios superiores') ||
    requerido(s.estudio_uec, 'Indica si cursaste estudios con La Universidad en el Campo')
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
    requerido(s.ha_emprendido, 'Indica si has emprendido un negocio o proyecto') ||
    requerido(s.fondo_rotatorio, 'Indica si accediste al Fondo Rotatorio') ||
    requerido(s.linea_empresarismo, 'Indica si fuiste beneficiario de la Línea de Empresarismo') ||
    requerido(s.habilidades_emprender, 'Indica si Escuela Nueva te ayudó a desarrollar habilidades para emprender')
  )
}

function validarSeccion5(s) {
  return requerido(s.implemento_ppps, 'Indica si implementaste algún PPPS')
}

function validarSeccion6(s) {
  return requerido(s.empalme_generacional, 'Indica si te consideras parte del empalme generacional')
}

function validarSeccion7(s) {
  return (
    (!s.estrategias_escuela_nueva?.length && 'Selecciona al menos una estrategia de Escuela Nueva') ||
    requerido(s.aspectos_mejorar, 'Indica qué aspectos deberían mejorarse (mínimo 10 caracteres)') ||
    (s.aspectos_mejorar?.length < 10 && 'El campo debe tener al menos 10 caracteres') ||
    requerido(s.recomendaria, 'Indica si recomendarías el modelo')
  )
}

function validarSeccion8(s) {
  return (
    !s.autorizacion && 'Debes aceptar la autorización de tratamiento de datos para enviar el formulario'
  )
}
