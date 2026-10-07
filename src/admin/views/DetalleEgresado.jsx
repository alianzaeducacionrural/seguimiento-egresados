import { useOutletContext, useParams, useNavigate } from 'react-router-dom'
import Icono from '../components/Icono'
import { SECCIONES } from '../utils/campos'
import { formatearValor, formatearFecha, iniciales } from '../utils/formatear'
import styles from '../Admin.module.css'

const ANCHAS = new Set(['Retroalimentación', 'Trayectoria educativa'])

export default function DetalleEgresado() {
  const { registros, cargando, error } = useOutletContext()
  const { id } = useParams()
  const navigate = useNavigate()

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) {
    return <p className={styles.avisoError}><Icono nombre="alerta" size={18} /> {error}</p>
  }

  const registro = registros.find(r => String(r._id) === String(id))

  if (!registro) {
    return (
      <div>
        <button className={styles.btnVolver} onClick={() => navigate('/admin/egresados')}>
          <Icono nombre="volver" size={15} /> Volver
        </button>
        <p className={styles.avisoError}>No se encontró el registro solicitado.</p>
      </div>
    )
  }

  return (
    <div>
      <button className={styles.btnVolver} onClick={() => navigate(-1)}>
        <Icono nombre="volver" size={15} /> Volver
      </button>

      <div className={styles.detalleCabecera}>
        <span className={`${styles.avatar} ${styles.avatarGrande}`}>{iniciales(registro.s1_nombre)}</span>
        <div>
          <p className={styles.pageEyebrow}>Ficha del egresado</p>
          <h1 className={styles.pageTitulo}>{registro.s1_nombre || 'Egresado sin nombre'}</h1>
          <div className={styles.detalleChips}>
            {registro.s2_ie_bachillerato && <span className={styles.chip}>{registro.s2_ie_bachillerato}</span>}
            {registro.s2_municipio_bachillerato && <span className={styles.chip}>{registro.s2_municipio_bachillerato}</span>}
            {registro.s2_anio_graduacion_media && <span className={styles.chip}>Grado {registro.s2_anio_graduacion_media}</span>}
            <span className={`${styles.chip} ${styles.chipCafe}`}>Enviado {formatearFecha(registro.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className={styles.detalleGrid}>
        {SECCIONES.map((seccion, i) => (
          <section
            key={seccion.titulo}
            className={`${styles.detalleSeccion} ${ANCHAS.has(seccion.titulo) ? styles.detalleSeccionAncha : ''}`}
          >
            <header className={styles.detalleSeccionHead}>
              <span className={styles.detalleNum}>{i + 1}</span>
              <h2 className={styles.detalleSeccionTitulo}>{seccion.titulo}</h2>
            </header>
            <dl className={styles.detalleLista}>
              {seccion.campos.map(([clave, etiqueta]) => {
                const valor = formatearValor(registro[clave])
                return (
                  <div key={clave} className={styles.detalleFila}>
                    <dt className={styles.detalleDt}>{etiqueta}</dt>
                    <dd className={`${styles.detalleDd} ${valor === '—' ? styles.detalleDdVacio : ''}`}>{valor}</dd>
                  </div>
                )
              })}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
}
