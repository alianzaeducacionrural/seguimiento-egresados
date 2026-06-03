export function CampoTextarea({ label, nombre, valor, onChange, placeholder = '', requerido = false, filas = 4 }) {
  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <textarea
        className="control"
        value={valor ?? ''}
        onChange={e => onChange(nombre, e.target.value)}
        placeholder={placeholder}
        rows={filas}
      />
    </div>
  )
}
