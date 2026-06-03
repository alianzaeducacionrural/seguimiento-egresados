import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import styles from './Dashboard.module.css'

const COLORES = ['#2d6a4f', '#52b788', '#95d5b2', '#d8f3dc', '#74c69d', '#40916c']

export default function Dashboard({ registros }) {
  const metricas = useMemo(() => {
    const total = registros.length
    const trabajan = registros.filter(r => r.s3_trabaja && r.s3_trabaja !== 'no').length
    const emprendieron = registros.filter(r => String(r.s4_ha_emprendido).toLowerCase() === 'true').length
    const recomendarian = registros.filter(r => r.s7_recomendaria === 'si').length

    const porMunicipio = {}
    registros.forEach(r => {
      const m = r.s1_municipio_residencia || 'Sin dato'
      porMunicipio[m] = (porMunicipio[m] || 0) + 1
    })
    const dataMunicipio = Object.entries(porMunicipio)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))

    const porTrabaja = {}
    const labTrabaja = { tiempo_completo: 'Tiempo completo', medio_tiempo: 'Medio tiempo', no: 'No trabaja' }
    registros.forEach(r => {
      const t = labTrabaja[r.s3_trabaja] || 'Sin dato'
      porTrabaja[t] = (porTrabaja[t] || 0) + 1
    })
    const dataTrabaja = Object.entries(porTrabaja).map(([name, value]) => ({ name, value }))

    return { total, trabajan, emprendieron, recomendarian, dataMunicipio, dataTrabaja }
  }, [registros])

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Dashboard</h1>

      <div className={styles.tarjetas}>
        <div className={styles.tarjeta}>
          <span className={styles.numero}>{metricas.total}</span>
          <span className={styles.etiqueta}>Total de registros</span>
        </div>
        <div className={styles.tarjeta}>
          <span className={styles.numero}>{metricas.trabajan}</span>
          <span className={styles.etiqueta}>Con empleo</span>
        </div>
        <div className={styles.tarjeta}>
          <span className={styles.numero}>{metricas.emprendieron}</span>
          <span className={styles.etiqueta}>Han emprendido</span>
        </div>
        <div className={styles.tarjeta}>
          <span className={styles.numero}>{metricas.recomendarian}</span>
          <span className={styles.etiqueta}>Recomendarían el modelo</span>
        </div>
      </div>

      <div className={styles.graficas}>
        <div className={styles.grafica}>
          <h2>Egresados por municipio (top 10)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metricas.dataMunicipio} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2d6a4f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.grafica}>
          <h2>Situación laboral</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={metricas.dataTrabaja}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {metricas.dataTrabaja.map((_, i) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
