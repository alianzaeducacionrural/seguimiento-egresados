import { CampoTexto } from '../components/CampoTexto'
import { CampoSelect } from '../components/CampoSelect'
import { CampoFecha } from '../components/CampoFecha'
import { CampoRadio } from '../components/CampoRadio'
import { MUNICIPIOS_CALDAS } from '../utils/municipios'

const TIPOS_DOC = ['CC', 'TI', 'CE', 'PA']
const MUNICIPIOS_OPCIONES = [...MUNICIPIOS_CALDAS, 'Otro municipio']

const OPCIONES_ZONA = [
  { valor: 'rural', etiqueta: 'Zona rural' },
  { valor: 'urbana', etiqueta: 'Zona urbana' },
]

export default function Seccion1({ datos = {}, onChange }) {
  return (
    <>
      <CampoSelect
        label="Tipo de documento"
        nombre="tipo_documento"
        valor={datos.tipo_documento}
        onChange={onChange}
        opciones={TIPOS_DOC}
        requerido
      />
      <CampoTexto
        label="Número de documento"
        nombre="numero_documento"
        valor={datos.numero_documento}
        onChange={onChange}
        tipo="tel"
        placeholder="Ej: 1234567890"
        requerido
      />
      <CampoTexto
        label="Nombre completo"
        nombre="nombre"
        valor={datos.nombre}
        onChange={onChange}
        placeholder="Nombres y apellidos completos"
        requerido
      />
      <CampoFecha
        label="Fecha de nacimiento"
        nombre="fecha_nacimiento"
        valor={datos.fecha_nacimiento}
        onChange={onChange}
        requerido
      />
      <CampoSelect
        label="Municipio de residencia"
        nombre="municipio_residencia"
        valor={datos.municipio_residencia}
        onChange={onChange}
        opciones={MUNICIPIOS_OPCIONES}
        requerido
      />
      {datos.municipio_residencia === 'Otro municipio' && (
        <CampoTexto
          label="¿Cuál municipio?"
          nombre="municipio_otro"
          valor={datos.municipio_otro}
          onChange={onChange}
          placeholder="Nombre del municipio"
          requerido
        />
      )}
      <CampoTexto
        label="Correo electrónico"
        nombre="correo"
        valor={datos.correo}
        onChange={onChange}
        tipo="email"
        placeholder="correo@ejemplo.com"
        requerido
      />
      <CampoTexto
        label="Teléfono de contacto"
        nombre="telefono"
        valor={datos.telefono}
        onChange={onChange}
        tipo="tel"
        placeholder="10 dígitos"
        requerido
      />
      <CampoRadio
        label="¿Resides en zona rural o urbana?"
        nombre="zona"
        valor={datos.zona}
        onChange={onChange}
        opciones={OPCIONES_ZONA}
        requerido
      />
    </>
  )
}
