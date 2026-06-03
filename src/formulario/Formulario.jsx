import { useFormulario } from './hooks/useFormulario'
import ProgressBar from './components/ProgressBar'
import Section1 from './sections/Section1'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'
import Section4 from './sections/Section4'
import Section5 from './sections/Section5'
import Section6 from './sections/Section6'
import Section7 from './sections/Section7'
import Section8 from './sections/Section8'
import styles from './Formulario.module.css'

const SECCIONES = [Section1, Section2, Section3, Section4, Section5, Section6, Section7, Section8]

export default function Formulario() {
  const {
    seccionActual,
    datos,
    errores,
    listas,
    cargandoListas,
    errorListas,
    enviando,
    enviado,
    errorEnvio,
    actualizarSeccion,
    siguienteSeccion,
    seccionAnterior,
    enviar,
    totalSecciones,
  } = useFormulario()

  if (cargandoListas) {
    return (
      <div className={styles.pagina}>
        <div className={styles.cargando}>Cargando formulario...</div>
      </div>
    )
  }

  if (errorListas) {
    return (
      <div className={styles.pagina}>
        <div className={styles.errorCarga}>
          No se pudo cargar el formulario: {errorListas}
        </div>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className={styles.pagina}>
        <div className={styles.tarjeta}>
          <div className={styles.exito}>
            <h2>¡Formulario enviado!</h2>
            <p>Gracias por diligenciar el formulario de seguimiento a egresados.<br />Tu información ha sido registrada correctamente.</p>
          </div>
        </div>
      </div>
    )
  }

  const SeccionActual = SECCIONES[seccionActual - 1]
  const esUltima = seccionActual === totalSecciones

  return (
    <div className={styles.pagina}>
      <header className={styles.cabecera}>
        <h1>Seguimiento a Egresados</h1>
        <p>La Universidad en el Campo — Comité de Cafeteros de Caldas</p>
      </header>

      <div className={styles.tarjeta}>
        <ProgressBar actual={seccionActual} total={totalSecciones} />

        <SeccionActual
          datos={datos[`s${seccionActual}`]}
          onChange={campos => actualizarSeccion(seccionActual, campos)}
          errores={errores}
          listas={listas}
        />

        <div className={styles.navegacion}>
          {seccionActual > 1 && (
            <button className={styles.btnSecundario} onClick={seccionAnterior}>
              Anterior
            </button>
          )}
          {esUltima ? (
            <button
              className={styles.btnPrimario}
              onClick={enviar}
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar formulario'}
            </button>
          ) : (
            <button className={styles.btnPrimario} onClick={siguienteSeccion}>
              Siguiente
            </button>
          )}
        </div>

        {errorEnvio && (
          <div className={styles.errorEnvio}>Error al enviar: {errorEnvio}</div>
        )}
      </div>
    </div>
  )
}
