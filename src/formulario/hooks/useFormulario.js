import { useState, useEffect } from 'react'
import { cargarListas, enviarFormulario } from '../utils/api'
import { validarSeccion } from '../utils/validar'

const TOTAL_SECCIONES = 8

const estadoInicial = {
  s1: {},
  s2: {},
  s3: {},
  s4: {},
  s5: {},
  s6: {},
  s7: {},
  s8: {},
}

export function useFormulario() {
  const [seccionActual, setSeccionActual] = useState(1)
  const [datos, setDatos] = useState(estadoInicial)
  const [errores, setErrores] = useState({})
  const [listas, setListas] = useState({ municipios: [], instituciones: {}, universidades: [] })
  const [cargandoListas, setCargandoListas] = useState(true)
  const [errorListas, setErrorListas] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)

  useEffect(() => {
    cargarListas()
      .then(data => setListas(data))
      .catch(e => setErrorListas(e.message))
      .finally(() => setCargandoListas(false))
  }, [])

  function actualizarSeccion(num, campos) {
    setDatos(prev => ({
      ...prev,
      [`s${num}`]: { ...prev[`s${num}`], ...campos },
    }))
    setErrores({})
  }

  function siguienteSeccion() {
    const clave = `s${seccionActual}`
    const erroresActuales = validarSeccion(seccionActual, datos[clave])
    if (Object.keys(erroresActuales).length > 0) {
      setErrores(erroresActuales)
      return
    }
    setSeccionActual(s => Math.min(s + 1, TOTAL_SECCIONES))
    window.scrollTo(0, 0)
  }

  function seccionAnterior() {
    setSeccionActual(s => Math.max(s - 1, 1))
    setErrores({})
    window.scrollTo(0, 0)
  }

  async function enviar() {
    const erroresActuales = validarSeccion(8, datos.s8)
    if (Object.keys(erroresActuales).length > 0) {
      setErrores(erroresActuales)
      return
    }
    setEnviando(true)
    setErrorEnvio(null)
    try {
      await enviarFormulario({
        version: '1.0',
        timestamp: new Date().toISOString(),
        ...datos,
      })
      setEnviado(true)
    } catch (e) {
      setErrorEnvio(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return {
    seccionActual,
    datos,
    errores,
    listas,
    cargandoListas,
    errorListas,
    enviando,
    enviado,
    errorEnvio,
    actualizarSeccion,
    siguienteSeccion,
    seccionAnterior,
    enviar,
    totalSecciones: TOTAL_SECCIONES,
  }
}
