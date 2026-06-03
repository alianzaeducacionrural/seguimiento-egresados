import styles from './ProgressBar.module.css'

export default function ProgressBar({ actual, total }) {
  const porcentaje = Math.round((actual / total) * 100)

  return (
    <div className={styles.contenedor}>
      <div className={styles.barra}>
        <div className={styles.relleno} style={{ width: `${porcentaje}%` }} />
      </div>
      <span className={styles.etiqueta}>
        Sección {actual} de {total}
      </span>
    </div>
  )
}
