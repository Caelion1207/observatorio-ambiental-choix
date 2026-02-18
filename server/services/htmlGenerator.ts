import type { Investigacion, Fuente } from '../../drizzle/schema';

interface Supuesto {
  id: string;
  supuesto: string;
  impacto: string;
  sensibilidad: string;
  verificado: boolean;
}

export function generateInvestigacionHTML(
  investigacion: Investigacion,
  fuentes: Fuente[]
): string {
  const fechaPublicacion = investigacion.fechaCierreSemantico
    ? new Date(investigacion.fechaCierreSemantico).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : investigacion.publishedAt
    ? new Date(investigacion.publishedAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const irm = investigacion.indiceRobustez ? parseFloat(investigacion.indiceRobustez) : 0;
  const estadoIRM = irm >= 0.8 ? 'Robusto' : irm >= 0.6 ? 'Moderado' : 'Débil';

  let supuestos: Supuesto[] = [];
  if (investigacion.supuestosEstructurados) {
    try {
      supuestos = JSON.parse(investigacion.supuestosEstructurados);
    } catch (e) {
      console.error('[HTML Generator] Error parsing supuestosEstructurados:', e);
    }
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${investigacion.titulo}</title>
  <style>
    @page {
      size: Letter;
      margin: 1in;
      @top-center {
        content: "Laboratorio Público de Análisis Estructural - Choix, Sinaloa";
        font-size: 8pt;
        color: #666;
      }
      @bottom-center {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8pt;
        color: #666;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }

    .cover-page {
      text-align: center;
      padding-top: 3in;
      page-break-after: always;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: bold;
      margin-bottom: 0.5in;
    }

    .cover-subtitle {
      font-size: 16pt;
      margin-bottom: 2in;
    }

    .cover-investigation-title {
      font-size: 22pt;
      font-weight: bold;
      margin-bottom: 1in;
    }

    .cover-metadata {
      font-size: 14pt;
      margin-bottom: 0.5in;
    }

    .cover-date {
      font-size: 11pt;
      margin-bottom: 1in;
    }

    .cover-blindaje {
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      background: #f9f9f9;
    }

    .cover-blindaje h3 {
      font-size: 14pt;
      margin-bottom: 10px;
      text-decoration: underline;
    }

    .cover-blindaje p {
      font-size: 10pt;
      margin-bottom: 5px;
    }

    .cover-blindaje .irm-note {
      font-size: 8pt;
      margin-top: 10px;
      font-style: italic;
      color: #555;
    }

    .toc {
      page-break-after: always;
    }

    .toc h1 {
      font-size: 18pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1in;
    }

    .toc-item {
      font-size: 10pt;
      margin-bottom: 0.3in;
      display: flex;
      justify-content: space-between;
    }

    .toc-dots {
      flex-grow: 1;
      border-bottom: 1px dotted #999;
      margin: 0 10px;
    }

    .section {
      break-inside: avoid;
      margin-bottom: 1.5em;
    }

    .section-title {
      font-size: 16pt;
      font-weight: bold;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      break-after: avoid;
    }

    .section-content {
      text-align: justify;
      margin-bottom: 1em;
    }

    .section-content p {
      margin-bottom: 0.8em;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      break-inside: avoid;
      font-size: 9pt;
    }

    table th {
      background: #f0f0f0;
      border: 1px solid #999;
      padding: 8px;
      text-align: left;
      font-weight: bold;
    }

    table td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }

    .supuesto-item {
      break-inside: avoid;
      margin-bottom: 0.7em;
    }

    .supuesto-title {
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 0.2em;
    }

    .supuesto-meta {
      font-size: 9pt;
      color: #555;
      margin-left: 1em;
    }

    .page-break {
      page-break-before: always;
    }

    .no-break {
      break-inside: avoid;
    }
  </style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover-page">
    <div class="cover-title">Laboratorio Público de Análisis Estructural</div>
    <div class="cover-subtitle">Choix, Sinaloa</div>
    
    <div class="cover-investigation-title">${investigacion.titulo}</div>
    
    <div class="cover-metadata">Investigación #${investigacion.numero}</div>
    <div class="cover-date">Fecha de publicación: ${fechaPublicacion}</div>
    
    <div class="cover-blindaje">
      <h3>Blindaje Metodológico</h3>
      <p><strong>Protocolo:</strong> v${investigacion.versionProtocolo || '1.0'}</p>
      <p><strong>Cierre Semántico:</strong> ${fechaPublicacion}</p>
      <p><strong>Índice de Robustez del Modelo (IRM):</strong> ${irm.toFixed(2)} - ${estadoIRM}</p>
      <p class="irm-note">
        El IRM mide la proporción de supuestos críticos verificados con fuentes primarias. 
        Un IRM bajo indica que la estructura metodológica está completa pero requiere verificación 
        adicional de supuestos mediante datos oficiales.
      </p>
    </div>
  </div>

  <!-- ÍNDICE -->
  <div class="toc">
    <h1>Índice</h1>
    <div class="toc-item">
      <span>Declaración de Neutralidad Técnica</span>
      <span class="toc-dots"></span>
      <span>2</span>
    </div>
    <div class="toc-item">
      <span>Sobre el Índice de Robustez Metodológica (IRM)</span>
      <span class="toc-dots"></span>
      <span>2</span>
    </div>
    <div class="toc-item">
      <span>Resumen Ejecutivo</span>
      <span class="toc-dots"></span>
      <span>3</span>
    </div>
    ${supuestos.length > 0 ? `
    <div class="toc-item">
      <span>Registro Público de Supuestos</span>
      <span class="toc-dots"></span>
      <span>4</span>
    </div>
    ` : ''}
    <div class="toc-item">
      <span>1. Definición del Sistema</span>
      <span class="toc-dots"></span>
      <span>5</span>
    </div>
    <div class="toc-item">
      <span>2. Tabla Maestra de Datos</span>
      <span class="toc-dots"></span>
      <span>6</span>
    </div>
    <div class="toc-item">
      <span>3. Supuestos Explícitos</span>
      <span class="toc-dots"></span>
      <span>7</span>
    </div>
    <div class="toc-item">
      <span>4. Modelo Mínimo</span>
      <span class="toc-dots"></span>
      <span>8</span>
    </div>
    <div class="toc-item">
      <span>5. Escenarios</span>
      <span class="toc-dots"></span>
      <span>9</span>
    </div>
    <div class="toc-item">
      <span>6. Brechas Detectadas</span>
      <span class="toc-dots"></span>
      <span>10</span>
    </div>
    <div class="toc-item">
      <span>7. Conclusión Estructural</span>
      <span class="toc-dots"></span>
      <span>11</span>
    </div>
    <div class="toc-item">
      <span>Fuentes Primarias</span>
      <span class="toc-dots"></span>
      <span>12</span>
    </div>
  </div>

  <!-- DECLARACIÓN DE NEUTRALIDAD TÉCNICA -->
  <div class="section page-break">
    <h2 class="section-title">Declaración de Neutralidad Técnica</h2>
    <div class="section-content">
      <p>
        Este laboratorio no emite juicios morales ni acusaciones. Evalúa estructuras, no personas. 
        Si los datos cambian, las conclusiones cambian. Toda inferencia debe estar respaldada por variables cuantificadas. 
        Todo supuesto crítico debe ser verificable. Todo modelo debe ser auditable.
      </p>
    </div>
  </div>

  <!-- SOBRE EL IRM -->
  <div class="section">
    <h2 class="section-title">Sobre el Índice de Robustez Metodológica (IRM)</h2>
    <div class="section-content">
      <p>
        El IRM mide la proporción de supuestos críticos verificados con fuentes primarias oficiales. 
        Un IRM bajo (0.30-0.50) NO indica que la investigación sea deficiente, sino que refleja honestamente 
        la disponibilidad real de datos oficiales verificables en el contexto municipal.
      </p>
      <p>
        Es importante distinguir entre dos métricas complementarias:
      </p>
      <p>
        <strong>IRM (0.30-0.55):</strong> Mide la verificación empírica de supuestos críticos. Refleja la escasez de datos oficiales disponibles.
      </p>
      <p>
        <strong>ARESK (100/100):</strong> Mide la completitud estructural del protocolo de investigación (7 secciones requeridas, fuentes primarias, supuestos identificados). Todas las investigaciones cumplen el protocolo completo.
      </p>
      <p>
        Un IRM bajo con ARESK alto indica que la estructura metodológica es rigurosa, pero los datos oficiales 
        necesarios para verificar supuestos críticos aún no están disponibles o no han sido publicados por las autoridades competentes. 
        Esto es una limitación del contexto de datos, no de la investigación.
      </p>
    </div>
  </div>

  <!-- RESUMEN EJECUTIVO -->
  <div class="section page-break">
    <h2 class="section-title">Resumen Ejecutivo</h2>
    <div class="section-content">
      ${formatContent(investigacion.resumenEjecutivo || '')}
    </div>
  </div>

  <!-- REGISTRO PÚBLICO DE SUPUESTOS -->
  ${supuestos.length > 0 ? `
  <div class="section page-break">
    <h2 class="section-title">Registro Público de Supuestos</h2>
    <div class="section-content">
      <p>
        Cada supuesto está clasificado por su impacto en el modelo y su nivel de sensibilidad. 
        Los supuestos verificados cuentan con fuentes primarias que respaldan su validez.
      </p>
    </div>
    ${supuestos.map((sup) => `
      <div class="supuesto-item">
        <div class="supuesto-title">${sup.id}. ${sup.supuesto}</div>
        <div class="supuesto-meta">
          Impacto: ${sup.impacto} | Sensibilidad: ${sup.sensibilidad} | Estado: ${sup.verificado ? 'Verificado' : 'Pendiente'}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- 1. DEFINICIÓN DEL SISTEMA -->
  <div class="section page-break">
    <h2 class="section-title">1. Definición del Sistema</h2>
    <div class="section-content">
      ${formatContent(investigacion.definicionSistema || '')}
    </div>
  </div>

  <!-- 2. TABLA MAESTRA DE DATOS -->
  <div class="section">
    <h2 class="section-title">2. Tabla Maestra de Datos</h2>
    <div class="section-content">
      ${formatContent(investigacion.tablaMaestra || '')}
    </div>
  </div>

  <!-- 3. SUPUESTOS EXPLÍCITOS -->
  <div class="section page-break">
    <h2 class="section-title">3. Supuestos Explícitos</h2>
    <div class="section-content">
      ${formatContent(investigacion.supuestos || '')}
    </div>
  </div>

  <!-- 4. MODELO MÍNIMO -->
  <div class="section">
    <h2 class="section-title">4. Modelo Mínimo</h2>
    <div class="section-content">
      ${formatContent(investigacion.modelo || '')}
    </div>
  </div>

  <!-- 5. ESCENARIOS -->
  <div class="section page-break">
    <h2 class="section-title">5. Escenarios</h2>
    <div class="section-content">
      ${formatContent(investigacion.escenarios || '')}
    </div>
  </div>

  <!-- 6. BRECHAS DETECTADAS -->
  <div class="section">
    <h2 class="section-title">6. Brechas Detectadas</h2>
    <div class="section-content">
      ${formatContent(investigacion.brechas || '')}
    </div>
  </div>

  <!-- 7. CONCLUSIÓN ESTRUCTURAL -->
  <div class="section page-break">
    <h2 class="section-title">7. Conclusión Estructural</h2>
    <div class="section-content">
      ${formatContent(investigacion.conclusion || '')}
    </div>
  </div>

  <!-- FUENTES PRIMARIAS -->
  <div class="section page-break">
    <h2 class="section-title">Fuentes Primarias</h2>
    <div class="section-content">
      ${fuentes.length > 0 ? `
        <ol>
          ${fuentes.map((fuente) => `
            <li>
              <strong>${fuente.titulo || 'Sin título'}</strong><br/>
              ${fuente.tipo ? `Tipo: ${fuente.tipo}<br/>` : ''}
              ${fuente.url ? `URL: <a href="${fuente.url}">${fuente.url}</a><br/>` : ''}
              ${fuente.fechaConsulta ? `Fecha de consulta: ${new Date(fuente.fechaConsulta).toLocaleDateString('es-MX')}<br/>` : ''}
            </li>
          `).join('')}
        </ol>
      ` : '<p>No hay fuentes primarias registradas.</p>'}
    </div>
  </div>

</body>
</html>
  `.trim();
}

function formatContent(content: string): string {
  if (!content) return '<p>Contenido no disponible.</p>';

  // Detectar y convertir tablas Markdown a HTML
  if (content.includes('|')) {
    return convertMarkdownTableToHTML(content);
  }

  // Convertir párrafos separados por doble salto de línea
  const paragraphs = content.split('\n\n').filter((p) => p.trim());
  return paragraphs.map((p) => `<p>${p.trim()}</p>`).join('\n');
}

function convertMarkdownTableToHTML(content: string): string {
  const lines = content.split('\n');
  const tableStart = lines.findIndex((l) => l.includes('|') && l.trim().startsWith('|'));

  if (tableStart === -1) {
    return formatContent(content);
  }

  const beforeTable = lines.slice(0, tableStart).join('\n');
  const tableLines = [];
  let tableEnd = tableStart;

  for (let i = tableStart; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.includes('|')) break;
    if (line.match(/^\|[\s\-:]+\|$/)) continue; // Skip separator row
    tableLines.push(line);
    tableEnd = i;
  }

  const afterTable = lines.slice(tableEnd + 1).join('\n');

  const rows = tableLines.map((line) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c !== '')
  );

  const headers = rows[0];
  const dataRows = rows.slice(1);

  let tableHTML = '<table><thead><tr>';
  headers.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  dataRows.forEach((row) => {
    tableHTML += '<tr>';
    row.forEach((cell) => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += '</tr>';
  });

  tableHTML += '</tbody></table>';

  return `
    ${beforeTable ? formatContent(beforeTable) : ''}
    ${tableHTML}
    ${afterTable ? formatContent(afterTable) : ''}
  `.trim();
}
