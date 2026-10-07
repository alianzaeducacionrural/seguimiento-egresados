import Icono from './Icono'
import { FILTROS_VACIOS } from '../utils/indicadores'
import styles from '../Admin.module.css'

// Barra de filtros municipio → institución → año, en cascada.
// `ocultar` permite esconder campos (p. ej. en la vista de una sola institución).
export default function FiltrosCruzados({ filtros, onChange, opciones, ocultar = [], conteo, children }) {
  const hay = filtros.municipio || filtros.institucion || filtros.anio
  const mostrar = (campo) => !ocultar.includes(campo)

  function cambiar(campo, valor) {
    const siguiente = { ...filtros, [campo]: valor }
    if (campo === 'municipio') siguiente.institucion = ''
    onChange(siguiente)
  }

  return (
    <div className={styles.filtrosBarra}>
      <div className={styles.filtrosGrid}>
        {children}
        {mostrar('municipio') && (
          <label className={styles.filtroCampo}>
            <span>Municipio</span>
            <select className="control" value={filtros.municipio} onChange={e => cambiar('municipio', e.target.value)}>
              <option value="">Todos</option>
              {opciones.municipios.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        )}
        {mostrar('institucion') && (
          <label className={styles.filtroCampo}>
            <span>Institución educativa</span>
            <select className="control" value={filtros.institucion} onChange={e => cambiar('institucion', e.target.value)}>
              <option value="">Todas</option>
              {opciones.instituciones.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
        )}
        {mostrar('anio') && (
          <label className={styles.filtroCampo}>
            <span>Año de graduación</span>
            <select className="control" value={filtros.anio} onChange={e => cambiar('anio', e.target.value)}>
              <option value="">Todos</option>
              {opciones.anios.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className={styles.filtrosPie}>
        {conteo && <span className={styles.filtrosConteo}>{conteo}</span>}
        {hay && (
          <button className={styles.btnLimpiar} onClick={() => onChange({ ...FILTROS_VACIOS })}>
            <Icono nombre="cerrar" size={14} /> Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
