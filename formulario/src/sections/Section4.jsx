import styles from './Section.module.css'

const TIPOS_EMPRENDIMIENTO = [
  'Productivo', 'Social', 'Cultural', 'Tecnológico', 'Científico', 'Deportivo',
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

export default function Section4({ datos = {}, onChange, errores = {} }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 4 — Emprendimiento y recursos de apoyo</h2>

      <div className={styles.campo}>
        <label>¿Has emprendido un negocio o proyecto propio? *</label>
        <RadioSiNo name="ha_emprendido" valor={datos.ha_emprendido} onChange={v => onChange({ ha_emprendido: v })} />
        {errores.ha_emprendido && <span className={styles.error}>{errores.ha_emprendido}</span>}
      </div>

      {datos.ha_emprendido === true && (
        <div className={styles.campo}>
          <label>Tipo de emprendimiento</label>
          <CheckboxGroup
            opciones={TIPOS_EMPRENDIMIENTO}
            valor={datos.tipo_emprendimiento || []}
            onChange={v => onChange({ tipo_emprendimiento: v })}
            conOtro
          />
        </div>
      )}

      <div className={styles.campo}>
        <label>¿Accediste al Fondo Rotatorio durante tu formación? *</label>
        <RadioSiNo name="fondo_rotatorio" valor={datos.fondo_rotatorio} onChange={v => onChange({ fondo_rotatorio: v })} />
        {errores.fondo_rotatorio && <span className={styles.error}>{errores.fondo_rotatorio}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Fuiste beneficiario de la Línea de Empresarismo? *</label>
        <RadioSiNo name="linea_empresarismo" valor={datos.linea_empresarismo} onChange={v => onChange({ linea_empresarismo: v })} />
        {errores.linea_empresarismo && <span className={styles.error}>{errores.linea_empresarismo}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Tu formación en Escuela Nueva te ayudó a desarrollar habilidades para emprender? *</label>
        <RadioSiNo name="habilidades_emprender" valor={datos.habilidades_emprender} onChange={v => onChange({ habilidades_emprender: v })} />
        {errores.habilidades_emprender && <span className={styles.error}>{errores.habilidades_emprender}</span>}
      </div>
    </div>
  )
}
