import logoUEC from '../assets/logo.png'
import styles from './BarraProgreso.module.css'

export default function BarraProgreso({ seccionActual, total, titulo }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.marca}>
            <img src={logoUEC} alt="La Universidad en el Campo" className={styles.logoImg} />
            <div className={styles.marcaTexto}>
              <span className={styles.marcaNombre}>Universidad en el Campo</span>
              <span className={styles.marcaSub}>Comité de Cafeteros de Caldas</span>
            </div>
          </div>
          <span className={styles.contador}>
            Paso <strong>{seccionActual}</strong> de {total}
          </span>
        </div>

        <div
          className={styles.segmentos}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={seccionActual}
          aria-label={titulo}
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`${styles.segmento} ${i < seccionActual ? styles.hecho : ''} ${i === seccionActual - 1 ? styles.actual : ''}`}
            />
          ))}
        </div>
      </div>
    </header>
  )
}
