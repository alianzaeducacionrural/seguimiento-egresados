import { MUNICIPIOS } from '../utils/municipios'
import styles from './Section.module.css'

export default function Section1({ datos = {}, onChange, errores = {} }) {
  const anioActual = new Date().getFullYear()

  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 1 — Información general</h2>

      <div className={styles.campo}>
        <label>Tipo de documento *</label>
        <select value={datos.tipo_documento || ''} onChange={e => onChange({ tipo_documento: e.target.value })}>
          <option value="">Seleccionar</option>
          {['CC', 'TI', 'CE', 'PA'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errores.tipo_documento && <span className={styles.error}>{errores.tipo_documento}</span>}
      </div>

      <div className={styles.campo}>
        <label>Número de documento *</label>
        <input
          type="text"
          inputMode="numeric"
          value={datos.numero_documento || ''}
          onChange={e => onChange({ numero_documento: e.target.value })}
          placeholder="Ej: 1234567890"
        />
        {errores.numero_documento && <span className={styles.error}>{errores.numero_documento}</span>}
      </div>

      <div className={styles.campo}>
        <label>Nombre completo *</label>
        <input
          type="text"
          value={datos.nombre || ''}
          onChange={e => onChange({ nombre: e.target.value })}
          placeholder="Nombre y apellidos"
        />
        {errores.nombre && <span className={styles.error}>{errores.nombre}</span>}
      </div>

      <div className={styles.campo}>
        <label>Fecha de nacimiento *</label>
        <input
          type="date"
          value={datos.fecha_nacimiento || ''}
          onChange={e => onChange({ fecha_nacimiento: e.target.value })}
        />
        {errores.fecha_nacimiento && <span className={styles.error}>{errores.fecha_nacimiento}</span>}
      </div>

      <div className={styles.campo}>
        <label>Municipio de residencia *</label>
        <select
          value={datos.municipio_residencia || ''}
          onChange={e => onChange({ municipio_residencia: e.target.value, municipio_otro: '' })}
        >
          <option value="">Seleccionar</option>
          {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {errores.municipio_residencia && <span className={styles.error}>{errores.municipio_residencia}</span>}
      </div>

      {datos.municipio_residencia === 'Otro municipio' && (
        <div className={styles.campo}>
          <label>¿Cuál municipio? *</label>
          <input
            type="text"
            value={datos.municipio_otro || ''}
            onChange={e => onChange({ municipio_otro: e.target.value })}
            placeholder="Nombre del municipio"
          />
          {errores.municipio_otro && <span className={styles.error}>{errores.municipio_otro}</span>}
        </div>
      )}

      <div className={styles.campo}>
        <label>Correo electrónico *</label>
        <input
          type="email"
          value={datos.correo || ''}
          onChange={e => onChange({ correo: e.target.value })}
          placeholder="correo@ejemplo.com"
        />
        {errores.correo && <span className={styles.error}>{errores.correo}</span>}
      </div>

      <div className={styles.campo}>
        <label>Teléfono de contacto *</label>
        <input
          type="tel"
          inputMode="numeric"
          value={datos.telefono || ''}
          onChange={e => onChange({ telefono: e.target.value })}
          placeholder="10 dígitos"
          maxLength={10}
        />
        {errores.telefono && <span className={styles.error}>{errores.telefono}</span>}
      </div>

      <div className={styles.campo}>
        <label>¿Resides en zona rural o urbana? *</label>
        <div className={styles.opciones}>
          {['rural', 'urbana'].map(op => (
            <label key={op} className={styles.radio}>
              <input
                type="radio"
                name="zona"
                value={op}
                checked={datos.zona === op}
                onChange={() => onChange({ zona: op })}
              />
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </label>
          ))}
        </div>
        {errores.zona && <span className={styles.error}>{errores.zona}</span>}
      </div>
    </div>
  )
}
