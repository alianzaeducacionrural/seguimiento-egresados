import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Formulario from './Formulario'

function AdminPlaceholder() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Panel de Administración</h1>
      <p style={{ color: '#64748B' }}>En desarrollo — disponible en el Mes 6.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/seguimiento-egresados/">
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/admin/*" element={<AdminPlaceholder />} />
      </Routes>
    </BrowserRouter>
  )
}
