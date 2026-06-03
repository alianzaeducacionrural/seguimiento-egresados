import styles from './Section.module.css'

const AREAS_PPPS = [
  'Agricultura', 'Ganadería', 'Transformación de alimentos', 'Artesanías', 'Servicios',
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

const RadioSiNo = ({ name, valor, onChange }) => (
  <div className={styles.opciones}>
    {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
      <label key={v} className={styles.radio}>
        <input
          type="radio"
          name={name}
          checked={valor === (v === 'true')}
          onChange={() => onChange(v === 'true')}
        />
        {l}
      </label>
    ))}
  </div>
)

export default function Section5({ datos = {}, onChange, errores = {} }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 5 — Proyectos Pedagógicos Productivos</h2>

      <div className={styles.campo}>
        <label>¿Implementaste algún PPPS durante tu formación? *</label>
        <RadioSiNo name="implemento_ppps" valor={datos.implemento_ppps} onChange={v => onChange({ implemento_ppps: v })} />
        {errores.implemento_ppps && <span className={styles.error}>{errores.implemento_ppps}</span>}
      </div>

      {datos.implemento_ppps === true && (
        <>
          <div className={styles.campo}>
            <label>¿En qué área desarrollaste tu proyecto?</label>
            <CheckboxGroup
              opciones={AREAS_PPPS}
              valor={datos.area_ppps || []}
              onChange={v => onChange({ area_ppps: v })}
              conOtro
            />
          </div>

          <div className={styles.campo}>
            <label>¿Sigues aplicando esos conocimientos en tu vida actual?</label>
            <RadioSiNo name="aplica_conocimientos" valor={datos.aplica_conocimientos} onChange={v => onChange({ aplica_conocimientos: v })} />
          </div>
        </>
      )}
    </div>
  )
}
