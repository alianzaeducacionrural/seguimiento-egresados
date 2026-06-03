import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'

const OPC_TRABAJA = [
  { valor: 'tiempo_completo', etiqueta: 'Sí, tiempo completo' },
  { valor: 'medio_tiempo', etiqueta: 'Sí, medio tiempo' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_SI_NO_ENPARTE = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
  { valor: 'en_parte', etiqueta: 'En parte' },
]

const OPC_SECTOR = [
  { valor: 'agricultura', etiqueta: 'Agricultura' },
  { valor: 'industria', etiqueta: 'Industria' },
  { valor: 'servicios', etiqueta: 'Servicios' },
  { valor: 'comercio', etiqueta: 'Comercio' },
  { valor: 'educacion', etiqueta: 'Educación' },
  { valor: 'otro', etiqueta: 'Otro' },
]

const OPC_CONTRATO = [
  { valor: 'formal', etiqueta: 'Formal' },
  { valor: 'informal', etiqueta: 'Informal' },
  { valor: 'no_aplica', etiqueta: 'No aplica' },
]

export default function Seccion3({ datos = {}, onChange }) {
  const haLaborado = datos.trabaja !== 'no' || datos.ha_trabajado === 'si'

  return (
    <>
      <CampoRadio
        label="¿Actualmente trabajas?"
        nombre="trabaja"
        valor={datos.trabaja}
        onChange={onChange}
        opciones={OPC_TRABAJA}
        requerido
      />
      <CampoRadio
        label="¿Has trabajado desde que egresaste?"
        nombre="ha_trabajado"
        valor={datos.ha_trabajado}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />

      {haLaborado && (
        <>
          <CampoRadio
            label="¿Obtuviste tu empleo a través de la Línea de Inserción Laboral?"
            nombre="linea_insercion"
            valor={datos.linea_insercion}
            onChange={onChange}
            opciones={OPC_SI_NO}
          />
          <CampoRadio
            label="¿Tu empleo está relacionado con tu formación?"
            nombre="empleo_relacionado"
            valor={datos.empleo_relacionado}
            onChange={onChange}
            opciones={OPC_SI_NO}
          />
          <CampoCheckbox
            label="Sector en el que trabajas o trabajaste"
            nombre="sector"
            valor={datos.sector ?? []}
            onChange={onChange}
            opciones={OPC_SECTOR}
          />
          <CampoRadio
            label="Tipo de contrato en tu empleo más reciente"
            nombre="tipo_contrato"
            valor={datos.tipo_contrato}
            onChange={onChange}
            opciones={OPC_CONTRATO}
          />
          <CampoRadio
            label="¿Tu formación en Escuela Nueva contribuyó a obtener tu trabajo?"
            nombre="formacion_contribuyo"
            valor={datos.formacion_contribuyo}
            onChange={onChange}
            opciones={OPC_SI_NO_ENPARTE}
          />
        </>
      )}
    </>
  )
}
