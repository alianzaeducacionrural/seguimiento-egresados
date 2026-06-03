import { useState } from 'react'
import { validarSeccion } from '../utils/validaciones'
import { enviarFormulario } from '../utils/api'

const ESTADO_INICIAL = {
  s1: {}, s2: {}, s3: {}, s4: {}, s5: {}, s6: {}, s7: {}, s8: {},
}

export function useFormulario() {
  const [seccionActual, setSeccionActual] = useState(1)
  const [datos, setDatos] = useState(ESTADO_INICIAL)
  const [error, setError] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function actualizarSeccion(n, campo, valor) {
    setDatos(prev => ({
      ...prev,
      [`s${n}`]: { ...prev[`s${n}`], [campo]: valor },
    }))
    setError(null)
  }

  function siguiente() {
    const mensajeError = validarSeccion(seccionActual, datos)
    if (mensajeError) {
      setError(mensajeError)
      return
    }
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSeccionActual(prev => Math.min(prev + 1, 8))
  }

  function anterior() {
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSeccionActual(prev => Math.max(prev - 1, 1))
  }

  async function enviar() {
    const mensajeError = validarSeccion(8, datos)
    if (mensajeError) {
      setError(mensajeError)
      return
    }
    setEnviando(true)
    setError(null)
    try {
      const resultado = await enviarFormulario({
        ...datos,
        timestamp: new Date().toISOString(),
        version: '1.0',
      })
      if (resultado.ok) setEnviado(true)
      else setError(resultado.error || 'Error desconocido al enviar.')
    } catch {
      setError('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return { seccionActual, datos, error, enviado, enviando, actualizarSeccion, siguiente, anterior, enviar }
}
