import { useState, useEffect } from 'react'
import { cargarRegistros } from '../utils/api'

export function useEgresados(token) {
  const [registros, setRegistros] = useState([])
  const [metadatos, setMetadatos] = useState({ institucion: null, municipio: null, total: 0 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCargando(true)
    setError(null)
    cargarRegistros(token)
      .then(data => {
        setRegistros(data.registros)
        setMetadatos({ institucion: data.institucion, municipio: data.municipio, total: data.total })
      })
      .catch(e => setError(e.message))
      .finally(() => setCargando(false))
  }, [token])

  return { registros, metadatos, cargando, error }
}
