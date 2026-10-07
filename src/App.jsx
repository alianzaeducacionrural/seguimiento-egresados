import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Formulario from './Formulario'

// El panel admin (con Recharts) se carga bajo demanda para no pesar en el formulario público.
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/views/Dashboard'))
const TablaEgresados = lazy(() => import('./admin/views/TablaEgresados'))
const DetalleEgresado = lazy(() => import('./admin/views/DetalleEgresado'))
const Instituciones = lazy(() => import('./admin/views/Instituciones'))
const VistaInstitucion = lazy(() => import('./admin/views/VistaInstitucion'))

function Cargando() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
      Cargando…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/seguimiento-egresados/">
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/" element={<Formulario />} />
          <Route path="/admin/institucion" element={<VistaInstitucion />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="egresados" element={<TablaEgresados />} />
            <Route path="egresados/:id" element={<DetalleEgresado />} />
            <Route path="instituciones" element={<Instituciones />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
