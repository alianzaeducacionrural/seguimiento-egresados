import styles from './Section.module.css'

const RAZONES_EMPALME = [
  'Trabajo en actividades que fortalecen el desarrollo rural',
  'Continúo con la tradición familiar en el sector productivo',
  'Participo en iniciativas comunitarias o liderazgos locales',
]

function CheckboxGroup({ opciones, valor = [], onChange, conOtro }) {
  const toggleOpcion = (op) => {
    const nuevo = valor.includes(op) ? valor.filter(v => v !== op) : [...valor, op]
    onChange(nuevo)
  }
  const tieneOtro = valor.some(v => !opciones.includes(v))
  const textoOtro = tieneOtro ? valor.find(v => !opciones.includes(v)) : ''

  return (
    <div className={styles.checkGroup}>
      {opciones.map(op => (
        <label key={op} className={styles.check}>
          <input type="checkbox" checked={valor.includes(op)} onChange={() => toggleOpcion(op)} />
          {op}
        </label>
      ))}
      {conOtro && (
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={tieneOtro}
            onChange={() => {
              if (tieneOtro) onChange(valor.filter(v => opciones.includes(v)))
              else onChange([...valor, ''])
            }}
          />
          Otro
          {tieneOtro && (
            <input
              type="text"
              className={styles.otroInput}
              value={textoOtro}
              onChange={e => {
                const filtrado = valor.filter(v => opciones.includes(v))
                onChange([...filtrado, e.target.value])
              }}
              placeholder="Especifica"
            />
          )}
        </label>
      )}
    </div>
  )
}

export default function Section6({ datos = {}, onChange, errores = {} }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 6 — Impacto social y generacional</h2>

      <div className={styles.campo}>
        <label>¿Te consideras parte del empalme generacional en tu comunidad? *</label>
        <div className={styles.opciones}>
          {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="empalme_generacional"
                checked={datos.empalme_generacional === (v === 'true')}
                onChange={() => onChange({ empalme_generacional: v === 'true' })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.empalme_generacional && <span className={styles.error}>{errores.empalme_generacional}</span>}
      </div>

      {datos.empalme_generacional === true && (
        <div className={styles.campo}>
          <label>¿Por qué te consideras parte del empalme generacional?</label>
          <CheckboxGroup
            opciones={RAZONES_EMPALME}
            valor={datos.razon_empalme || []}
            onChange={v => onChange({ razon_empalme: v })}
            conOtro
          />
        </div>
      )}
    </div>
  )
}
