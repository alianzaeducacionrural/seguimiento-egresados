import { useState } from 'react'
import ConsentModal from '../components/ConsentModal'
import styles from './Section.module.css'

export default function Section8({ datos = {}, onChange, errores = {} }) {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className={styles.seccion}>
      <h2 className={styles.titulo}>Sección 8 — Contacto y autorización</h2>

      <div className={styles.campo}>
        <label>Teléfono de contacto adicional (opcional)</label>
        <input
          type="tel"
          inputMode="numeric"
          value={datos.contacto_telefono || ''}
          onChange={e => onChange({ contacto_telefono: e.target.value })}
          placeholder="10 dígitos"
          maxLength={10}
        />
      </div>

      <div className={styles.campo}>
        <label>Correo electrónico adicional (opcional)</label>
        <input
          type="email"
          value={datos.contacto_correo || ''}
          onChange={e => onChange({ contacto_correo: e.target.value })}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.checkConsentimiento}>
          <input
            type="checkbox"
            checked={datos.autorizacion === true}
            onChange={e => onChange({ autorizacion: e.target.checked })}
          />
          <span>
            Autorizo al Comité de Cafeteros de Caldas — Federación Nacional de Cafeteros
            para recolectar y tratar mis datos personales conforme a la Ley 1581 de 2012.{' '}
            <button type="button" className={styles.enlaceModal} onClick={() => setModalAbierto(true)}>
              Ver texto completo
            </button>
          </span>
        </label>
        {errores.autorizacion && <span className={styles.error}>{errores.autorizacion}</span>}
      </div>

      {modalAbierto && <ConsentModal onCerrar={() => setModalAbierto(false)} />}
    </div>
  )
}
