// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────

const HOJAS = {
  RESPUESTAS:    'respuestas',
  INSTITUCIONES: 'instituciones',
  UNIVERSIDADES: 'universidades',
  CONFIG:        'config',
};

const COL_IE = {
  ID:         1,
  MUNICIPIO:  2,
  NOMBRE:     3,
  TOKEN:      4,
  URL:        5,
};

// ─────────────────────────────────────────────────────────────
// ENTRADA PRINCIPAL — Router HTTP
// ─────────────────────────────────────────────────────────────

function doGet(e) {
  const action = e.parameter.action || '';
  const token  = e.parameter.token  || '';
  try {
    if (action === 'listas')    return responder(getListas());
    if (action === 'registros') return responder(getRegistros(token));
    return responder({ ok: false, error: 'Acción no reconocida' });
  } catch (err) {
    return responder({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    return responder(guardarRespuesta(datos));
  } catch (err) {
    return responder({ ok: false, error: err.message });
  }
}

function responder(datos) {
  return ContentService
    .createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────
// GET listas — municipios, instituciones y universidades
// ─────────────────────────────────────────────────────────────

function getListas() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const hIE  = ss.getSheetByName(HOJAS.INSTITUCIONES);
  const hUni = ss.getSheetByName(HOJAS.UNIVERSIDADES);

  const filasIE = hIE.getRange(2, 1, Math.max(hIE.getLastRow() - 1, 1), 3).getValues();
  const municipiosSet = new Set();
  const instituciones = {};

  filasIE.forEach(fila => {
    const municipio = String(fila[1]).trim();
    const nombre    = String(fila[2]).trim();
    if (!municipio || !nombre) return;
    municipiosSet.add(municipio);
    if (!instituciones[municipio]) instituciones[municipio] = [];
    instituciones[municipio].push(nombre);
  });

  const municipios = Array.from(municipiosSet).sort();

  const filasUni = hUni.getRange(2, 1, Math.max(hUni.getLastRow() - 1, 1), 1).getValues();
  const universidades = filasUni
    .map(f => String(f[0]).trim())
    .filter(u => u !== '');

  return { ok: true, municipios, instituciones, universidades };
}

// ─────────────────────────────────────────────────────────────
// GET registros — todos o filtrados por token
// ─────────────────────────────────────────────────────────────

function getRegistros(token) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const hRes = ss.getSheetByName(HOJAS.RESPUESTAS);
  const hIE  = ss.getSheetByName(HOJAS.INSTITUCIONES);

  let institucion = null;
  let municipio   = null;

  if (token) {
    const filasIE = hIE.getRange(2, 1, Math.max(hIE.getLastRow() - 1, 1), 5).getValues();
    const fila    = filasIE.find(f => String(f[COL_IE.TOKEN - 1]).trim() === token);
    if (!fila) return { ok: false, error: 'Token no válido' };
    institucion = String(fila[COL_IE.NOMBRE - 1]).trim();
    municipio   = String(fila[COL_IE.MUNICIPIO - 1]).trim();
  }

  const lastRow = hRes.getLastRow();
  if (lastRow < 2) return { ok: true, institucion, municipio, total: 0, registros: [] };

  const encabezados = hRes.getRange(1, 1, 1, hRes.getLastColumn()).getValues()[0];
  const filas       = hRes.getRange(2, 1, lastRow - 1, hRes.getLastColumn()).getValues();

  let registros = filas.map(fila => {
    const obj = {};
    encabezados.forEach((col, i) => { obj[col] = fila[i]; });
    return obj;
  });

  if (institucion) {
    registros = registros.filter(r =>
      String(r['s2_ie_bachillerato']).trim() === institucion &&
      String(r['s2_municipio_bachillerato']).trim() === municipio
    );
  }

  return { ok: true, institucion, municipio, total: registros.length, registros };
}

// ─────────────────────────────────────────────────────────────
// POST — guardar respuesta del formulario
// ─────────────────────────────────────────────────────────────

function guardarRespuesta(datos) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const hRes = ss.getSheetByName(HOJAS.RESPUESTAS);

  if (hRes.getLastRow() === 0) hRes.appendRow(getEncabezados());

  const s1 = datos.s1 || {};
  const s2 = datos.s2 || {};
  const s3 = datos.s3 || {};
  const s4 = datos.s4 || {};
  const s5 = datos.s5 || {};
  const s6 = datos.s6 || {};
  const s7 = datos.s7 || {};
  const s8 = datos.s8 || {};

  hRes.appendRow([
    datos.timestamp || new Date().toISOString(),
    datos.version   || '1.0',
    s1.tipo_documento       || '', s1.numero_documento    || '',
    s1.nombre               || '', s1.fecha_nacimiento    || '',
    s1.municipio_residencia || '', s1.municipio_otro      || '',
    s1.correo               || '', s1.telefono            || '', s1.zona || '',
    s2.municipio_bachillerato  || '', s2.ie_bachillerato       || '',
    s2.anio_graduacion_media   || '', s2.continuo_superior     || '',
    aplanar(s2.razon_no_continuo),
    s2.estudio_uec             || '', aplanar(s2.nivel_uec),
    s2.ie_programa_uec         || '', s2.nombre_programa_uec   || '',
    s2.universidad_uec         || '', s2.anio_grad_uec          || '',
    s2.continuo_postgrado      || '', s2.nivel_postgrado        || '',
    s2.institucion_postgrado   || '', s2.programa_postgrado     || '',
    aplanar(s2.razon_no_postgrado),
    s3.trabaja              || '', s3.ha_trabajado         || '',
    s3.linea_insercion      || '', s3.empleo_relacionado   || '',
    aplanar(s3.sector),    s3.tipo_contrato        || '',
    s3.formacion_contribuyo || '',
    s4.ha_emprendido         || '', aplanar(s4.tipo_emprendimiento),
    s4.fondo_rotatorio       || '', s4.linea_empresarismo   || '',
    s4.habilidades_emprender || '',
    s5.implemento_ppps       || '', aplanar(s5.area_ppps),
    s5.aplica_conocimientos  || '',
    s6.empalme_generacional  || '', aplanar(s6.razon_empalme),
    aplanar(s7.estrategias_escuela_nueva),
    s7.aspectos_mejorar      || '', s7.recomendaria          || '',
    s7.comentarios_adicionales || '',
    s8.contacto_telefono     || '', s8.contacto_correo       || '',
    s8.autorizacion          || '',
  ]);

  return { ok: true, mensaje: 'Respuesta registrada correctamente' };
}

