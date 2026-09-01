import { useState, useEffect, useMemo } from 'react'
import { cargarInstituciones } from '../../utils/api'
import styles from '../Admin.module.css'

function enlaceInstitucion(inst) {
  if (inst.url) return inst.url
  if (!inst.token) return ''
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '')
  return `${base}/admin/institucion?token=${inst.token}`
}

export default function Instituciones() {
  const [instituciones, setInstituciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [copiado, setCopiado] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarInstituciones()
      .then(data => {
        if (data.ok) setInstituciones(data.instituciones || [])
        else setError(data.error || 'Respuesta inválida del servidor')
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return instituciones
    return instituciones.filter(i =>
      `${i.municipio} ${i.nombre}`.toLowerCase().includes(q)
    )
  }, [instituciones, busqueda])

  async function copiar(inst) {
    const enlace = enlaceInstitucion(inst)
    if (!enlace) return
    try {
      await navigator.clipboard.writeText(enlace)
      setCopiado(inst.nombre + inst.municipio)
      setTimeout(() => setCopiado(null), 2000)
    } catch {
      window.prompt('Copia el enlace:', enlace)
    }
  }

  if (cargando) return <p className={styles.aviso}>Cargando instituciones…</p>
  if (error) return <p className={styles.avisoError}>⚠ {error}</p>

  const sinToken = instituciones.some(i => !i.token)

  return (
    <div>
      <h1 className={styles.pageTitulo}>Instituciones</h1>
      <p className={styles.aviso}>
        Cada institución tiene un enlace propio con su token para consultar
        únicamente los egresados de esa institución.
      </p>
      {sinToken && (
        <p className={styles.avisoError}>
          Hay instituciones sin token. Ejecuta <code>generarTokensFaltantes()</code>{' '}
          en el editor de Google Apps Script.
        </p>
      )}

      <div className={styles.filtros}>
        <input
          type="search"
          className="control"
          placeholder="Buscar institución o municipio…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className={styles.tablaWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Municipio</th>
              <th>Institución educativa</th>
              <th>Token</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(inst => {
              const clave = inst.nombre + inst.municipio
              return (
                <tr key={clave}>
                  <td>{inst.municipio || '—'}</td>
                  <td>{inst.nombre || '—'}</td>
                  <td><code>{inst.token || '—'}</code></td>
                  <td>
                    <button
                      className={styles.btnCopiar}
                      onClick={() => copiar(inst)}
                      disabled={!inst.token}
                    >
                      {copiado === clave ? '✓ Copiado' : 'Copiar enlace'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.tablaVacia}>
                  {instituciones.length === 0
                    ? 'No hay instituciones registradas en el Sheet.'
                    : 'Ninguna institución coincide con la búsqueda.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
