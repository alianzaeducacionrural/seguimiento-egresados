import { useState, useEffect } from 'react'
import { cargarRegistros } from '../utils/api'
import styles from './Instituciones.module.css'

export default function Instituciones() {
  const [instituciones, setInstituciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [copiado, setCopiado] = useState(null)

  useEffect(() => {
    cargarRegistros()
      .then(data => {
        // Extraer instituciones únicas de los registros
        const mapa = {}
        data.registros.forEach(r => {
          const key = `${r.s2_municipio_bachillerato}|${r.s2_ie_bachillerato}`
          if (!mapa[key] && r.s2_ie_bachillerato) {
            mapa[key] = { municipio: r.s2_municipio_bachillerato, institucion: r.s2_ie_bachillerato }
          }
        })
        setInstituciones(Object.values(mapa).sort((a, b) => a.municipio.localeCompare(b.municipio)))
      })
      .catch(e => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  async function copiarEnlace(token) {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}?token=${token}`
    await navigator.clipboard.writeText(url)
    setCopiado(token)
    setTimeout(() => setCopiado(null), 2000)
  }

  if (cargando) return <div className={styles.estado}>Cargando instituciones...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Instituciones</h1>
      <p className={styles.nota}>
        Los tokens y URLs se generan desde Google Apps Script con la función{' '}
        <code>generarTokensFaltantes()</code>. Esta vista muestra las instituciones
        con egresados registrados.
      </p>

      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Municipio</th>
              <th>Institución educativa</th>
            </tr>
          </thead>
          <tbody>
            {instituciones.length === 0 ? (
              <tr><td colSpan={2} className={styles.vacio}>Sin registros aún</td></tr>
            ) : instituciones.map((ie, i) => (
              <tr key={i}>
                <td>{ie.municipio}</td>
                <td>{ie.institucion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
