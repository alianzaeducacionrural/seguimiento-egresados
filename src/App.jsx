import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useListas } from './hooks/useListas'
import styles from './App.module.css'

function Inicio() {
  const { listas, cargando, error } = useListas()

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <img src="https://alianzaeducacionrural.github.io/seguimiento-egresados/favicon.svg" alt="" className={styles.logo} />
        <h1>Universidad en el Campo</h1>
        <p>Comité de Cafeteros de Caldas</p>
      </header>

      <section className={styles.tarjeta}>
        <h2>Seguimiento a Egresados</h2>
        <p>
          El formulario de seguimiento para egresados del programa estará
          disponible en breve.
        </p>
        <div className={styles.estado}>
          {cargando && <span className={styles.cargando}>Verificando conexión…</span>}
          {!cargando && !error && (
            <span className={styles.ok}>
              ✓ Sistema activo — {listas?.municipios?.length ?? 0} municipios cargados
            </span>
          )}
          {error && (
            <span className={styles.error}>Error de conexión: {error}</span>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <a href="/seguimiento-egresados/admin">Panel de administración →</a>
      </footer>
    </main>
  )
}

function Admin() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Panel de Administración</h1>
        <p>Universidad en el Campo — Comité de Cafeteros de Caldas</p>
      </header>
      <section className={styles.tarjeta}>
        <h2>En desarrollo</h2>
        <p>El panel administrativo estará disponible en el Mes 6 del plan de implementación.</p>
      </section>
      <footer className={styles.footer}>
        <a href="/seguimiento-egresados/">← Volver al formulario</a>
      </footer>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/seguimiento-egresados/">
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
