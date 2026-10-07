import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import FiltrosCruzados from '../components/FiltrosCruzados'
import PanelIndicadores from '../components/PanelIndicadores'
import Icono from '../components/Icono'
import { filtrarRegistros, opcionesFiltro, FILTROS_VACIOS } from '../utils/indicadores'
import styles from '../Admin.module.css'

export default function Dashboard() {
  const { registros, cargando, error } = useOutletContext()
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS })

  const opciones = useMemo(() => opcionesFiltro(registros, filtros.municipio), [registros, filtros.municipio])
  const filtrados = useMemo(() => filtrarRegistros(registros, filtros), [registros, filtros])

  if (cargando) return <p className={styles.aviso}>Cargando datos…</p>
  if (error) {
    return (
      <p className={styles.avisoError}>
        <Icono nombre="alerta" size={18} /> {error}
      </p>
    )
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>Panel de indicadores</p>
          <h1 className={styles.pageTitulo}>Resumen general</h1>
          <p className={styles.pageSub}>
            Cómo van los egresados del programa Universidad en el Campo en Caldas.
          </p>
        </div>
      </div>

      <FiltrosCruzados
        filtros={filtros}
        onChange={setFiltros}
        opciones={opciones}
        conteo={`Mostrando ${filtrados.length} de ${registros.length} egresados`}
      />

      <PanelIndicadores registros={filtrados} />
    </div>
  )
}
