import { useMemo, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import FiltrosCruzados from '../components/FiltrosCruzados'
import Icono from '../components/Icono'
import { filtrarRegistros, opcionesFiltro, FILTROS_VACIOS } from '../utils/indicadores'
import { formatearSiNo, formatearFechaCorta, iniciales } from '../utils/formatear'
import { exportarRegistrosCsv } from '../utils/exportarCsv'
import styles from '../Admin.module.css'

const POR_PAGINA = 20

function InsigniaTrabaja({ valor }) {
  const v = String(valor ?? '').trim()
  if (!v) return <span className={`${styles.insignia} ${styles.insigniaNo}`}>—</span>
  const clase = v === 'no' ? styles.insigniaNo : styles.insigniaSi
  return <span className={`${styles.insignia} ${clase}`}>{formatearSiNo(v)}</span>
}

export default function TablaEgresados() {
  const { registros, cargando, error } = useOutletContext()
  const navigate = useNavigate()

  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS })
  const [pagina, setPagina] = useState(1)

  const opciones = useMemo(() => opcionesFiltro(registros, filtros.municipio), [registros, filtros.municipio])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return filtrarRegistros(registros, filtros).filter(r =>
      !q || String(r.s1_nombre ?? '').toLowerCase().includes(q),
    )
  }, [registros, filtros, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) {
    return <p className={styles.avisoError}><Icono nombre="alerta" size={18} /> {error}</p>
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>Registros del formulario</p>
          <h1 className={styles.pageTitulo}>Egresados</h1>
        </div>
        <button
          className={styles.btnExportar}
          onClick={() => exportarRegistrosCsv(filtrados, 'egresados.csv')}
          disabled={filtrados.length === 0}
        >
          <Icono nombre="descargar" size={16} /> Exportar CSV
        </button>
      </div>

      <FiltrosCruzados
        filtros={filtros}
        onChange={(f) => { setFiltros(f); setPagina(1) }}
        opciones={opciones}
        conteo={`${filtrados.length} ${filtrados.length === 1 ? 'resultado' : 'resultados'}`}
      >
        <label className={styles.filtroCampo}>
          <span>Buscar por nombre</span>
          <input
            type="search"
            className="control"
            placeholder="Ej: María Gómez"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
          />
        </label>
      </FiltrosCruzados>

      <div className={styles.tablaWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Egresado</th>
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
                <td>
                  <div className={styles.celdaPersona}>
                    <span className={styles.avatar}>{iniciales(r.s1_nombre)}</span>
                    {r.s1_nombre || '—'}
                  </div>
                </td>
                <td>{r.s2_municipio_bachillerato || '—'}</td>
                <td className={styles.celdaInst}>{r.s2_ie_bachillerato || '—'}</td>
                <td>{r.s2_anio_graduacion_media || '—'}</td>
                <td><InsigniaTrabaja valor={r.s3_trabaja} /></td>
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
          <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={paginaActual === 1}>
            ← Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
