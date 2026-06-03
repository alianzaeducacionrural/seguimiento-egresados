import { CampoSelect } from '../components/CampoSelect'
import { CampoTexto } from '../components/CampoTexto'
import { CampoRadio } from '../components/CampoRadio'
import { CampoCheckbox } from '../components/CampoCheckbox'
import { MUNICIPIOS_CALDAS } from '../utils/municipios'
import styles from './Seccion.module.css'

const anioActual = new Date().getFullYear()
const ANIOS = Array.from({ length: anioActual - 2009 }, (_, i) => String(anioActual - i))

const OPC_SI_NO = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
]

const OPC_RAZONES_NO = [
  { valor: 'recursos', etiqueta: 'Falta de recursos' },
  { valor: 'distancia', etiqueta: 'Distancia / acceso' },
  { valor: 'trabajo', etiqueta: 'Trabajo o familia' },
  { valor: 'otro', etiqueta: 'Otro' },
]

const OPC_NIVEL_UEC = [
  { valor: 'tecnica', etiqueta: 'Técnica profesional' },
  { valor: 'tecnologica', etiqueta: 'Tecnológica profesional' },
]

const OPC_NIVEL_POSTGRADO = [
  { valor: 'tecnologica', etiqueta: 'Tecnológica' },
  { valor: 'universitaria', etiqueta: 'Universitaria' },
  { valor: 'posgrado', etiqueta: 'Posgrado' },
]

export default function Seccion2({ datos = {}, onChange, listas }) {
  const iesPorMunicipio = listas?.instituciones?.[datos.municipio_bachillerato] ?? []
  const universidades = listas?.universidades ?? []

  function onMunicipioBachillerato(nombre, valor) {
    onChange('municipio_bachillerato', valor)
    if (datos.ie_bachillerato) onChange('ie_bachillerato', '')
  }

  return (
    <>
      {/* ── A. Educación media ── */}
      <div className={styles.grupo}>
        <p className={styles.grupoTitulo}>A. Educación media</p>

        <CampoSelect
          label="Municipio donde terminaste el bachillerato"
          nombre="municipio_bachillerato"
          valor={datos.municipio_bachillerato}
          onChange={onMunicipioBachillerato}
          opciones={MUNICIPIOS_CALDAS}
          requerido
        />
        <CampoSelect
          label="Institución educativa donde te graduaste"
          nombre="ie_bachillerato"
          valor={datos.ie_bachillerato}
          onChange={onChange}
          opciones={iesPorMunicipio}
          disabled={!datos.municipio_bachillerato}
          requerido
        />
        <CampoSelect
          label="Año de graduación de bachillerato"
          nombre="anio_graduacion_media"
          valor={datos.anio_graduacion_media}
          onChange={onChange}
          opciones={ANIOS}
          requerido
        />
        <CampoRadio
          label="¿Continuaste con estudios superiores después del bachillerato?"
          nombre="continuo_superior"
          valor={datos.continuo_superior}
          onChange={onChange}
          opciones={OPC_SI_NO}
          requerido
        />
        {datos.continuo_superior === 'no' && (
          <CampoCheckbox
            label="¿Cuál fue la razón principal para no continuar?"
            nombre="razon_no_continuo"
            valor={datos.razon_no_continuo ?? []}
            onChange={onChange}
            opciones={OPC_RAZONES_NO}
          />
        )}
      </div>

      <hr className={styles.separador} />

      {/* ── B. Universidad en el Campo ── */}
      <div className={styles.grupo}>
        <p className={styles.grupoTitulo}>B. Universidad en el Campo</p>

        <CampoRadio
          label="¿Cursaste estudios con La Universidad en el Campo (UEC)?"
          nombre="estudio_uec"
          valor={datos.estudio_uec}
          onChange={onChange}
          opciones={OPC_SI_NO}
          requerido
        />

        {datos.estudio_uec === 'si' && (
          <>
            <CampoCheckbox
              label="Nivel que cursaste"
              nombre="nivel_uec"
              valor={datos.nivel_uec ?? []}
              onChange={onChange}
              opciones={OPC_NIVEL_UEC}
            />
            <CampoTexto
              label="Institución donde cursaste el programa UEC"
              nombre="ie_programa_uec"
              valor={datos.ie_programa_uec}
              onChange={onChange}
              placeholder="Nombre de la institución"
              requerido
            />
            <CampoTexto
              label="Nombre del programa"
              nombre="nombre_programa_uec"
              valor={datos.nombre_programa_uec}
              onChange={onChange}
              placeholder="Ej: Tecnología en Gestión Agropecuaria"
              requerido
            />
            <CampoSelect
              label="Universidad que avaló el programa"
              nombre="universidad_uec"
              valor={datos.universidad_uec}
              onChange={onChange}
              opciones={universidades}
              requerido
            />
            <CampoSelect
              label="Año de graduación UEC"
              nombre="anio_grad_uec"
              valor={datos.anio_grad_uec}
              onChange={onChange}
              opciones={ANIOS}
              requerido
            />
            <CampoRadio
              label="¿Continuaste estudios después de graduarte del UEC?"
              nombre="continuo_postgrado"
              valor={datos.continuo_postgrado}
              onChange={onChange}
              opciones={OPC_SI_NO}
            />
            {datos.continuo_postgrado === 'si' && (
              <>
                <CampoRadio
                  label="Nivel de estudios posteriores"
                  nombre="nivel_postgrado"
                  valor={datos.nivel_postgrado}
                  onChange={onChange}
                  opciones={OPC_NIVEL_POSTGRADO}
                />
                <CampoTexto
                  label="Nombre de la institución"
                  nombre="institucion_postgrado"
                  valor={datos.institucion_postgrado}
                  onChange={onChange}
                  placeholder="Nombre de la universidad o institución"
                />
                <CampoTexto
                  label="Programa o carrera"
                  nombre="programa_postgrado"
                  valor={datos.programa_postgrado}
                  onChange={onChange}
                  placeholder="Nombre del programa"
                />
              </>
            )}
            {datos.continuo_postgrado === 'no' && (
              <CampoCheckbox
                label="¿Por qué no continuaste estudios después del UEC?"
                nombre="razon_no_postgrado"
                valor={datos.razon_no_postgrado ?? []}
                onChange={onChange}
                opciones={OPC_RAZONES_NO}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