function getEncabezados() {
  return [
    'timestamp','version',
    's1_tipo_documento','s1_numero_documento','s1_nombre','s1_fecha_nacimiento',
    's1_municipio_residencia','s1_municipio_otro','s1_correo','s1_telefono','s1_zona',
    's2_municipio_bachillerato','s2_ie_bachillerato','s2_anio_graduacion_media',
    's2_continuo_superior','s2_razon_no_continuo',
    's2_estudio_uec','s2_nivel_uec','s2_ie_programa_uec','s2_nombre_programa_uec',
    's2_universidad_uec','s2_anio_grad_uec',
    's2_continuo_postgrado','s2_nivel_postgrado','s2_institucion_postgrado',
    's2_programa_postgrado','s2_razon_no_postgrado',
    's3_trabaja','s3_ha_trabajado','s3_linea_insercion','s3_empleo_relacionado',
    's3_sector','s3_tipo_contrato','s3_formacion_contribuyo',
    's4_ha_emprendido','s4_tipo_emprendimiento','s4_fondo_rotatorio',
    's4_linea_empresarismo','s4_habilidades_emprender',
    's5_implemento_ppps','s5_area_ppps','s5_aplica_conocimientos',
    's6_empalme_generacional','s6_razon_empalme',
    's7_estrategias_escuela_nueva','s7_aspectos_mejorar','s7_recomendaria',
    's7_comentarios_adicionales',
    's8_contacto_telefono','s8_contacto_correo','s8_autorizacion',
  ];
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN MANUAL — generarTokensFaltantes()
// Ejecutar desde el editor de GAS cuando se agreguen
// instituciones nuevas sin id, token y url.
// ─────────────────────────────────────────────────────────────

function generarTokensFaltantes() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const hIE  = ss.getSheetByName(HOJAS.INSTITUCIONES);
  const hCfg = ss.getSheetByName(HOJAS.CONFIG);

  const filasCfg = hCfg.getDataRange().getValues();
  let dominio = '';
  filasCfg.forEach(f => {
    if (String(f[0]).trim() === 'dominio_github_pages') dominio = String(f[1]).trim();
  });

  if (!dominio) {
    SpreadsheetApp.getUi().alert('Falta dominio_github_pages en la pestaña config.');
    return;
  }

  const lastRow = hIE.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No hay instituciones en la pestaña instituciones.');
    return;
  }

  const filas = hIE.getRange(2, 1, lastRow - 1, 5).getValues();
  const tokensExistentes = new Set(
    filas.map(f => String(f[COL_IE.TOKEN - 1]).trim()).filter(t => t !== '')
  );

  let ultimoId = 0;
  filas.forEach(f => {
    const id = parseInt(f[COL_IE.ID - 1]);
    if (!isNaN(id) && id > ultimoId) ultimoId = id;
  });

  let procesadas = 0;
  filas.forEach((fila, i) => {
    const municipio = String(fila[COL_IE.MUNICIPIO - 1]).trim();
    const nombre    = String(fila[COL_IE.NOMBRE - 1]).trim();
    const idActual  = String(fila[COL_IE.ID - 1]).trim();
    if (!municipio || !nombre || idActual !== '') return;

    ultimoId++;
    const nuevoToken = generarToken(tokensExistentes);
    tokensExistentes.add(nuevoToken);
    const filaSheet = i + 2;

    hIE.getRange(filaSheet, COL_IE.ID).setValue(ultimoId);
    hIE.getRange(filaSheet, COL_IE.TOKEN).setValue(nuevoToken);
    hIE.getRange(filaSheet, COL_IE.URL).setValue(
      `${dominio}/admin/institucion?token=${nuevoToken}`
    );
    procesadas++;
  });

  SpreadsheetApp.getUi().alert(
    procesadas > 0
      ? `✓ Se generaron tokens para ${procesadas} institución(es).`
      : 'No hay instituciones nuevas sin token.'
  );
}

// ─────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────

function generarToken(existentes) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token;
  do {
    token = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  } while (existentes.has(token));
  return token;
}

function aplanar(valor) {
  if (Array.isArray(valor)) return valor.join(', ');
  if (valor === null || valor === undefined) return '';
  return String(valor);
}
