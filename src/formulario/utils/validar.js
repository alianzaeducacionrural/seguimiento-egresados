export function validarSeccion(seccion, datos) {
  const errores = {}

  if (seccion === 1) {
    if (!datos.tipo_documento) errores.tipo_documento = 'Requerido'
    if (!datos.numero_documento || !/^\d+$/.test(datos.numero_documento))
      errores.numero_documento = 'Solo números, requerido'
    if (!datos.nombre || datos.nombre.trim().length < 3)
      errores.nombre = 'Mínimo 3 caracteres'
    if (!datos.fecha_nacimiento) errores.fecha_nacimiento = 'Requerido'
    if (!datos.municipio_residencia) errores.municipio_residencia = 'Requerido'
    if (datos.municipio_residencia === 'Otro municipio' && !datos.municipio_otro)
      errores.municipio_otro = 'Indique el municipio'
    if (!datos.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo))
      errores.correo = 'Correo inválido'
    if (!datos.telefono || !/^\d{10}$/.test(datos.telefono))
      errores.telefono = '10 dígitos requeridos'
    if (!datos.zona) errores.zona = 'Requerido'
  }

  if (seccion === 2) {
    if (!datos.municipio_bachillerato) errores.municipio_bachillerato = 'Requerido'
    if (!datos.ie_bachillerato) errores.ie_bachillerato = 'Requerido'
    if (!datos.anio_graduacion_media) errores.anio_graduacion_media = 'Requerido'
    if (datos.continuo_superior === undefined || datos.continuo_superior === '')
      errores.continuo_superior = 'Requerido'
    if (datos.estudio_uec === undefined || datos.estudio_uec === '')
      errores.estudio_uec = 'Requerido'
    if (datos.estudio_uec === true) {
      if (!datos.nivel_uec || datos.nivel_uec.length === 0) errores.nivel_uec = 'Requerido'
      if (!datos.ie_programa_uec) errores.ie_programa_uec = 'Requerido'
      if (!datos.nombre_programa_uec) errores.nombre_programa_uec = 'Requerido'
      if (!datos.universidad_uec) errores.universidad_uec = 'Requerido'
      if (!datos.anio_grad_uec) errores.anio_grad_uec = 'Requerido'
      if (datos.continuo_postgrado === undefined || datos.continuo_postgrado === '')
        errores.continuo_postgrado = 'Requerido'
    }
  }

  if (seccion === 3) {
    if (!datos.trabaja) errores.trabaja = 'Requerido'
    if (datos.ha_trabajado === undefined || datos.ha_trabajado === '')
      errores.ha_trabajado = 'Requerido'
  }

  if (seccion === 4) {
    if (datos.ha_emprendido === undefined || datos.ha_emprendido === '')
      errores.ha_emprendido = 'Requerido'
    if (datos.fondo_rotatorio === undefined || datos.fondo_rotatorio === '')
      errores.fondo_rotatorio = 'Requerido'
    if (datos.linea_empresarismo === undefined || datos.linea_empresarismo === '')
      errores.linea_empresarismo = 'Requerido'
    if (datos.habilidades_emprender === undefined || datos.habilidades_emprender === '')
      errores.habilidades_emprender = 'Requerido'
  }

  if (seccion === 5) {
    if (datos.implemento_ppps === undefined || datos.implemento_ppps === '')
      errores.implemento_ppps = 'Requerido'
  }

  if (seccion === 6) {
    if (datos.empalme_generacional === undefined || datos.empalme_generacional === '')
      errores.empalme_generacional = 'Requerido'
  }

  if (seccion === 7) {
    if (!datos.estrategias_escuela_nueva || datos.estrategias_escuela_nueva.length === 0)
      errores.estrategias_escuela_nueva = 'Selecciona al menos una opción'
    if (!datos.aspectos_mejorar || datos.aspectos_mejorar.trim().length < 10)
      errores.aspectos_mejorar = 'Mínimo 10 caracteres'
    if (!datos.recomendaria) errores.recomendaria = 'Requerido'
  }

  if (seccion === 8) {
    if (!datos.autorizacion) errores.autorizacion = 'Debes aceptar el tratamiento de datos'
  }

  return errores
}
