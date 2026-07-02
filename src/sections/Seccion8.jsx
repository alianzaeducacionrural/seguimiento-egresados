import { useState } from 'react'
import { CampoTexto } from '../components/CampoTexto'
import ModalConsentimiento from '../components/ModalConsentimiento'
import styles from './Seccion8.module.css'

export default function Seccion8({ datos = {}, onChange }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const autorizado = datos.autorizacion === 'si'

  function toggleAutorizacion() {
    onChange('autorizacion', autorizado ? '' : 'si')
  }

  return (
    <>
      <CampoTexto
        label="Teléfono de contacto adicional (opcional)"
        nombre="contacto_telefono"
        valor={datos.contacto_telefono ?? ''}
        onChange={onChange}
        tipo="tel"
        placeholder="10 dígitos"
      />
      <CampoTexto
        label="Correo electrónico adicional (opcional)"
        nombre="contacto_correo"
        valor={datos.contacto_correo ?? ''}
        onChange={onChange}
        tipo="email"
        placeholder="correo@ejemplo.com"
      />

      <div className={styles.autorizacionWrap}>
        <button
          type="button"
          onClick={toggleAutorizacion}
          className={`${styles.checkBtn} ${autorizado ? styles.activo : ''}`}
          aria-pressed={autorizado}
        >
          {autorizado && <span className={styles.checkMarca}>✓</span>}
        </button>
        <div className={styles.autorizacionTexto}>
          <span>
            Autorizo el tratamiento de mis datos personales de acuerdo con la Ley 1581 de 2012.{' '}
          </span>
          <button
            type="button"
            className={styles.linkModal}
            onClick={() => setModalAbierto(true)}
          >
            Ver texto completo
          </button>
          <span className={styles.requeridoMarca}> *</span>
        </div>
      </div>

      {modalAbierto && (
        <ModalConsentimiento onCerrar={() => setModalAbierto(false)} />
      )}
    </>
  )
}
