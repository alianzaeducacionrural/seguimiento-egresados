import { useParams, useNavigate } from 'react-router-dom'
import {
  formatearFecha, formatearBooleano, formatearLabel,
  LABELS_TRABAJA, LABELS_CONTRATO, LABELS_CONTRIBUYO, LABELS_RECOMENDARIA,
} from '../utils/formatear'
import styles from './DetalleEgresado.module.css'

function Campo({ etiqueta, valor }) {
  return (
    <div className={styles.campo}>
      <span className={styles.etiqueta}>{etiqueta}</span>
      <span className={styles.valor}>{valor || '—'}</span>
    </div>
  )
}

function Seccion({ titulo, children }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.tituloSeccion}>{titulo}</h2>
      <div className={styles.campos}>{children}</div>
    </div>
  )
}

export default function DetalleEgresado({ registros }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const r = registros[Number(id)]

  if (!r) {
    return (
      <div className={styles.contenedor}>
        <p>Registro no encontrado.</p>
        <button onClick={() => navigate('/egresados')}>Volver</button>
      </div>
    )
  }

  return (
    <div className={styles.contenedor}>
      <button className={styles.btnVolver} onClick={() => navigate(-1)}>← Volver</button>
      <h1 className={styles.titulo}>{r.s1_nombre || 'Egresado'}</h1>
      <p className={styles.subtitulo}>Registrado: {formatearFecha(r.timestamp)}</p>

      <Seccion titulo="Sección 1 — Información general">
        <Campo etiqueta="Tipo de documento" valor={r.s1_tipo_documento} />
        <Campo etiqueta="Número de documento" valor={r.s1_numero_documento} />
        <Campo etiqueta="Nombre" valor={r.s1_nombre} />
        <Campo etiqueta="Fecha de nacimiento" valor={formatearFecha(r.s1_fecha_nacimiento)} />
        <Campo etiqueta="Municipio de residencia" valor={r.s1_municipio_residencia === 'Otro municipio' ? r.s1_municipio_otro : r.s1_municipio_residencia} />
        <Campo etiqueta="Correo" valor={r.s1_correo} />
        <Campo etiqueta="Teléfono" valor={r.s1_telefono} />
        <Campo etiqueta="Zona" valor={r.s1_zona} />
      </Seccion>

      <Seccion titulo="Sección 2 — Trayectoria educativa">
        <Campo etiqueta="Municipio bachillerato" valor={r.s2_municipio_bachillerato} />
        <Campo etiqueta="IE bachillerato" valor={r.s2_ie_bachillerato} />
        <Campo etiqueta="Año graduación media" valor={r.s2_anio_graduacion_media} />
        <Campo etiqueta="Continuó estudios superiores" valor={formatearBooleano(r.s2_continuo_superior)} />
        <Campo etiqueta="Razón no continuó" valor={r.s2_razon_no_continuo} />
        <Campo etiqueta="Estudió con UEC" valor={formatearBooleano(r.s2_estudio_uec)} />
        <Campo etiqueta="Nivel UEC" valor={r.s2_nivel_uec} />
        <Campo etiqueta="IE programa UEC" valor={r.s2_ie_programa_uec} />
        <Campo etiqueta="Programa UEC" valor={r.s2_nombre_programa_uec} />
        <Campo etiqueta="Universidad" valor={r.s2_universidad_uec} />
        <Campo etiqueta="Año graduación UEC" valor={r.s2_anio_grad_uec} />
        <Campo etiqueta="Continuó posgrado" valor={formatearBooleano(r.s2_continuo_postgrado)} />
        <Campo etiqueta="Nivel posgrado" valor={r.s2_nivel_postgrado} />
        <Campo etiqueta="Institución posgrado" valor={r.s2_institucion_postgrado} />
        <Campo etiqueta="Programa posgrado" valor={r.s2_programa_postgrado} />
      </Seccion>

      <Seccion titulo="Sección 3 — Situación laboral">
        <Campo etiqueta="¿Trabaja actualmente?" valor={formatearLabel(r.s3_trabaja, LABELS_TRABAJA)} />
        <Campo etiqueta="¿Ha trabajado desde que egresó?" valor={formatearBooleano(r.s3_ha_trabajado)} />
        <Campo etiqueta="Línea de inserción laboral" valor={formatearBooleano(r.s3_linea_insercion)} />
        <Campo etiqueta="Empleo relacionado con formación" valor={formatearBooleano(r.s3_empleo_relacionado)} />
        <Campo etiqueta="Sector" valor={r.s3_sector} />
        <Campo etiqueta="Tipo de contrato" valor={formatearLabel(r.s3_tipo_contrato, LABELS_CONTRATO)} />
        <Campo etiqueta="Formación contribuyó a empleo" valor={formatearLabel(r.s3_formacion_contribuyo, LABELS_CONTRIBUYO)} />
      </Seccion>

      <Seccion titulo="Sección 4 — Emprendimiento">
        <Campo etiqueta="¿Ha emprendido?" valor={formatearBooleano(r.s4_ha_emprendido)} />
        <Campo etiqueta="Tipo de emprendimiento" valor={r.s4_tipo_emprendimiento} />
        <Campo etiqueta="Fondo Rotatorio" valor={formatearBooleano(r.s4_fondo_rotatorio)} />
        <Campo etiqueta="Línea de Empresarismo" valor={formatearBooleano(r.s4_linea_empresarismo)} />
        <Campo etiqueta="Habilidades para emprender" valor={formatearBooleano(r.s4_habilidades_emprender)} />
      </Seccion>

      <Seccion titulo="Sección 5 — Proyectos Pedagógicos">
        <Campo etiqueta="Implementó PPPS" valor={formatearBooleano(r.s5_implemento_ppps)} />
        <Campo etiqueta="Área del proyecto" valor={r.s5_area_ppps} />
        <Campo etiqueta="Sigue aplicando conocimientos" valor={formatearBooleano(r.s5_aplica_conocimientos)} />
      </Seccion>

      <Seccion titulo="Sección 6 — Impacto generacional">
        <Campo etiqueta="Empalme generacional" valor={formatearBooleano(r.s6_empalme_generacional)} />
        <Campo etiqueta="Razón empalme" valor={r.s6_razon_empalme} />
      </Seccion>

      <Seccion titulo="Sección 7 — Retroalimentación">
        <Campo etiqueta="Estrategias Escuela Nueva" valor={r.s7_estrategias_escuela_nueva} />
        <Campo etiqueta="Aspectos a mejorar" valor={r.s7_aspectos_mejorar} />
        <Campo etiqueta="¿Recomendaría el modelo?" valor={formatearLabel(r.s7_recomendaria, LABELS_RECOMENDARIA)} />
        <Campo etiqueta="Comentarios adicionales" valor={r.s7_comentarios_adicionales} />
      </Seccion>

      <Seccion titulo="Sección 8 — Contacto">
        <Campo etiqueta="Teléfono adicional" valor={r.s8_contacto_telefono} />
        <Campo etiqueta="Correo adicional" valor={r.s8_contacto_correo} />
        <Campo etiqueta="Autorizó datos" valor={formatearBooleano(r.s8_autorizacion)} />
      </Seccion>
    </div>
  )
}
