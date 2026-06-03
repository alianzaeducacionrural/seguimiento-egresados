import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'

const OPC_SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_TIPO_EMPRENDIMIENTO = [
  { valor: 'productivo', etiqueta: 'Productivo' },
  { valor: 'social', etiqueta: 'Social' },
  { valor: 'cultural', etiqueta: 'Cultural' },
  { valor: 'tecnologico', etiqueta: 'Tecnológico' },
  { valor: 'cientifico', etiqueta: 'Científico' },
  { valor: 'deportivo', etiqueta: 'Deportivo' },
  { valor: 'otro', etiqueta: 'Otro' },
]

export default function Seccion4({ datos = {}, onChange }) {
  return (
    <>
      <CampoRadio
        label="¿Has emprendido un negocio o proyecto propio?"
        nombre="ha_emprendido"
        valor={datos.ha_emprendido}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
      {datos.ha_emprendido === 'si' && (
        <CampoCheckbox
          label="Tipo de emprendimiento"
          nombre="tipo_emprendimiento"
          valor={datos.tipo_emprendimiento ?? []}
          onChange={onChange}
          opciones={OPC_TIPO_EMPRENDIMIENTO}
        />
      )}
      <CampoRadio
        label="¿Accediste al Fondo Rotatorio?"
        nombre="fondo_rotatorio"
        valor={datos.fondo_rotatorio}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
      <CampoRadio
        label="¿Fuiste beneficiario de la Línea de Empresarismo?"
        nombre="linea_empresarismo"
        valor={datos.linea_empresarismo}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
      <CampoRadio
        label="¿Escuela Nueva te ayudó a desarrollar habilidades para emprender?"
        nombre="habilidades_emprender"
        valor={datos.habilidades_emprender}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
    </>
  )
}
