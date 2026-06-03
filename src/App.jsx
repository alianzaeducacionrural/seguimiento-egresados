import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEgresados } from './admin/hooks/useEgresados'
import NavBar from './admin/components/NavBar'
import Dashboard from './admin/views/Dashboard'
import TablaEgresados from './admin/views/TablaEgresados'
import DetalleEgresado from './admin/views/DetalleEgresado'
import Instituciones from './admin/views/Instituciones'
import Formulario from './formulario/Formulario'
import styles from './App.module.css'

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

function AdminWrapper() {
  const { registros, cargando, error } = useEgresados(null)

  if (cargando) return <div className={styles.estado}>Cargando datos...</div>
  if (error) return <div className={styles.errorAcceso}>{error}</div>

  return (
    <>
      <NavBar />
      <Routes>
        <Route index element={<Dashboard registros={registros} />} />
        <Route path="egresados" element={<TablaEgresados registros={registros} />} />
        <Route path="egresados/:id" element={<DetalleEgresado registros={registros} />} />
        <Route path="instituciones" element={<Instituciones />} />
      </Routes>
    </>
  )
}

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {token ? (
        <VistaInstitucion token={token} />
      ) : (
        <Routes>
          <Route path="/" element={<Formulario />} />
          <Route path="/admin/*" element={<AdminWrapper />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
