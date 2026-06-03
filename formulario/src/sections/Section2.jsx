import { MUNICIPIOS } from '../utils/municipios'
import styles from './Section.module.css'

const MUNICIPIOS_SIN_OTRO = MUNICIPIOS.filter(m => m !== 'Otro municipio')
const ANIO_MIN = 2010
const anioActual = new Date().getFullYear()
const ANIOS = Array.from({ length: anioActual - ANIO_MIN + 1 }, (_, i) => anioActual - i)

const RAZONES_NO_CONTINUO = [
  'Recursos económicos', 'Distancia', 'Necesidad de trabajar',
]
const NIVELES_UEC = ['Técnica profesional', 'Tecnológica profesional']
const NIVELES_POSTGRADO = ['Tecnológica', 'Universitaria', 'Posgrado']
const RAZONES_NO_POSTGRADO = [
  'Recursos económicos', 'Distancia', 'Necesidad de trabajar',
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
              if (tieneOtro) {
                onChange(valor.filter(v => opciones.includes(v)))
              } else {
                onChange([...valor, ''])
              }
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

export default function Section2({ datos = {}, onChange, errores = {}, listas = {} }) {
  const instituciones = listas.instituciones || {}

  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 2 — Trayectoria educativa</h2>

      <h3 className={styles.subtitulo}>Egreso de educación media</h3>

      <div className={styles.campo}>
        <label>Municipio donde terminó bachillerato *</label>
        <select
          value={datos.municipio_bachillerato || ''}
          onChange={e => onChange({ municipio_bachillerato: e.target.value, ie_bachillerato: '' })}
        >
          <option value="">Seleccionar</option>
          {MUNICIPIOS_SIN_OTRO.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {errores.municipio_bachillerato && <span className={styles.error}>{errores.municipio_bachillerato}</span>}
      </div>

      {datos.municipio_bachillerato && (
        <div className={styles.campo}>
          <label>Institución educativa *</label>
          <select
            value={datos.ie_bachillerato || ''}
            onChange={e => onChange({ ie_bachillerato: e.target.value })}
          >
            <option value="">Seleccionar</option>
            {(instituciones[datos.municipio_bachillerato] || []).map(ie => (
              <option key={ie} value={ie}>{ie}</option>
            ))}
          </select>
          {errores.ie_bachillerato && <span className={styles.error}>{errores.ie_bachillerato}</span>}
        </div>
      )}

      <div className={styles.campo}>
        <label>Año de graduación de bachillerato *</label>
        <select value={datos.anio_graduacion_media || ''} onChange={e => onChange({ anio_graduacion_media: Number(e.target.value) })}>
          <option value="">Seleccionar</option>
          {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {errores.anio_graduacion_media && <span className={styles.error}>{errores.anio_graduacion_media}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Continuó con estudios superiores? *</label>
        <div className={styles.opciones}>
          {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="continuo_superior"
                checked={datos.continuo_superior === (v === 'true')}
                onChange={() => onChange({ continuo_superior: v === 'true' })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.continuo_superior && <span className={styles.error}>{errores.continuo_superior}</span>}
      </div>

      {datos.continuo_superior === false && (
        <div className={styles.campo}>
          <label>Razón principal para no continuar</label>
          <CheckboxGroup
            opciones={RAZONES_NO_CONTINUO}
            valor={datos.razon_no_continuo || []}
            onChange={v => onChange({ razon_no_continuo: v })}
            conOtro
          />
        </div>
      )}

      <h3 className={styles.subtitulo}>Estudios con La Universidad en el Campo</h3>

      <div className={styles.campo}>
        <label>¿Cursó estudios con La Universidad en el Campo? *</label>
        <div className={styles.opciones}>
          {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input
                type="radio"
                name="estudio_uec"
                checked={datos.estudio_uec === (v === 'true')}
                onChange={() => onChange({ estudio_uec: v === 'true' })}
              />
              {l}
            </label>
          ))}
        </div>
        {errores.estudio_uec && <span className={styles.error}>{errores.estudio_uec}</span>}
      </div>

      {datos.estudio_uec === true && (
        <>
          <div className={styles.campo}>
            <label>Nivel cursado *</label>
            <CheckboxGroup
              opciones={NIVELES_UEC}
              valor={datos.nivel_uec || []}
              onChange={v => onChange({ nivel_uec: v })}
            />
            {errores.nivel_uec && <span className={styles.error}>{errores.nivel_uec}</span>}
          </div>

          <div className={styles.campo}>
            <label>IE donde cursó el programa *</label>
            <input
              type="text"
              value={datos.ie_programa_uec || ''}
              onChange={e => onChange({ ie_programa_uec: e.target.value })}
            />
            {errores.ie_programa_uec && <span className={styles.error}>{errores.ie_programa_uec}</span>}
          </div>

          <div className={styles.campo}>
            <label>Nombre del programa *</label>
            <input
              type="text"
              value={datos.nombre_programa_uec || ''}
              onChange={e => onChange({ nombre_programa_uec: e.target.value })}
            />
            {errores.nombre_programa_uec && <span className={styles.error}>{errores.nombre_programa_uec}</span>}
          </div>

          <div className={styles.campo}>
            <label>Universidad *</label>
            <select value={datos.universidad_uec || ''} onChange={e => onChange({ universidad_uec: e.target.value })}>
              <option value="">Seleccionar</option>
              {(listas.universidades || []).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            {errores.universidad_uec && <span className={styles.error}>{errores.universidad_uec}</span>}
          </div>

          <div className={styles.campo}>
            <label>Año de graduación *</label>
            <select value={datos.anio_grad_uec || ''} onChange={e => onChange({ anio_grad_uec: Number(e.target.value) })}>
              <option value="">Seleccionar</option>
              {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {errores.anio_grad_uec && <span className={styles.error}>{errores.anio_grad_uec}</span>}
          </div>

          <div className={styles.campo}>
            <label>¿Continuó estudios después de graduarse? *</label>
            <div className={styles.opciones}>
              {[['true', 'Sí'], ['false', 'No']].map(([v, l]) => (
                <label key={v} className={styles.radio}>
                  <input
                    type="radio"
                    name="continuo_postgrado"
                    checked={datos.continuo_postgrado === (v === 'true')}
                    onChange={() => onChange({ continuo_postgrado: v === 'true' })}
                  />
                  {l}
                </label>
              ))}
            </div>
            {errores.continuo_postgrado && <span className={styles.error}>{errores.continuo_postgrado}</span>}
          </div>

          {datos.continuo_postgrado === true && (
            <>
              <div className={styles.campo}>
                <label>Nivel de estudios posteriores</label>
                <div className={styles.opciones}>
                  {NIVELES_POSTGRADO.map(n => (
                    <label key={n} className={styles.radio}>
                      <input
                        type="radio"
                        name="nivel_postgrado"
                        value={n}
                        checked={datos.nivel_postgrado === n}
                        onChange={() => onChange({ nivel_postgrado: n })}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.campo}>
                <label>Nombre de la institución</label>
                <input
                  type="text"
                  value={datos.institucion_postgrado || ''}
                  onChange={e => onChange({ institucion_postgrado: e.target.value })}
                />
              </div>

              <div className={styles.campo}>
                <label>Programa o carrera</label>
                <input
                  type="text"
                  value={datos.programa_postgrado || ''}
                  onChange={e => onChange({ programa_postgrado: e.target.value })}
                />
              </div>
            </>
          )}

          {datos.continuo_postgrado === false && (
            <div className={styles.campo}>
              <label>Razón principal para no continuar</label>
              <CheckboxGroup
                opciones={RAZONES_NO_POSTGRADO}
                valor={datos.razon_no_postgrado || []}
                onChange={v => onChange({ razon_no_postgrado: v })}
                conOtro
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
