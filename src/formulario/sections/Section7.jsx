import styles from './Section.module.css'

const ESTRATEGIAS = [
  'Trabajo en equipo', 'Uso de guías', 'Actividades de conjunto',
  'Gobierno Estudiantil', 'Escuela y Café', 'Escuela y Seguridad Alimentaria',
  'Escuela Virtual', 'Roles de trabajo', 'Emprendimiento', 'Empresarismo',
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

export default function Section7({ datos = {}, onChange, errores = {} }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 7 — Retroalimentación sobre el modelo</h2>

      <div className={styles.campo}>
        <label>¿Qué estrategias de Escuela Nueva han contribuido más a tu desarrollo? *</label>
        <CheckboxGroup
          opciones={ESTRATEGIAS}
          valor={datos.estrategias_escuela_nueva || []}
          onChange={v => onChange({ estrategias_escuela_nueva: v })}
          conOtro
        />
        {errores.estrategias_escuela_nueva && <span className={styles.error}>{errores.estrategias_escuela_nueva}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Qué aspectos deberían mejorarse en el modelo? *</label>
        <textarea
          value={datos.aspectos_mejorar || ''}
          onChange={e => onChange({ aspectos_mejorar: e.target.value })}
          rows={4}
          placeholder="Mínimo 10 caracteres"
        />
        {errores.aspectos_mejorar && <span className={styles.error}>{errores.aspectos_mejorar}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Recomendarías el modelo a otros jóvenes? *</label>
        <div className={styles.opciones}>
          {[['si', 'Sí'], ['no', 'No'], ['tal_vez', 'Tal vez']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="recomendaria"
                value={v}
                checked={datos.recomendaria === v}
                onChange={() => onChange({ recomendaria: v })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.recomendaria && <span className={styles.error}>{errores.recomendaria}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Hay algo más que quisieras compartir sobre tu experiencia?</label>
        <textarea
          value={datos.comentarios_adicionales || ''}
          onChange={e => onChange({ comentarios_adicionales: e.target.value })}
          rows={4}
          placeholder="Opcional"
        />
      </div>
    </div>
  )
}
