const GAS_URL = import.meta.env.VITE_GAS_URL

export async function cargarListas() {
  const res = await fetch(`${GAS_URL}?action=listas`)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Error al cargar listas')
  return data
}

export async function enviarFormulario(payload) {
  // GAS requiere Content-Type: text/plain para peticiones POST cross-origin
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Error al enviar el formulario')
  return data
}
