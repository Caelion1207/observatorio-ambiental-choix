import { investigaciones } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execAsync = promisify(exec);

/**
 * Genera un documento PDF profesional para una investigación específica
 * Formato limpio, institucional, usando WeasyPrint para HTML→PDF
 */
export async function generarPDFInvestigacion(slug: string): Promise<Buffer> {
  // Obtener investigación completa
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }
  
  const investigacion = await db
    .select()
    .from(investigaciones)
    .where(eq(investigaciones.slug, slug))
    .limit(1)
    .then((rows: any[]) => rows[0]);

  if (!investigacion) {
    throw new Error(`Investigación no encontrada: ${slug}`);
  }

  // Construir HTML del documento con estilos institucionales
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${investigacion.titulo}</title>
  <style>
    @page {
      size: Letter;
      margin: 2.5cm 2cm;
      @top-right {
        content: "Observatorio Ambiental de Choix";
        font-size: 9pt;
        color: #666;
      }
      @bottom-center {
        content: counter(page);
        font-size: 9pt;
        color: #666;
      }
    }
    
    body {
      font-family: 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
    }
    
    h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    
    h2 {
      font-size: 16pt;
      font-weight: bold;
      color: #334155;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.3em;
    }
    
    h3 {
      font-size: 13pt;
      font-weight: bold;
      color: #475569;
      margin-top: 1em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    
    p {
      margin: 0.5em 0;
      text-align: justify;
    }
    
    .metadata {
      font-size: 10pt;
      color: #64748b;
      margin-bottom: 2em;
      padding: 1em;
      background-color: #f8fafc;
      border-left: 4px solid #3b82f6;
    }
    
    .metadata p {
      margin: 0.3em 0;
    }
    
    .section {
      margin-bottom: 2em;
      page-break-inside: avoid;
    }
    
    .footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #e2e8f0;
      font-size: 9pt;
      color: #64748b;
    }
    
    strong {
      font-weight: bold;
      color: #1e293b;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 10pt;
    }
    
    th, td {
      border: 1px solid #e2e8f0;
      padding: 0.5em;
      text-align: left;
    }
    
    th {
      background-color: #f1f5f9;
      font-weight: bold;
      color: #1e293b;
    }
    
    ul, ol {
      margin: 0.5em 0;
      padding-left: 2em;
    }
    
    li {
      margin: 0.3em 0;
    }
  </style>
</head>
<body>
  <h1>${investigacion.titulo}</h1>
  
  <div class="metadata">
    <p><strong>Dominio:</strong> ${investigacion.dominio}</p>
    <p><strong>Fecha de publicación:</strong> ${new Date(investigacion.fechaPublicacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p><strong>IVE (Índice de Viabilidad Estructural):</strong> ${investigacion.ive}</p>
  </div>
  
  <div class="section">
    <h2>Resumen Ejecutivo</h2>
    ${convertMarkdownToHTML(investigacion.resumen)}
  </div>
  
  <div class="section">
    <h2>1. Definición del Sistema</h2>
    ${convertMarkdownToHTML(investigacion.definicionSistema)}
  </div>
  
  <div class="section">
    <h2>2. Tabla Maestra de Datos</h2>
    ${convertMarkdownToHTML(investigacion.tablaMaestra)}
  </div>
  
  <div class="section">
    <h2>3. Supuestos Estructurales</h2>
    ${convertMarkdownToHTML(investigacion.supuestos)}
  </div>
  
  <div class="section">
    <h2>4. Modelo Mínimo</h2>
    ${convertMarkdownToHTML(investigacion.modeloMinimo)}
  </div>
  
  <div class="section">
    <h2>5. Escenarios</h2>
    ${convertMarkdownToHTML(investigacion.escenarios)}
  </div>
  
  <div class="section">
    <h2>6. Brechas Detectadas</h2>
    ${convertMarkdownToHTML(investigacion.brechasDetectadas)}
  </div>
  
  <div class="section">
    <h2>7. Conclusión Estructural</h2>
    ${convertMarkdownToHTML(investigacion.conclusion)}
  </div>
  
  ${investigacion.impactoComunitario ? `
  <div class="section">
    <h2>Impacto Comunitario</h2>
    ${convertMarkdownToHTML(investigacion.impactoComunitario)}
  </div>
  ` : ''}
  
  ${investigacion.lineasAccion ? `
  <div class="section">
    <h2>Posibles Líneas de Acción</h2>
    ${convertMarkdownToHTML(investigacion.lineasAccion)}
  </div>
  ` : ''}
  
  <div class="section">
    <h2>Fuentes Primarias</h2>
    ${convertMarkdownToHTML(investigacion.fuentesPrimarias)}
  </div>
  
  <div class="footer">
    <p><strong>Documento generado por:</strong> Observatorio Ambiental de Choix</p>
    <p><strong>Licencia:</strong> Creative Commons BY 4.0 (reutilizable con atribución)</p>
    <p><strong>URL:</strong> https://observatorio-choix.manus.space/investigaciones/${investigacion.slug}</p>
  </div>
</body>
</html>
  `;

  // Guardar HTML temporal
  const htmlPath = join(tmpdir(), `investigacion-${slug}-${Date.now()}.html`);
  const pdfPath = join(tmpdir(), `investigacion-${slug}-${Date.now()}.pdf`);
  
  await writeFile(htmlPath, html, 'utf-8');
  
  try {
    // Convertir HTML a PDF usando WeasyPrint
    await execAsync(`weasyprint ${htmlPath} ${pdfPath}`);
    
    // Leer PDF generado
    const fs = require('fs');
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Limpiar archivos temporales
    await unlink(htmlPath);
    await unlink(pdfPath);
    
    return pdfBuffer;
  } catch (error) {
    // Limpiar archivos temporales en caso de error
    try {
      await unlink(htmlPath);
      await unlink(pdfPath);
    } catch {}
    
    throw new Error(`Error al generar PDF: ${error}`);
  }
}

/**
 * Convierte Markdown básico a HTML
 * Soporta: **bold**, *italic*, listas, párrafos
 */
function convertMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown
    // Convertir **bold** a <strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Convertir *italic* a <em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Convertir listas no ordenadas
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Convertir saltos de línea dobles en párrafos
    .replace(/\n\n/g, '</p><p>')
    // Envolver en párrafo inicial
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
  
  // Envolver listas en <ul>
  html = html.replace(/(<li>[\s\S]+?<\/li>)/g, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  return html;
}
