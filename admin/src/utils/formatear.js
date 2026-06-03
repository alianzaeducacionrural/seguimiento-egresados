export function formatearFecha(valor) {
  if (!valor) return '—'
  const d = new Date(valor)
  if (isNaN(d)) return String(valor)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatearBooleano(valor) {
  if (valor === true || valor === 'true' || valor === 'TRUE') return 'Sí'
  if (valor === false || valor === 'false' || valor === 'FALSE') return 'No'
  return valor || '—'
}

export function formatearLabel(valor, mapa) {
  return mapa[valor] || valor || '—'
}

export const LABELS_TRABAJA = {
  tiempo_completo: 'Sí, tiempo completo',
  medio_tiempo: 'Sí, medio tiempo',
  no: 'No',
}

export const LABELS_CONTRATO = {
  formal: 'Formal (con prestaciones)',
  informal: 'Informal',
  no_aplica: 'No aplica',
}

export const LABELS_CONTRIBUYO = {
  si: 'Sí',
  no: 'No',
  en_parte: 'En parte',
}

export const LABELS_RECOMENDARIA = {
  si: 'Sí',
  no: 'No',
  tal_vez: 'Tal vez',
}
