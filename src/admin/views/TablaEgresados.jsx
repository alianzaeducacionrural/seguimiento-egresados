import { useMemo, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { formatearSiNo, formatearFechaCorta } from '../utils/formatear'
import { exportarRegistrosCsv } from '../utils/exportarCsv'
import styles from '../Admin.module.css'

const POR_PAGINA = 20

function distintos(registros, clave) {
  const set = new Set()
  registros.forEach(r => {
    const v = String(r[clave] ?? '').trim()
    if (v) set.add(v)
  })
  return Array.from(set).sort()
}

export default function TablaEgresados() {
  const { registros, cargando, error } = useOutletContext()
  const navigate = useNavigate()

  const [busqueda, setBusqueda] = useState('')
  const [fMunicipio, setFMunicipio] = useState('')
  const [fInstitucion, setFInstitucion] = useState('')
  const [fAnio, setFAnio] = useState('')
  const [pagina, setPagina] = useState(1)

  const municipios = useMemo(() => distintos(registros, 's2_municipio_bachillerato'), [registros])
  const anios = useMemo(() => distintos(registros, 's2_anio_graduacion_media'), [registros])
  const instituciones = useMemo(() => {
    const base = fMunicipio
      ? registros.filter(r => String(r.s2_municipio_bachillerato).trim() === fMunicipio)
      : registros
    return distintos(base, 's2_ie_bachillerato')
  }, [registros, fMunicipio])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return registros.filter(r => {
      if (q && !String(r.s1_nombre ?? '').toLowerCase().includes(q)) return false
      if (fMunicipio && String(r.s2_municipio_bachillerato).trim() !== fMunicipio) return false
      if (fInstitucion && String(r.s2_ie_bachillerato).trim() !== fInstitucion) return false
      if (fAnio && String(r.s2_anio_graduacion_media).trim() !== fAnio) return false
      return true
    })
  }, [registros, busqueda, fMunicipio, fInstitucion, fAnio])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  function limpiar() {
    setBusqueda(''); setFMunicipio(''); setFInstitucion(''); setFAnio(''); setPagina(1)
  }
  function alFiltrar(setter) {
    return (e) => { setter(e.target.value); setPagina(1) }
  }

  const hayFiltros = busqueda || fMunicipio || fInstitucion || fAnio

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) return <p className={styles.avisoError}>⚠ {error}</p>

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitulo}>Egresados</h1>
        <button
          className={styles.btnExportar}
          onClick={() => exportarRegistrosCsv(filtrados, 'egresados.csv')}
          disabled={filtrados.length === 0}
        >
          ⭳ Exportar CSV
        </button>
      </div>

      <div className={styles.filtros}>
        <input
          type="search"
          className="control"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={alFiltrar(setBusqueda)}
        />
        <select
          className="control"
          value={fMunicipio}
          onChange={(e) => { setFMunicipio(e.target.value); setFInstitucion(''); setPagina(1) }}
        >
          <option value="">Todos los municipios</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="control" value={fInstitucion} onChange={alFiltrar(setFInstitucion)}>
          <option value="">Todas las instituciones</option>
          {instituciones.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="control" value={fAnio} onChange={alFiltrar(setFAnio)}>
          <option value="">Todos los años</option>
          {anios.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {hayFiltros && (
          <button className={styles.btnLimpiar} onClick={limpiar}>Limpiar filtros</button>
        )}
      </div>

      <p className={styles.resultadoConteo}>
        {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'}
      </p>

      <div className={styles.tablaWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Municipio</th>
              <th>Institución educativa</th>
              <th>Año grad.</th>
              <th>Trabaja</th>
              <th>Fecha de envío</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map(r => (
              <tr
                key={r._id}
                className={styles.filaClic}
                onClick={() => navigate(`/admin/egresados/${r._id}`)}
              >
                <td>{r.s1_nombre || '—'}</td>
                <td>{r.s2_municipio_bachillerato || '—'}</td>
                <td>{r.s2_ie_bachillerato || '—'}</td>
                <td>{r.s2_anio_graduacion_media || '—'}</td>
                <td>{formatearSiNo(r.s3_trabaja)}</td>
                <td>{formatearFechaCorta(r.timestamp)}</td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.tablaVacia}>
                  {registros.length === 0
                    ? 'Aún no hay respuestas registradas.'
                    : 'Ningún registro coincide con los filtros.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className={styles.paginacion}>
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
