import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'
import { CampoTextarea } from '../components/CampoTextarea'

const OPC_ESTRATEGIAS = [
  { valor: 'trabajo_equipo',          etiqueta: 'Trabajo en equipo' },
  { valor: 'uso_guias',               etiqueta: 'Uso de guías' },
  { valor: 'actividades_conjunto',    etiqueta: 'Actividades de conjunto' },
  { valor: 'gobierno_estudiantil',    etiqueta: 'Gobierno Estudiantil' },
  { valor: 'escuela_cafe',            etiqueta: 'Escuela y Café' },
  { valor: 'seguridad_alimentaria',   etiqueta: 'Escuela y Seguridad Alimentaria' },
  { valor: 'escuela_virtual',         etiqueta: 'Escuela Virtual' },
  { valor: 'roles_trabajo',           etiqueta: 'Roles de trabajo' },
  { valor: 'emprendimiento',          etiqueta: 'Emprendimiento' },
  { valor: 'empresarismo',            etiqueta: 'Empresarismo' },
  { valor: 'otro',                    etiqueta: 'Otro' },
]

const OPC_RECOMENDARIA = [
  { valor: 'si',      etiqueta: 'Sí' },
  { valor: 'no',      etiqueta: 'No' },
  { valor: 'tal_vez', etiqueta: 'Tal vez' },
]

export default function Seccion7({ datos = {}, onChange }) {
  return (
    <>
      <CampoCheckbox
        label="¿Qué estrategias de Escuela Nueva han contribuido más a tu desarrollo?"
        nombre="estrategias_escuela_nueva"
        valor={datos.estrategias_escuela_nueva ?? []}
        onChange={onChange}
        opciones={OPC_ESTRATEGIAS}
      />
      <CampoTextarea
        label="¿Qué aspectos del programa deberían mejorarse?"
        nombre="aspectos_mejorar"
        valor={datos.aspectos_mejorar ?? ''}
        onChange={onChange}
        requerido
        filas={4}
      />
      <CampoRadio
        label="¿Recomendarías el modelo de Escuela Nueva a otros jóvenes?"
        nombre="recomendaria"
        valor={datos.recomendaria}
        onChange={onChange}
        opciones={OPC_RECOMENDARIA}
        requerido
      />
      <CampoTextarea
        label="¿Hay algo más que quisieras compartir con nosotros?"
        nombre="comentarios_adicionales"
        valor={datos.comentarios_adicionales ?? ''}
        onChange={onChange}
        filas={3}
      />
    </>
  )
}
