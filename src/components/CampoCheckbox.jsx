import styles from './CampoCheckbox.module.css'

export function CampoCheckbox({ label, nombre, valor = [], onChange, opciones = [], requerido = false }) {
  function toggle(opcionValor) {
    const nuevos = valor.includes(opcionValor)
      ? valor.filter(v => v !== opcionValor)
      : [...valor, opcionValor]
    onChange(nombre, nuevos)
  }

  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <div className={styles.opciones}>
        {opciones.map(op => {
          const activa = valor.includes(op.valor)
          return (
            <button
              key={op.valor}
              type="button"
              role="checkbox"
              aria-checked={activa}
              onClick={() => toggle(op.valor)}
              className={`${styles.opcion} ${activa ? styles.activa : ''}`}
            >
              <span className={styles.caja}>
                {activa && <span className={styles.check}>✓</span>}
              </span>
              {op.etiqueta}
            </button>
          )
        })}
      </div>
    </div>
  )
}
