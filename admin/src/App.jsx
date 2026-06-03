import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEgresados } from './hooks/useEgresados'
import NavBar from './components/NavBar'
import Dashboard from './views/Dashboard'
import TablaEgresados from './views/TablaEgresados'
import DetalleEgresado from './views/DetalleEgresado'
import Instituciones from './views/Instituciones'
import styles from './App.module.css'

// /?token=xxx → vista reducida para la institución
function VistaInstitucion({ token }) {
  const { registros, metadatos, cargando, error } = useEgresados(token)

  if (cargando) return <div className={styles.estado}>Cargando...</div>
  if (error) return <div className={styles.errorAcceso}>{error}</div>

  return (
    <div className={styles.vistaInstitucion}>
      <header className={styles.cabInstitucion}>
        <h1>{metadatos.institucion}</h1>
        <p>{metadatos.municipio} — {metadatos.total} egresado{metadatos.total !== 1 ? 's' : ''}</p>
      </header>
      <TablaEgresados registros={registros} />
    </div>
  )
}

function AdminCompleto() {
  const { registros, cargando, error } = useEgresados(null)

  if (cargando) return <div className={styles.estado}>Cargando datos...</div>
  if (error) return <div className={styles.errorAcceso}>{error}</div>

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard registros={registros} />} />
        <Route path="/egresados" element={<TablaEgresados registros={registros} />} />
        <Route path="/egresados/:id" element={<DetalleEgresado registros={registros} />} />
        <Route path="/instituciones" element={<Instituciones />} />
      </Routes>
    </>
  )
}

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {token ? <VistaInstitucion token={token} /> : <AdminCompleto />}
    </BrowserRouter>
  )
}
