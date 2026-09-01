import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logoUEC from '../assets/logo.png'
import { useEgresados } from './hooks/useEgresados'
import styles from './Admin.module.css'

const ENLACES = [
  { to: '/admin', fin: true, icono: '▦', texto: 'Resumen' },
  { to: '/admin/egresados', fin: false, icono: '☰', texto: 'Egresados' },
  { to: '/admin/instituciones', fin: true, icono: '⚑', texto: 'Instituciones' },
]

export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()
  const egresados = useEgresados()

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
        <div className={styles.sidebarMarca}>
          <img src={logoUEC} alt="UEC" className={styles.sidebarLogo} />
          <div>
            <p className={styles.sidebarTitulo}>Seguimiento</p>
            <p className={styles.sidebarSub}>de Egresados</p>
          </div>
        </div>

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
              <span className={styles.navIcono}>{e.icono}</span>
              {e.texto}
            </NavLink>
          ))}
        </nav>

        <p className={styles.sidebarPie}>Comité de Cafeteros de Caldas</p>
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
            ☰
          </button>
          <span className={styles.headerTitulo}>Panel de administración</span>
          <span className={styles.headerContador}>
            {egresados.cargando ? '…' : `${egresados.meta.total} registros`}
          </span>
        </header>

        <main className={styles.contenido} key={location.pathname}>
          <Outlet context={egresados} />
        </main>
      </div>
    </div>
  )
}
