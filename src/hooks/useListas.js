import { useState, useEffect } from 'react'
import { cargarListas } from '../utils/api'

export function useListas() {
  const [listas, setListas] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarListas()
      .then(data => {
        if (data.ok) setListas(data)
        else setError(data.error || 'Respuesta inválida del servidor')
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  return { listas, cargando, error }
}
