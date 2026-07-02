import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'

const OPC_SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_AREA_PPPS = [
  { valor: 'agricultura',              etiqueta: 'Agricultura' },
  { valor: 'ganaderia',                etiqueta: 'Ganadería' },
  { valor: 'transformacion_alimentos', etiqueta: 'Transformación de alimentos' },
  { valor: 'artesanias',               etiqueta: 'Artesanías' },
  { valor: 'servicios',                etiqueta: 'Servicios' },
  { valor: 'otro',                     etiqueta: 'Otro' },
]

export default function Seccion5({ datos = {}, onChange }) {
  return (
    <>
      <CampoRadio
        label="¿Implementaste algún Proyecto Pedagógico Productivo Sustentable (PPPS)?"
        nombre="implemento_ppps"
        valor={datos.implemento_ppps}
        onChange={onChange}
        opciones={OPC_SI_NO}
        requerido
      />
      {datos.implemento_ppps === 'si' && (
        <>
          <CampoCheckbox
            label="¿En qué área implementaste el PPPS?"
            nombre="area_ppps"
            valor={datos.area_ppps ?? []}
            onChange={onChange}
            opciones={OPC_AREA_PPPS}
          />
          <CampoRadio
            label="¿Sigues aplicando esos conocimientos actualmente?"
            nombre="aplica_conocimientos"
            valor={datos.aplica_conocimientos}
            onChange={onChange}
            opciones={OPC_SI_NO}
            requerido
          />
        </>
      )}
    </>
  )
}
