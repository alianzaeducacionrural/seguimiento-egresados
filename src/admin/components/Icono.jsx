const RUTAS = {
  resumen: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  egresados: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18 14.8c1.9.7 3.2 2.5 3.5 5.2" /></>,
  instituciones: <><path d="M3 10.5 12 5l9 5.5" /><path d="M5 10.5V19M19 10.5V19M9 19v-5h6v5M3 19h18" /></>,
  refrescar: <><path d="M20 11a8 8 0 0 0-14.6-4.4L3 9" /><path d="M3 4v5h5" /><path d="M4 13a8 8 0 0 0 14.6 4.4L21 15" /><path d="M21 20v-5h-5" /></>,
  descargar: <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
  buscar: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  cerrar: <><path d="m6 6 12 12M18 6 6 18" /></>,
  volver: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  copiar: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5" /></>,
  birrete: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" /><path d="M22 9v6" /></>,
  maletin: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" /><path d="M3 13h18" /></>,
  brote: <><path d="M12 21v-9" /><path d="M12 12C12 8 9 5.5 5 5.5c0 4 2.5 6.5 7 6.5z" /><path d="M12 14c0-3.2 2.4-5.5 6-5.5 0 3.4-2.2 5.5-6 5.5z" /></>,
  libro: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /></>,
  usuarios: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-4 3.7-6 8-6s7.3 2 8 6" /></>,
  filtro: <><path d="M3 5h18l-7 8v6l-4-2v-4z" /></>,
  alerta: <><path d="M12 3 2.5 20h19z" /><path d="M12 10v4.5M12 17.5v.01" /></>,
  salir: <><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="m15 8 4 4-4 4M19 12H9" /></>,
}

export default function Icono({ nombre, size = 18, trazo = 1.8, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={trazo}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {RUTAS[nombre]}
    </svg>
  )
}
