const GAS_URL = import.meta.env.VITE_GAS_URL

export async function cargarListas() {
  const res = await fetch(`${GAS_URL}?action=listas`)
  return res.json()
}

export async function cargarRegistros(token = '') {
  const url = token
    ? `${GAS_URL}?action=registros&token=${encodeURIComponent(token)}`
    : `${GAS_URL}?action=registros`
  const res = await fetch(url)
  return res.json()
}

export async function enviarFormulario(datos) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(datos),
  })
  return res.json()
}
