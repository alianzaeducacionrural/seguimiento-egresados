import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logoUEC from '../assets/logo.png'
import Icono from './components/Icono'
import { useEgresados } from './hooks/useEgresados'
import styles from './Admin.module.css'

const ENLACES = [
  { to: '/admin', fin: true, icono: 'resumen', texto: 'Resumen' },
  { to: '/admin/egresados', fin: false, icono: 'egresados', texto: 'Egresados' },
  { to: '/admin/instituciones', fin: true, icono: 'instituciones', texto: 'Instituciones' },
]

function tituloDe(pathname) {
  if (pathname.startsWith('/admin/egresados')) return 'Egresados'
  if (pathname.startsWith('/admin/instituciones')) return 'Instituciones'
  return 'Resumen'
}

export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()
  const egresados = useEgresados()

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
        <div className={styles.sidebarMarca}>
          <span className={styles.sidebarLogoWrap}>
            <img src={logoUEC} alt="UEC" className={styles.sidebarLogo} />
          </span>
          <div>
            <p className={styles.sidebarTitulo}>Seguimiento</p>
            <p className={styles.sidebarSub}>de Egresados</p>
          </div>
        </div>

        <p className={styles.navSeccion}>Panel</p>
        <nav className={styles.nav}>
          {ENLACES.map(e => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.fin}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActivo : ''}`
              }
              onClick={() => setMenuAbierto(false)}
            >
              <Icono nombre={e.icono} size={19} />
              {e.texto}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarPie}>
          <span className={styles.sidebarPieTitulo}>Universidad en el Campo</span>
          Comité de Cafeteros de Caldas
        </div>
      </aside>

      {menuAbierto && (
        <div className={styles.overlay} onClick={() => setMenuAbierto(false)} />
      )}

      <div className={styles.principal}>
        <header className={styles.header}>
          <button
            className={styles.hamburguesa}
            onClick={() => setMenuAbierto(v => !v)}
            aria-label="Abrir menú"
          >
            <Icono nombre="menu" size={22} />
          </button>
          <span className={styles.headerTitulo}>{tituloDe(location.pathname)}</span>

          <div className={styles.headerAcciones}>
            <span className={styles.headerContador}>
              {egresados.cargando ? 'Cargando…' : `${egresados.meta.total} registros`}
            </span>
            <button
              className={styles.btnIcono}
              onClick={egresados.recargar}
              disabled={egresados.cargando}
              title="Actualizar datos"
              aria-label="Actualizar datos"
            >
              <Icono nombre="refrescar" size={18} className={egresados.cargando ? styles.girando : ''} />
            </button>
          </div>
        </header>

        <main className={styles.contenido} key={location.pathname}>
          <Outlet context={egresados} />
        </main>
      </div>
    </div>
  )
}
