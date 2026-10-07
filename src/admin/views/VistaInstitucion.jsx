import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import logoUEC from '../../assets/logo.png'
import { useEgresados } from '../hooks/useEgresados'
import FiltrosCruzados from '../components/FiltrosCruzados'
import PanelIndicadores from '../components/PanelIndicadores'
import Icono from '../components/Icono'
import { filtrarRegistros, opcionesFiltro, FILTROS_VACIOS } from '../utils/indicadores'
import styles from '../Admin.module.css'

function Marco({ children, titulo, subtitulo }) {
  return (
    <div className={styles.instPagina}>
      <header className={styles.instHeader}>
        <div className={styles.instHeaderInner}>
          <img src={logoUEC} alt="La Universidad en el Campo" className={styles.instLogo} />
          <div className={styles.instTitulos}>
            <p className={styles.pageEyebrow}>Seguimiento a egresados · UEC</p>
            <h1 className={styles.instNombre}>{titulo}</h1>
            {subtitulo && <p className={styles.instSub}>{subtitulo}</p>}
          </div>
        </div>
      </header>
      <main className={styles.instContenido}>{children}</main>
      <footer className={styles.instPie}>Comité de Cafeteros de Caldas</footer>
    </div>
  )
}

function Mensaje({ icono = 'alerta', titulo, texto, cargando = false }) {
  return (
    <div className={styles.mensajeCentro}>
      {cargando ? <div className={styles.spinner} /> : <span className={styles.mensajeIcono}><Icono nombre={icono} size={26} /></span>}
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
    </div>
  )
}

function ConToken({ token }) {
  const { registros, meta, cargando, error } = useEgresados(token)
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS })

  const opciones = useMemo(() => opcionesFiltro(registros), [registros])
  const filtrados = useMemo(() => filtrarRegistros(registros, filtros), [registros, filtros])

  if (cargando) {
    return <Marco titulo="Cargando panel…"><Mensaje cargando titulo="Consultando los datos" /></Marco>
  }

  if (error) {
    const invalido = /token/i.test(error)
    return (
      <Marco titulo="Panel por institución">
        <Mensaje
          titulo={invalido ? 'Enlace no válido' : 'No pudimos cargar los datos'}
          texto={invalido
            ? 'El enlace que usaste no corresponde a ninguna institución. Pide el enlace correcto al Comité de Cafeteros.'
            : 'Revisa tu conexión e intenta de nuevo en unos minutos.'}
        />
      </Marco>
    )
  }

  return (
    <Marco titulo={meta.institucion || 'Institución educativa'} subtitulo={meta.municipio ? `Municipio de ${meta.municipio}` : undefined}>
      {registros.length === 0 ? (
        <Mensaje
          icono="brote"
          titulo="Aún no hay respuestas"
          texto="Cuando los egresados de esta institución respondan el formulario, verás aquí sus indicadores."
        />
      ) : (
        <>
          <FiltrosCruzados
            filtros={filtros}
            onChange={setFiltros}
            opciones={opciones}
            ocultar={['municipio', 'institucion']}
            conteo={`Mostrando ${filtrados.length} de ${registros.length} egresados`}
          />
          <PanelIndicadores registros={filtrados} />
        </>
      )}
    </Marco>
  )
}

export default function VistaInstitucion() {
  const [params] = useSearchParams()
  const token = (params.get('token') || '').trim()

  if (!token) {
    return (
      <Marco titulo="Panel por institución">
        <Mensaje
          titulo="Falta el enlace de acceso"
          texto="Esta página necesita el enlace personal de tu institución. Pídelo al Comité de Cafeteros de Caldas."
        />
      </Marco>
    )
  }

  return <ConToken token={token} />
}
