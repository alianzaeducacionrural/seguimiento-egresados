export function CampoSelect({ label, nombre, valor, onChange, opciones = [], requerido = false, disabled = false }) {
  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <select
        className="control"
        value={valor ?? ''}
        onChange={e => onChange(nombre, e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled hidden>— Seleccionar —</option>
        {opciones.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  )
}
