import logoUEC from '../assets/logo.png'
import styles from './BarraProgreso.module.css'

export default function BarraProgreso({ seccionActual, total, titulo }) {
  const porcentaje = Math.round((seccionActual / total) * 100)

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.marca}>
          <img src={logoUEC} alt="La Universidad en el Campo" className={styles.logoImg} />
          <div className={styles.marcaTexto}>
            <span className={styles.marcaNombre}>Universidad en el Campo</span>
            <span className={styles.marcaSub}>Comité de Cafeteros de Caldas</span>
          </div>
        </div>
        <span className={styles.contador}>{seccionActual} / {total}</span>
      </div>

      <div className={styles.barraFondo}>
        <div
          className={styles.barraRelleno}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <p className={styles.tituloSeccion}>{titulo}</p>
    </header>
  )
}
