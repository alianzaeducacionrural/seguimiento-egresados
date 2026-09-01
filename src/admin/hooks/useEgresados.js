import { useState, useEffect, useCallback } from 'react'
import { cargarRegistros } from '../../utils/api'

// Carga los registros de egresados desde GAS.
// Con token → solo los de esa institución; sin token → todos.
export function useEgresados(token = '') {
  const [registros, setRegistros] = useState([])
  const [meta, setMeta] = useState({ institucion: null, municipio: null, total: 0 })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)

  const recargar = useCallback(() => {
    setCargando(true)
    setError(null)
    setNonce(n => n + 1)
  }, [])

  useEffect(() => {
    let activo = true
    cargarRegistros(token)
      .then(data => {
        if (!activo) return
        if (!data.ok) {
          setError(data.error || 'Respuesta inválida del servidor')
          return
        }
        // _id estable = posición original en la respuesta de GAS.
        setRegistros((data.registros || []).map((r, i) => ({ ...r, _id: i })))
        setMeta({
          institucion: data.institucion ?? null,
          municipio: data.municipio ?? null,
          total: data.total ?? (data.registros || []).length,
        })
      })
      .catch(err => { if (activo) setError(err.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [token, nonce])

  return { registros, meta, cargando, error, recargar }
}
