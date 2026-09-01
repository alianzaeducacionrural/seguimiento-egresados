import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Formulario from './Formulario'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/views/Dashboard'
import TablaEgresados from './admin/views/TablaEgresados'
import DetalleEgresado from './admin/views/DetalleEgresado'
import Instituciones from './admin/views/Instituciones'

export default function App() {
  return (
    <BrowserRouter basename="/seguimiento-egresados/">
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="egresados" element={<TablaEgresados />} />
          <Route path="egresados/:id" element={<DetalleEgresado />} />
          <Route path="instituciones" element={<Instituciones />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
