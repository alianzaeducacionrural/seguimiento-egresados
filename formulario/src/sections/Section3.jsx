import styles from './Section.module.css'

const SECTORES = [
  'Agricultura y ganadería', 'Industria', 'Servicios', 'Comercio', 'Educación',
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

const mostrarLaboral = (datos) =>
  datos.trabaja !== 'no' || datos.ha_trabajado === true

export default function Section3({ datos = {}, onChange, errores = {} }) {
  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 3 — Situación laboral e inserción en el mercado</h2>

      <div className={styles.campo}>
        <label>¿Actualmente trabajas? *</label>
        <div className={styles.opciones}>
          {[['tiempo_completo', 'Sí, tiempo completo'], ['medio_tiempo', 'Sí, medio tiempo'], ['no', 'No']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="trabaja"
                value={v}
                checked={datos.trabaja === v}
                onChange={() => onChange({ trabaja: v })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.trabaja && <span className={styles.error}>{errores.trabaja}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Has trabajado desde que egresaste? *</label>
        <div className={styles.opciones}>
          {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="ha_trabajado"
                checked={datos.ha_trabajado === (v === 'true')}
                onChange={() => onChange({ ha_trabajado: v === 'true' })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.ha_trabajado && <span className={styles.error}>{errores.ha_trabajado}</span>}
      </div>

      {mostrarLaboral(datos) && (
        <>
          <div className={styles.campo}>
            <label>¿Fue a través de la Línea de Inserción Laboral?</label>
            <div className={styles.opciones}>
              {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
                <label key={v} className={styles.radio}>
                  <input
                    type="radio"
                    name="linea_insercion"
                    checked={datos.linea_insercion === (v === 'true')}
                    onChange={() => onChange({ linea_insercion: v === 'true' })}
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.campo}>
            <label>¿Tu empleo está relacionado con tu formación?</label>
            <div className={styles.opciones}>
              {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
                <label key={v} className={styles.radio}>
                  <input
                    type="radio"
                    name="empleo_relacionado"
                    checked={datos.empleo_relacionado === (v === 'true')}
                    onChange={() => onChange({ empleo_relacionado: v === 'true' })}
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.campo}>
            <label>Sector en el que trabajas o trabajaste</label>
            <CheckboxGroup
              opciones={SECTORES}
              valor={datos.sector || []}
              onChange={v => onChange({ sector: v })}
              conOtro
            />
          </div>

          <div className={styles.campo}>
            <label>Tipo de contrato en tu empleo más reciente</label>
            <div className={styles.opciones}>
              {[['formal', 'Formal (con prestaciones)'], ['informal', 'Informal'], ['no_aplica', 'No aplica']].map(([v, l]) => (
                <label key={v} className={styles.radio}>
                  <input
                    type="radio"
                    name="tipo_contrato"
                    value={v}
                    checked={datos.tipo_contrato === v}
                    onChange={() => onChange({ tipo_contrato: v })}
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.campo}>
            <label>¿Tu formación en Escuela Nueva contribuyó a obtener tu trabajo?</label>
            <div className={styles.opciones}>
              {[['si', 'Sí'], ['no', 'No'], ['en_parte', 'En parte']].map(([v, l]) => (
                <label key={v} className={styles.radio}>
                  <input
                    type="radio"
                    name="formacion_contribuyo"
                    value={v}
                    checked={datos.formacion_contribuyo === v}
                    onChange={() => onChange({ formacion_contribuyo: v })}
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
