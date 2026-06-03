export function CampoTexto({ label, nombre, valor, onChange, tipo = 'text', placeholder = '', requerido = false }) {
  return (
    <div className="campo">
      <label className="etiqueta">
        {label}{requerido && <span className="asterisco">*</span>}
      </label>
      <input
        type={tipo}
        className="control"
        value={valor ?? ''}
        onChange={e => onChange(nombre, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
