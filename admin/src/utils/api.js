const GAS_URL = import.meta.env.VITE_GAS_URL

export async function cargarRegistros(token) {
  const url = token ? `${GAS_URL}?action=registros&token=${token}` : `${GAS_URL}?action=registros`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Error al cargar registros')
  return data
}
