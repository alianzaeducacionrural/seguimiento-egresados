const GAS_URL = import.meta.env.VITE_GAS_URL
const TIMEOUT_MS = 30000

// fetch + JSON con timeout y mensajes legibles (GAS a veces tarda o devuelve HTML).
async function pedir(url, opciones) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...opciones, signal: ctrl.signal })
    if (!res.ok) throw new Error(`El servidor respondió con error (${res.status}).`)
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. Intenta de nuevo.')
    }
    if (err instanceof SyntaxError) {
      throw new Error('Respuesta inesperada del servidor. Intenta de nuevo.')
    }
    if (err instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor. Revisa tu conexión a internet.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export function cargarListas() {
  return pedir(`${GAS_URL}?action=listas`)
}

export function cargarRegistros(token = '') {
  return pedir(token
    ? `${GAS_URL}?action=registros&token=${encodeURIComponent(token)}`
    : `${GAS_URL}?action=registros`)
}

export function cargarInstituciones() {
  return pedir(`${GAS_URL}?action=instituciones`)
}

export function enviarFormulario(datos) {
  return pedir(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(datos),
  })
}
