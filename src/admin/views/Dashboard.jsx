import { useOutletContext, Link } from 'react-router-dom'
import styles from '../Admin.module.css'

function pct(parte, total) {
  if (!total) return '0%'
  return `${Math.round((parte / total) * 100)}%`
}

export default function Dashboard() {
  const { registros, meta, cargando, error } = useOutletContext()

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) return <p className={styles.avisoError}>⚠ {error}</p>

  const total = registros.length
  const continuaron = registros.filter(r => String(r.s2_continuo_superior).trim() === 'si').length
  const conUec = registros.filter(r => String(r.s2_estudio_uec).trim() === 'si').length
  const trabajan = registros.filter(r => {
    const t = String(r.s3_trabaja).trim()
    return t === 'si' || t === 'tiempo_completo' || t === 'medio_tiempo'
  }).length
  const emprendieron = registros.filter(r => String(r.s4_ha_emprendido).trim() === 'si').length

  const tarjetas = [
    { valor: total, etiqueta: 'Egresados registrados' },
    { valor: pct(continuaron, total), etiqueta: 'Continuaron estudios superiores' },
    { valor: pct(conUec, total), etiqueta: 'Cursaron estudios con la UEC' },
    { valor: pct(trabajan, total), etiqueta: 'Trabajan actualmente' },
    { valor: pct(emprendieron, total), etiqueta: 'Han emprendido' },
  ]

  return (
    <div>
      <h1 className={styles.pageTitulo}>Resumen</h1>
      {meta.total === 0 && (
        <p className={styles.aviso}>Aún no hay respuestas registradas.</p>
      )}

      <div className={styles.tarjetas}>
        {tarjetas.map(t => (
          <div key={t.etiqueta} className={styles.tarjeta}>
            <span className={styles.tarjetaValor}>{t.valor}</span>
            <span className={styles.tarjetaEtiqueta}>{t.etiqueta}</span>
          </div>
        ))}
      </div>

      <div className={styles.panelInfo}>
        <p>
          Las gráficas e indicadores cruzados se incorporan en el Mes 7.
          Por ahora puedes consultar el detalle en{' '}
          <Link to="/admin/egresados" className={styles.enlaceTexto}>la tabla de egresados</Link>.
        </p>
      </div>
    </div>
  )
}
