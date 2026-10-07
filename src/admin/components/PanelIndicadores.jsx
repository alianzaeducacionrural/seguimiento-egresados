import { useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area, LabelList,
} from 'recharts'
import Icono from './Icono'
import { calcularIndicadores } from '../utils/indicadores'
import styles from './Panel.module.css'

const PALETA = ['#0E6B3B', '#8DC63F', '#9A5B2A', '#E5A21B', '#2F7F8F', '#C8553D', '#8A9A8F']
const COLOR_SI = '#0E6B3B'
const COLOR_NO = '#D8BC92'
const COLOR_EJE = '#5E6E63'
const COLOR_REJILLA = '#E8E5D6'

const ejeTick = { fontSize: 12, fill: COLOR_EJE }

function TooltipCaja({ active, payload, label, sufijo = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      {label !== undefined && label !== '' && <p className={styles.tooltipTitulo}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className={styles.tooltipFila}>
          <span className={styles.tooltipPunto} style={{ background: p.color || p.payload?.fill }} />
          {p.name ?? p.payload?.nombre}: <strong>{p.value}</strong>{sufijo}
        </p>
      ))}
    </div>
  )
}

function Kpi({ icono, tono, valor, etiqueta, detalle, barra }) {
  return (
    <div className={`${styles.kpi} ${styles[`tono_${tono}`]}`}>
      <span className={styles.kpiIcono}><Icono nombre={icono} size={20} /></span>
      <span className={styles.kpiValor}>{valor}</span>
      <span className={styles.kpiEtiqueta}>{etiqueta}</span>
      {barra !== undefined && (
        <span className={styles.kpiBarra}><span style={{ width: `${barra}%` }} /></span>
      )}
      {detalle && <span className={styles.kpiDetalle}>{detalle}</span>}
    </div>
  )
}

function Tarjeta({ titulo, subtitulo, span, vacio, children }) {
  return (
    <section className={`${styles.tarjeta} ${styles[span]}`}>
      <header className={styles.tarjetaHead}>
        <h3 className={styles.tarjetaTitulo}>{titulo}</h3>
        {subtitulo && <p className={styles.tarjetaSub}>{subtitulo}</p>}
      </header>
      {vacio ? (
        <div className={styles.vacio}>
          <Icono nombre="brote" size={26} />
          <span>Aún no hay respuestas para esta gráfica</span>
        </div>
      ) : children}
    </section>
  )
}

