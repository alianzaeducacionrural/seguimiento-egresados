import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.marca}>Panel Admin — Egresados UEC</span>
      <div className={styles.enlaces}>
        <NavLink to="/admin" end className={({ isActive }) => isActive ? styles.activo : styles.enlace}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/egresados" className={({ isActive }) => isActive ? styles.activo : styles.enlace}>
          Egresados
        </NavLink>
        <NavLink to="/admin/instituciones" className={({ isActive }) => isActive ? styles.activo : styles.enlace}>
          Instituciones
        </NavLink>
      </div>
    </nav>
  )
}
