import { useOutletContext, useParams, useNavigate } from 'react-router-dom'
import { SECCIONES } from '../utils/campos'
import { formatearValor, formatearFecha } from '../utils/formatear'
import styles from '../Admin.module.css'

export default function DetalleEgresado() {
  const { registros, cargando, error } = useOutletContext()
  const { id } = useParams()
  const navigate = useNavigate()

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) return <p className={styles.avisoError}>⚠ {error}</p>

  const registro = registros.find(r => String(r._id) === String(id))

  if (!registro) {
    return (
      <div>
        <button className={styles.btnVolver} onClick={() => navigate('/admin/egresados')}>
          ← Volver
        </button>
        <p className={styles.avisoError}>No se encontró el registro solicitado.</p>
      </div>
    )
  }

  return (
    <div>
      <button className={styles.btnVolver} onClick={() => navigate(-1)}>← Volver</button>

      <h1 className={styles.pageTitulo}>{registro.s1_nombre || 'Egresado sin nombre'}</h1>
      <p className={styles.detalleMeta}>
        Enviado el {formatearFecha(registro.timestamp)}
      </p>

      {SECCIONES.map(seccion => (
        <section key={seccion.titulo} className={styles.detalleSeccion}>
          <h2 className={styles.detalleSeccionTitulo}>{seccion.titulo}</h2>
          <dl className={styles.detalleLista}>
            {seccion.campos.map(([clave, etiqueta]) => (
              <div key={clave} className={styles.detalleFila}>
                <dt className={styles.detalleDt}>{etiqueta}</dt>
                <dd className={styles.detalleDd}>{formatearValor(registro[clave])}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
