import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatearFecha, formatearLabel, LABELS_TRABAJA } from '../utils/formatear'
import styles from './TablaEgresados.module.css'

export default function TablaEgresados({ registros }) {
  const [busqueda, setBusqueda] = useState('')
  const [municipioFiltro, setMunicipioFiltro] = useState('')
  const navigate = useNavigate()

  const municipios = useMemo(() => {
    const set = new Set(registros.map(r => r.s1_municipio_residencia).filter(Boolean))
    return [...set].sort()
  }, [registros])

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return registros.filter(r => {
      const matchBusqueda = !q ||
        (r.s1_nombre || '').toLowerCase().includes(q) ||
        (r.s1_numero_documento || '').includes(q)
      const matchMunicipio = !municipioFiltro || r.s1_municipio_residencia === municipioFiltro
      return matchBusqueda && matchMunicipio
    })
  }, [registros, busqueda, municipioFiltro])

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Egresados</h1>

      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className={styles.buscador}
        />
        <select
          value={municipioFiltro}
          onChange={e => setMunicipioFiltro(e.target.value)}
          className={styles.selectFiltro}
        >
          <option value="">Todos los municipios</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <span className={styles.conteo}>{filtrados.length} registros</span>
      </div>

      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Municipio</th>
              <th>Institución</th>
              <th>Situación laboral</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={6} className={styles.vacio}>Sin resultados</td></tr>
            ) : filtrados.map((r, i) => (
              <tr key={i} className={styles.fila} onClick={() => navigate(`/admin/egresados/${i}`)}>
                <td>{r.s1_nombre || '—'}</td>
                <td>{r.s1_numero_documento || '—'}</td>
                <td>{r.s1_municipio_residencia || '—'}</td>
                <td>{r.s2_ie_bachillerato || '—'}</td>
                <td>{formatearLabel(r.s3_trabaja, LABELS_TRABAJA)}</td>
                <td>{formatearFecha(r.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
