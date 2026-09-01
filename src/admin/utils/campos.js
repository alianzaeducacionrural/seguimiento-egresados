// Estructura de las respuestas del formulario, agrupada por sección.
// Se usa en la vista de detalle y como base para la exportación a CSV.
// Cada campo: [clave en el Sheet, etiqueta legible].

export const SECCIONES = [
  {
    titulo: 'Información general',
    campos: [
      ['s1_tipo_documento', 'Tipo de documento'],
      ['s1_numero_documento', 'Número de documento'],
      ['s1_nombre', 'Nombre completo'],
      ['s1_fecha_nacimiento', 'Fecha de nacimiento'],
      ['s1_municipio_residencia', 'Municipio de residencia'],
      ['s1_municipio_otro', 'Otro municipio'],
      ['s1_correo', 'Correo electrónico'],
      ['s1_telefono', 'Teléfono de contacto'],
      ['s1_zona', 'Zona'],
    ],
  },
  {
    titulo: 'Trayectoria educativa',
    campos: [
      ['s2_municipio_bachillerato', 'Municipio del bachillerato'],
      ['s2_ie_bachillerato', 'Institución educativa'],
      ['s2_anio_graduacion_media', 'Año de graduación (media)'],
      ['s2_continuo_superior', '¿Continuó estudios superiores?'],
      ['s2_razon_no_continuo', 'Razón para no continuar'],
      ['s2_estudio_uec', '¿Cursó estudios con la UEC?'],
      ['s2_nivel_uec', 'Nivel cursado en la UEC'],
      ['s2_ie_programa_uec', 'Institución del programa UEC'],
      ['s2_nombre_programa_uec', 'Nombre del programa UEC'],
      ['s2_universidad_uec', 'Universidad que avaló'],
      ['s2_anio_grad_uec', 'Año de graduación UEC'],
      ['s2_continuo_postgrado', '¿Continuó estudios tras la UEC?'],
      ['s2_nivel_postgrado', 'Nivel de estudios posteriores'],
      ['s2_institucion_postgrado', 'Institución posterior'],
      ['s2_programa_postgrado', 'Programa posterior'],
      ['s2_razon_no_postgrado', 'Razón para no continuar tras la UEC'],
    ],
  },
  {
    titulo: 'Situación laboral',
    campos: [
      ['s3_trabaja', '¿Trabaja actualmente?'],
      ['s3_ha_trabajado', '¿Ha trabajado desde que egresó?'],
      ['s3_linea_insercion', '¿Empleo por la Línea de Inserción Laboral?'],
      ['s3_empleo_relacionado', '¿Empleo relacionado con su formación?'],
      ['s3_sector', 'Sector'],
      ['s3_tipo_contrato', 'Tipo de contrato'],
      ['s3_formacion_contribuyo', '¿La formación contribuyó a conseguir empleo?'],
    ],
  },
  {
    titulo: 'Emprendimiento',
    campos: [
      ['s4_ha_emprendido', '¿Ha emprendido?'],
      ['s4_tipo_emprendimiento', 'Tipo de emprendimiento'],
      ['s4_fondo_rotatorio', '¿Accedió al Fondo Rotatorio?'],
      ['s4_linea_empresarismo', '¿Beneficiario de la Línea de Empresarismo?'],
      ['s4_habilidades_emprender', '¿Escuela Nueva ayudó a emprender?'],
    ],
  },
  {
    titulo: 'Proyectos Pedagógicos Productivos',
    campos: [
      ['s5_implemento_ppps', '¿Implementó algún PPPS?'],
      ['s5_area_ppps', 'Área del PPPS'],
      ['s5_aplica_conocimientos', '¿Sigue aplicando esos conocimientos?'],
    ],
  },
  {
    titulo: 'Impacto social y generacional',
    campos: [
      ['s6_empalme_generacional', '¿Parte del empalme generacional?'],
      ['s6_razon_empalme', 'Razón del empalme'],
    ],
  },
  {
    titulo: 'Retroalimentación',
    campos: [
      ['s7_estrategias_escuela_nueva', 'Estrategias que más aportaron'],
      ['s7_aspectos_mejorar', 'Aspectos a mejorar'],
      ['s7_recomendaria', '¿Recomendaría el modelo?'],
      ['s7_comentarios_adicionales', 'Comentarios adicionales'],
    ],
  },
  {
    titulo: 'Contacto y autorización',
    campos: [
      ['s8_contacto_telefono', 'Teléfono de contacto adicional'],
      ['s8_contacto_correo', 'Correo de contacto adicional'],
      ['s8_autorizacion', 'Autorización de tratamiento de datos'],
    ],
  },
]

// Lista plana de todas las claves, en orden, con "timestamp" al frente.
export const CLAVES_CSV = [
  'timestamp',
  ...SECCIONES.flatMap(s => s.campos.map(([clave]) => clave)),
]

// Etiquetas correspondientes a CLAVES_CSV.
export const ETIQUETAS_CSV = [
  'Fecha de envío',
  ...SECCIONES.flatMap(s => s.campos.map(([, etiqueta]) => etiqueta)),
]