function Dona({ datos }) {
  const total = datos.reduce((s, d) => s + d.valor, 0)
  return (
    <div className={styles.dona}>
      <div className={styles.donaGrafica}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={datos}
              dataKey="valor"
              nameKey="nombre"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={datos.length > 1 ? 3 : 0}
              cornerRadius={5}
              stroke="none"
            >
              {datos.map((_, i) => <Cell key={i} fill={PALETA[i % PALETA.length]} />)}
            </Pie>
            <Tooltip content={<TooltipCaja />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.donaCentro}>
          <strong>{total}</strong>
          <span>respuestas</span>
        </div>
      </div>
      <ul className={styles.leyenda}>
        {datos.map((d, i) => (
          <li key={d.nombre}>
            <span className={styles.leyendaPunto} style={{ background: PALETA[i % PALETA.length] }} />
            <span className={styles.leyendaNombre}>{d.nombre}</span>
            <span className={styles.leyendaValor}>
              {d.valor} <em>{total ? Math.round((d.valor / total) * 100) : 0}%</em>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BarrasHorizontales({ datos, color = PALETA[0], altoFila = 34, anchoEtiqueta = 132 }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, datos.length * altoFila + 24)}>
      <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} stroke={COLOR_REJILLA} strokeDasharray="3 4" />
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="nombre"
          width={anchoEtiqueta}
          tick={ejeTick}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <Tooltip content={<TooltipCaja />} cursor={{ fill: 'rgba(14,107,59,0.06)' }} />
        <Bar dataKey="valor" name="Egresados" fill={color} radius={[0, 8, 8, 0]} barSize={18}>
          <LabelList dataKey="valor" position="right" style={{ fontSize: 12, fontWeight: 700, fill: '#14231A' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function PanelIndicadores({ registros }) {
  const ind = useMemo(() => calcularIndicadores(registros), [registros])
  const de = (n) => `${n} de ${ind.total} egresados`

  return (
    <div>
      <div className={styles.kpis}>
        <Kpi icono="usuarios" tono="verde" valor={ind.total} etiqueta="Egresados registrados" detalle="Respuestas recibidas" />
        <Kpi icono="birrete" tono="lima" valor={`${ind.pctContinuaron}%`} etiqueta="Continuaron estudios superiores" detalle={de(ind.continuaron)} barra={ind.pctContinuaron} />
        <Kpi icono="libro" tono="cafe" valor={`${ind.pctUec}%`} etiqueta="Estudiaron con la UEC" detalle={de(ind.conUec)} barra={ind.pctUec} />
        <Kpi icono="maletin" tono="petroleo" valor={`${ind.pctTrabajan}%`} etiqueta="Trabajan actualmente" detalle={de(ind.trabajan)} barra={ind.pctTrabajan} />
        <Kpi icono="brote" tono="ambar" valor={`${ind.pctEmprendieron}%`} etiqueta="Han emprendido" detalle={de(ind.emprendieron)} barra={ind.pctEmprendieron} />
      </div>

      <div className={styles.grid}>
        <Tarjeta titulo="Egresados por municipio" subtitulo="Municipio donde terminaron el bachillerato (top 10)" span="col7" vacio={!ind.porMunicipio.length}>
          <BarrasHorizontales datos={ind.porMunicipio} />
        </Tarjeta>

        <Tarjeta titulo="Sector laboral" subtitulo="Donde trabajan o han trabajado" span="col5" vacio={!ind.sectores.length}>
          <Dona datos={ind.sectores} />
        </Tarjeta>

        <Tarjeta titulo="Continuidad educativa" subtitulo="Quiénes siguieron estudiando" span="col7" vacio={!ind.continuidad.length}>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={ind.continuidad} margin={{ top: 12, right: 8, bottom: 0, left: -18 }} barGap={6}>
              <CartesianGrid vertical={false} stroke={COLOR_REJILLA} strokeDasharray="3 4" />
              <XAxis dataKey="nombre" tick={ejeTick} tickLine={false} axisLine={false} />
              <YAxis tick={ejeTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<TooltipCaja />} cursor={{ fill: 'rgba(14,107,59,0.06)' }} />
              <Bar dataKey="Sí" fill={COLOR_SI} radius={[8, 8, 0, 0]} maxBarSize={36} />
              <Bar dataKey="No" fill={COLOR_NO} radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
          <ul className={`${styles.leyenda} ${styles.leyendaFila}`}>
            <li><span className={styles.leyendaPunto} style={{ background: COLOR_SI }} />Sí</li>
            <li><span className={styles.leyendaPunto} style={{ background: COLOR_NO }} />No</li>
          </ul>
        </Tarjeta>

        <Tarjeta titulo="Tipo de emprendimiento" subtitulo="Proyectos propios de los egresados" span="col5" vacio={!ind.emprendimiento.length}>
          <Dona datos={ind.emprendimiento} />
        </Tarjeta>

        <Tarjeta titulo="¿Recomendarían el modelo?" subtitulo="A otros jóvenes del campo" span="col5" vacio={!ind.recomendaria.length}>
          <Dona datos={ind.recomendaria} />
        </Tarjeta>

        <Tarjeta titulo="Egresados por año de graduación" subtitulo="Año de grado del bachillerato" span="col7" vacio={!ind.porAnio.length}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ind.porAnio} margin={{ top: 14, right: 14, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="gradAnio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8DC63F" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#8DC63F" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={COLOR_REJILLA} strokeDasharray="3 4" />
              <XAxis dataKey="anio" tick={ejeTick} tickLine={false} axisLine={false} />
              <YAxis tick={ejeTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<TooltipCaja />} />
              <Area
                type="monotone"
                dataKey="valor"
                name="Egresados"
                stroke="#0E6B3B"
                strokeWidth={2.5}
                fill="url(#gradAnio)"
                dot={{ r: 4, fill: '#fff', stroke: '#0E6B3B', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Tarjeta>

        <Tarjeta titulo="Estrategias de Escuela Nueva que más aportaron" subtitulo="Según los propios egresados" span="col12" vacio={!ind.estrategias.length}>
          <BarrasHorizontales datos={ind.estrategias} color={PALETA[1]} altoFila={32} anchoEtiqueta={210} />
        </Tarjeta>
      </div>
    </div>
  )
}
