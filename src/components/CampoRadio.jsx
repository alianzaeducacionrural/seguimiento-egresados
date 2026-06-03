import styles from './CampoRadio.module.css'

export function CampoRadio({ label, nombre, valor, onChange, opciones = [], requerido = false }) {
  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <div className={styles.opciones} role="radiogroup" aria-label={label}>
        {opciones.map(op => (
          <button
            key={op.valor}
            type="button"
            role="radio"
            aria-checked={valor === op.valor}
            onClick={() => onChange(nombre, op.valor)}
            className={`${styles.opcion} ${valor === op.valor ? styles.activa : ''}`}
          >
            {op.etiqueta}
          </button>
        ))}
      </div>
    </div>
  )
}
