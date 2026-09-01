import { CLAVES_CSV, ETIQUETAS_CSV } from './campos'
import { formatearValor, formatearFecha } from './formatear'

function celda(texto) {
  const s = String(texto ?? '')
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// Genera y descarga un CSV con los registros dados (ya filtrados).
export function exportarRegistrosCsv(registros, nombreArchivo = 'egresados.csv') {
  const encabezado = ETIQUETAS_CSV.map(celda).join(';')

  const filas = registros.map(r =>
    CLAVES_CSV.map(clave => {
      const bruto = r[clave]
      if (clave === 'timestamp') return celda(formatearFecha(bruto))
      return celda(formatearValor(bruto))
    }).join(';')
  )

  // BOM (﻿) para que Excel reconozca UTF-8.
  const contenido = '﻿' + [encabezado, ...filas].join('\r\n')
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
