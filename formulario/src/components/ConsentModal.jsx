import styles from './ConsentModal.module.css'

const TEXTO_COMPLETO = `AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES

En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, el Comité de Cafeteros de Caldas — Federación Nacional de Cafeteros, con NIT 800.149.925-7, con domicilio en Manizales, Caldas, actúa como Responsable del Tratamiento de sus datos personales.

FINALIDAD DEL TRATAMIENTO
Los datos recolectados mediante este formulario serán utilizados exclusivamente para:
• Realizar seguimiento a los egresados del programa La Universidad en el Campo.
• Generar estadísticas e informes sobre el impacto del Modelo de Educación Rural con Escuela Nueva.
• Mejorar los programas educativos y de apoyo ofrecidos por el Comité.

DATOS RECOLECTADOS
Información de identificación, contacto, trayectoria educativa, situación laboral, emprendimiento y retroalimentación sobre el modelo pedagógico.

DERECHOS DEL TITULAR
Usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales, así como a revocar la presente autorización, dirigiéndose al correo institucional del Comité de Cafeteros de Caldas.

VIGENCIA
La presente autorización tiene vigencia indefinida, salvo que el titular la revoque expresamente.

Al marcar la casilla de aceptación, usted declara que ha leído, comprendido y acepta el tratamiento de sus datos personales en los términos aquí descritos.`

export default function ConsentModal({ onCerrar }) {
  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.titulo}>Autorización de tratamiento de datos</h2>
        <div className={styles.cuerpo}>
          <pre className={styles.texto}>{TEXTO_COMPLETO}</pre>
        </div>
        <button className={styles.boton} onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
