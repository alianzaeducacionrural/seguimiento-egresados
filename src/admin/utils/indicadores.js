import { etiquetaValor, dividirLista } from './formatear'

export const FILTROS_VACIOS = { municipio: '', institucion: '', anio: '' }

const norm = (v) => String(v ?? '').trim()

function contar(registros, extraer) {
  const mapa = new Map()
  registros.forEach(r => {
    extraer(r).forEach(clave => {
      if (!clave) return
      mapa.set(clave, (mapa.get(clave) || 0) + 1)
    })
  })
  return mapa
}

function aSerie(mapa, { limite, etiquetar = etiquetaValor } = {}) {
  const serie = Array.from(mapa, ([clave, valor]) => ({ nombre: etiquetar(clave), valor }))
    .sort((a, b) => b.valor - a.valor)
  return limite ? serie.slice(0, limite) : serie
}

const trabajaActual = (r) => ['si', 'tiempo_completo', 'medio_tiempo'].includes(norm(r.s3_trabaja))

// Filtra por municipio / institución / año de graduación (bachillerato).
export function filtrarRegistros(registros, { municipio = '', institucion = '', anio = '' } = {}) {
  return registros.filter(r => {
    if (municipio && norm(r.s2_municipio_bachillerato) !== municipio) return false
    if (institucion && norm(r.s2_ie_bachillerato) !== institucion) return false
    if (anio && norm(r.s2_anio_graduacion_media) !== anio) return false
    return true
  })
}

export function opcionesFiltro(registros, municipioElegido = '') {
  const distintos = (lista, clave) =>
    Array.from(new Set(lista.map(r => norm(r[clave])).filter(Boolean))).sort()
  const base = municipioElegido
    ? registros.filter(r => norm(r.s2_municipio_bachillerato) === municipioElegido)
    : registros
  return {
    municipios: distintos(registros, 's2_municipio_bachillerato'),
    instituciones: distintos(base, 's2_ie_bachillerato'),
    anios: distintos(registros, 's2_anio_graduacion_media'),
  }
}

export function calcularIndicadores(registros) {
  const total = registros.length
  const cuenta = (fn) => registros.filter(fn).length
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

  const continuaron = cuenta(r => norm(r.s2_continuo_superior) === 'si')
  const conUec = cuenta(r => norm(r.s2_estudio_uec) === 'si')
  const trabajan = cuenta(trabajaActual)
  const emprendieron = cuenta(r => norm(r.s4_ha_emprendido) === 'si')

  const porMunicipio = aSerie(
    contar(registros, r => [norm(r.s2_municipio_bachillerato)]),
    { limite: 10, etiquetar: (x) => x },
  )

  const sectores = aSerie(contar(registros, r => dividirLista(r.s3_sector)))
  const emprendimiento = aSerie(contar(registros, r => dividirLista(r.s4_tipo_emprendimiento)))
  const estrategias = aSerie(
    contar(registros, r => dividirLista(r.s7_estrategias_escuela_nueva)),
    { limite: 8 },
  )

  const recomendaria = ['si', 'tal_vez', 'no']
    .map(clave => ({
      nombre: etiquetaValor(clave),
      valor: cuenta(r => norm(r.s7_recomendaria) === clave),
    }))
    .filter(d => d.valor > 0)

  const siNo = (clave, universo = () => true) => {
    const base = registros.filter(universo)
    return {
      si: base.filter(r => norm(r[clave]) === 'si').length,
      no: base.filter(r => norm(r[clave]) === 'no').length,
    }
  }
  const sup = siNo('s2_continuo_superior')
  const uec = siNo('s2_estudio_uec')
  const post = siNo('s2_continuo_postgrado', r => norm(r.s2_estudio_uec) === 'si')
  const continuidad = [
    { nombre: 'Estudios superiores', Sí: sup.si, No: sup.no },
    { nombre: 'Cursó con la UEC', Sí: uec.si, No: uec.no },
    { nombre: 'Siguió tras la UEC', Sí: post.si, No: post.no },
  ]
  const continuidadVacia = continuidad.every(c => c.Sí + c.No === 0)

  const porAnio = Array.from(contar(registros, r => [norm(r.s2_anio_graduacion_media)]))
    .map(([anio, valor]) => ({ anio, valor }))
    .sort((a, b) => Number(a.anio) - Number(b.anio))

  return {
    total,
    continuaron, conUec, trabajan, emprendieron,
    pctContinuaron: pct(continuaron),
    pctUec: pct(conUec),
    pctTrabajan: pct(trabajan),
    pctEmprendieron: pct(emprendieron),
    porMunicipio, sectores, emprendimiento, estrategias, recomendaria,
    continuidad: continuidadVacia ? [] : continuidad,
    porAnio,
  }
}
