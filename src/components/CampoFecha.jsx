export function CampoFecha({ label, nombre, valor, onChange, requerido = false }) {
  const hoy = new Date().toISOString().split('T')[0]
  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <input
        type="date"
        className="control"
        value={valor ?? ''}
        onChange={e => onChange(nombre, e.target.value)}
        max={hoy}
      />
    </div>
  )
}
