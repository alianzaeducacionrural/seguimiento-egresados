import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'

const OPC_SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_RAZON_EMPALME = [
  { valor: 'desarrollo_rural',       etiqueta: 'Desarrollo rural' },
  { valor: 'tradicion_familiar',     etiqueta: 'Tradición familiar' },
  { valor: 'iniciativas_comunitarias', etiqueta: 'Iniciativas comunitarias' },
  { valor: 'otro',                   etiqueta: 'Otro' },
]

export default function Seccion6({ datos = {}, onChange }) {
  return (
    <>
      <CampoRadio
        label="¿Te consideras parte del empalme generacional del campo colombiano?"
        nombre="empalme_generacional"
        valor={datos.empalme_generacional}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
      {datos.empalme_generacional === 'si' && (
        <CampoCheckbox
          label="¿Por qué te consideras parte del empalme generacional?"
          nombre="razon_empalme"
          valor={datos.razon_empalme ?? []}
          onChange={onChange}
          opciones={OPC_RAZON_EMPALME}
        />
      )}
    </>
  )
}
