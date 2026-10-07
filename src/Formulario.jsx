import { useState } from 'react'
import logoUEC from './assets/logo.png'
import { useFormulario } from './hooks/useFormulario'
import { useListas } from './hooks/useListas'
import BarraProgreso from './components/BarraProgreso'
import Seccion1 from './sections/Seccion1'
import Seccion2 from './sections/Seccion2'
import Seccion3 from './sections/Seccion3'
import Seccion4 from './sections/Seccion4'
import Seccion5 from './sections/Seccion5'
import Seccion6 from './sections/Seccion6'
import Seccion7 from './sections/Seccion7'
import Seccion8 from './sections/Seccion8'
import styles from './Formulario.module.css'

const TITULOS = [
  'Información general',
  'Trayectoria educativa',
  'Situación laboral',
  'Emprendimiento',
  'Proyectos Pedagógicos Productivos',
  'Impacto social y generacional',
  'Retroalimentación',
  'Contacto y autorización',
]

const TOTAL = 8

function PantallaCargando() {
  return (
    <div className={styles.pantallaCentro}>
      <div className={styles.spinner} />
      <p className={styles.cargandoTexto}>Cargando formulario…</p>
    </div>
  )
}

function PantallaError({ mensaje }) {
  return (
    <div className={styles.pantallaCentro}>
      <p className={styles.errorTexto}>⚠ {mensaje}</p>
      <button className={styles.btnReintentar} onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  )
}

function Confirmacion() {
  return (
    <div className={styles.pantallaCentro}>
      <div className={styles.confirmCard}>
        <img src={logoUEC} alt="" className={styles.confirmLogo} />
        <div className={styles.confirmIcono}>✓</div>
        <h2 className={styles.confirmTitulo}>¡Gracias por responder!</h2>
        <p className={styles.confirmTexto}>
          Tu información fue registrada correctamente. El Comité de Cafeteros de Caldas
          agradece tu participación en el seguimiento de egresados del programa
          Universidad en el Campo.
        </p>
      </div>
    </div>
  )
}


function PantallaIntro({ onComenzar }) {
  return (
    <div className={styles.introWrap}>
      <div className={styles.introCard}>
        <img src={logoUEC} alt="La Universidad en el Campo" className={styles.introLogo} />
        <span className={styles.introEyebrow}>Comité de Cafeteros de Caldas</span>
        <h1 className={styles.introTitulo}>
          Seguimiento de Egresados
          <span className={styles.introSubtitulo}>Iniciativa La Universidad en el Campo</span>
        </h1>
        <p className={styles.introTexto}>
          Cuéntanos cómo te ha ido después del colegio. Tus respuestas nos ayudan a
          mejorar el modelo de Educación Rural con Escuela Nueva para las próximas
          generaciones del campo.
        </p>
        <ul className={styles.introChips}>
          <li>8 secciones cortas</li>
          <li>≈ 8 minutos</li>
          <li>Datos protegidos</li>
        </ul>
        <button className={styles.btnComenzar} onClick={onComenzar}>
          Comenzar <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

export default function Formulario() {
  const [intro, setIntro] = useState(true)
  const form = useFormulario()
  const { listas, cargando, error: errorListas } = useListas()

  if (cargando) return <PantallaCargando />
  if (errorListas) return <PantallaError mensaje={errorListas} />
  if (form.enviado) return <Confirmacion />
  if (intro) return <PantallaIntro onComenzar={() => setIntro(false)} />

  const n = form.seccionActual
  const as = (seccion) => (campo, valor) => form.actualizarSeccion(seccion, campo, valor)

  const secciones = {
    1: <Seccion1 datos={form.datos.s1} onChange={as(1)} listas={listas} />,
    2: <Seccion2 datos={form.datos.s2} onChange={as(2)} listas={listas} />,
    3: <Seccion3 datos={form.datos.s3} onChange={as(3)} />,
    4: <Seccion4 datos={form.datos.s4} onChange={as(4)} />,
    5: <Seccion5 datos={form.datos.s5} onChange={as(5)} />,
    6: <Seccion6 datos={form.datos.s6} onChange={as(6)} />,
    7: <Seccion7 datos={form.datos.s7} onChange={as(7)} />,
    8: <Seccion8 datos={form.datos.s8} onChange={as(8)} />,
  }

  const contenido = secciones[n]
  const esUltima = n === TOTAL

  return (
    <div className={styles.pagina}>
      <BarraProgreso
        seccionActual={n}
        total={TOTAL}
        titulo={TITULOS[n - 1]}
      />

      <main className={styles.contenedor}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.numCircle}>{n}</span>
            <div>
              <p className={styles.cardEyebrow}>Sección {n} de {TOTAL}</p>
              <h2 className={styles.cardTitulo}>{TITULOS[n - 1]}</h2>
            </div>
          </div>
          <div className={styles.cardBody}>
            {contenido}
          </div>
        </div>

        {form.error && (
          <div className={styles.alerta} role="alert">
            <span className={styles.alertaIcono}>⚠</span>
            {form.error}
          </div>
        )}

        <div className={styles.nav}>
          {n > 1 && (
            <button
              type="button"
              onClick={form.anterior}
              className={styles.btnAnterior}
            >
              <span aria-hidden="true">←</span> Anterior
            </button>
          )}
          <button
            type="button"
            onClick={esUltima ? form.enviar : form.siguiente}
            className={styles.btnSiguiente}
            disabled={form.enviando}
          >
            {esUltima
              ? (form.enviando ? 'Enviando…' : 'Enviar formulario')
              : <>Siguiente <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </main>
    </div>
  )
}
