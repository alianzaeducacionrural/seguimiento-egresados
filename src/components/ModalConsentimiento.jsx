import styles from './ModalConsentimiento.module.css'

export default function ModalConsentimiento({ onCerrar }) {
  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div className={styles.caja} onClick={e => e.stopPropagation()}>
        <div className={styles.encabezado}>
          <h2 className={styles.titulo}>Autorización de Tratamiento de Datos Personales</h2>
          <button className={styles.btnCerrar} onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className={styles.contenido}>
          <p>
            De conformidad con la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos
            Personales) y el Decreto 1377 de 2013, el titular del presente formulario autoriza
            de manera libre, expresa e informada al <strong>Comité de Cafeteros de Caldas</strong>,
            identificado con NIT 890.800.963-3, con domicilio en Manizales, Caldas, Colombia,
            para recolectar, almacenar, usar, circular, suprimir y en general tratar los datos
            personales suministrados en este formulario.
          </p>
          <h3>Finalidades del tratamiento</h3>
          <ul>
            <li>Realizar el seguimiento académico, laboral y social de los egresados del programa
            <em> La Universidad en el Campo</em> del Modelo de Educación Rural con Escuela Nueva.</li>
            <li>Generar informes estadísticos, análisis de impacto y reportes institucionales
            del programa de educación rural en el departamento de Caldas.</li>
            <li>Compartir la información con entidades aliadas del programa (Fundación Escuela
            Nueva Volvamos a la Gente, universidades vinculadas) exclusivamente para fines
            académicos e institucionales.</li>
            <li>Comunicar información relacionada con el programa, convocatorias, oportunidades
            educativas y actividades del Comité de Cafeteros de Caldas.</li>
          </ul>
          <h3>Derechos del titular</h3>
          <p>
            Como titular de los datos personales, usted tiene derecho a conocer, actualizar,
            rectificar y suprimir sus datos, así como a revocar la presente autorización. Para
            ejercer estos derechos puede dirigirse al Comité de Cafeteros de Caldas a través de
            sus canales oficiales de atención.
          </p>
          <h3>Confidencialidad</h3>
          <p>
            Los datos serán tratados con estricta confidencialidad. No serán vendidos,
            comercializados ni cedidos a terceros con fines distintos a los aquí descritos.
            La información se almacenará en sistemas seguros y solo el personal autorizado
            del Comité de Cafeteros de Caldas tendrá acceso a ella.
          </p>
          <p className={styles.nota}>
            Al marcar la casilla de autorización en el formulario, usted manifiesta que ha leído,
            comprendido y aceptado los términos de este tratamiento de datos personales.
          </p>
        </div>
        <div className={styles.pie}>
          <button className={styles.btnAceptar} onClick={onCerrar}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
