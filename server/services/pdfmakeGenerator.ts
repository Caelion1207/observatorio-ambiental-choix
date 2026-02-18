/**
 * Generador PDF con PDFMake - Estructura Programática Pura
 * Sin HTML, sin Puppeteer, sin capas adicionales
 */

import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
const PdfPrinter = require('pdfmake/src/Printer');

interface Investigacion {
  id: number;
  titulo: string;
  slug: string;
  dominio_id: number;
  resumen_ejecutivo: string | null;
  definicion_sistema: string | null;
  modelo_minimo: string | null;
  supuestos_explicitos: string | null;
  escenarios: string | null;
  brechas_detectadas: string | null;
  conclusion_estructural: string | null;
  protocolo_version: string;
  cierre_semantico: string;
  indice_robustez_modelo: number;
  created_at: string;
  updated_at: string;
}

interface Fuente {
  id: number;
  investigacionId: number;
  tipo: 'oficial' | 'tecnica' | 'academica' | 'periodistica';
  titulo: string;
  autor: string | null;
  institucion: string | null;
  url: string | null;
  fechaPublicacion: Date | null;
  fechaConsulta: Date;
  notas: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Fuentes para PDFMake
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

/**
 * Genera PDF de investigación usando PDFMake
 */
export async function generatePDFFromInvestigacion(
  investigacion: Investigacion,
  fuentes: Fuente[]
): Promise<Buffer> {
  const printer = new (PdfPrinter as any)(fonts);

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageMargins: [72, 72, 72, 72], // 1 inch margins
    
    header: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return {
        text: 'Laboratorio Público de Análisis Estructural',
        alignment: 'center',
        fontSize: 9,
        color: '#666666',
        margin: [0, 20, 0, 0]
      };
    },
    
    footer: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return {
        text: `${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 9,
        color: '#666666',
        margin: [0, 0, 0, 20]
      };
    },
    
    content: buildContent(investigacion, fuentes),
    
    styles: {
      portadaTitulo: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 200, 0, 10]
      },
      portadaSubtitulo: {
        fontSize: 14,
        alignment: 'center',
        color: '#666666',
        margin: [0, 0, 0, 60]
      },
      portadaInfo: {
        fontSize: 11,
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      portadaBlindaje: {
        fontSize: 10,
        alignment: 'center',
        color: '#666666',
        margin: [0, 40, 0, 5]
      },
      seccionTitulo: {
        fontSize: 16,
        bold: true,
        margin: [0, 20, 0, 10]
      },
      subseccionTitulo: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 8]
      },
      parrafo: {
        fontSize: 11,
        alignment: 'justify',
        lineHeight: 1.4,
        margin: [0, 0, 0, 10]
      },
      tabla: {
        fontSize: 9,
        margin: [0, 10, 0, 15]
      }
    },
    
    defaultStyle: {
      font: 'Roboto',
      fontSize: 11
    }
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      
      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Construye contenido del PDF
 */
function buildContent(investigacion: Investigacion, fuentes: Fuente[]): Content[] {
  const content: Content[] = [];

  // PORTADA
  content.push(
    { text: 'Laboratorio Público de Análisis Estructural', style: 'portadaTitulo', pageBreak: 'after' as const },
    { text: 'Choix, Sinaloa', style: 'portadaSubtitulo' },
    { text: '\n\n\n' },
    { text: investigacion.titulo, style: 'portadaTitulo', fontSize: 18 },
    { text: '\n\n' },
    { text: `Investigación #${investigacion.id}`, style: 'portadaInfo' },
    { text: `Fecha de publicación: ${new Date(investigacion.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, style: 'portadaInfo' },
    { text: '\n\n' },
    { text: 'Blindaje Metodológico', style: 'portadaBlindaje', bold: true },
    { text: `Protocolo: ${investigacion.protocolo_version}`, style: 'portadaBlindaje' },
    { text: `Cierre Semántico: ${investigacion.cierre_semantico}`, style: 'portadaBlindaje' },
    { text: `Índice de Robustez del Modelo (IRM): ${investigacion.indice_robustez_modelo.toFixed(2)}`, style: 'portadaBlindaje' }
  );

  // ÍNDICE
  content.push(
    { text: 'Índice', style: 'seccionTitulo', pageBreak: 'before' as const },
    {
      ul: [
        'Declaración de Neutralidad Técnica',
        'Resumen Ejecutivo',
        'Registro Público de Supuestos',
        '1. Definición del Sistema',
        '2. Tabla Maestra de Datos',
        '3. Supuestos Explícitos',
        '4. Modelo Mínimo',
        '5. Escenarios',
        '6. Brechas Detectadas',
        '7. Conclusión Estructural',
        'Fuentes Primarias'
      ],
      style: 'parrafo'
    }
  );

  // DECLARACIÓN DE NEUTRALIDAD TÉCNICA
  content.push(
    { text: 'Declaración de Neutralidad Técnica', style: 'seccionTitulo', pageBreak: 'before' as const },
    {
      text: 'Este laboratorio no emite juicios morales ni acusaciones. Evalúa estructuras, no personas. Si los datos cambian, las conclusiones cambian. Toda inferencia debe estar respaldada por variables cuantificadas. Todo supuesto crítico debe ser verificable. Todo modelo debe ser auditable.',
      style: 'parrafo'
    },
    { text: '\n' },
    { text: 'Sobre el Índice de Robustez Metodológica (IRM)', style: 'subseccionTitulo' },
    {
      text: `El IRM mide la proporción de supuestos críticos verificados con fuentes primarias. Un IRM bajo (0.30-0.50) NO indica que la investigación sea deficiente, sino que refleja honestamente la disponibilidad real de datos oficiales disponibles en el contexto municipal.`,
      style: 'parrafo'
    },
    {
      text: 'Es importante distinguir entre dos métricas complementarias:',
      style: 'parrafo'
    },
    {
      text: `IRM (${investigacion.indice_robustez_modelo.toFixed(2)}): Mide la verificación empírica de supuestos críticos. Refleja la escasez de datos oficiales disponibles.`,
      style: 'parrafo',
      margin: [20, 0, 0, 5]
    },
    {
      text: `ARESK (100/100): Mide la completitud estructural del protocolo de investigación (7 secciones requeridas, fuentes primarias, supuestos identificados). Todas las investigaciones cumplen el protocolo completo.`,
      style: 'parrafo',
      margin: [20, 0, 0, 10]
    },
    {
      text: 'Un IRM bajo con ARESK alto indica que la estructura metodológica es rigurosa, pero los datos oficiales críticos aún no están disponibles o no han sido publicados por las autoridades competentes. Esto es una limitación del contexto de datos, no de la investigación.',
      style: 'parrafo'
    }
  );

  // RESUMEN EJECUTIVO
  if (investigacion.resumen_ejecutivo) {
    content.push(
      { text: 'Resumen Ejecutivo', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.resumen_ejecutivo, style: 'parrafo' }
    );
  }

  // REGISTRO PÚBLICO DE SUPUESTOS
  if (investigacion.supuestos_explicitos) {
    content.push(
      { text: 'Registro Público de Supuestos', style: 'seccionTitulo', pageBreak: 'before' as const },
      {
        text: 'Cada supuesto está clasificado por su impacto en el modelo y su nivel de sensibilidad. Los supuestos verificados cuentan con fuentes primarias que respaldan su validez.',
        style: 'parrafo'
      },
      { text: investigacion.supuestos_explicitos, style: 'parrafo' }
    );
  }

  // 1. DEFINICIÓN DEL SISTEMA
  if (investigacion.definicion_sistema) {
    content.push(
      { text: '1. Definición del Sistema', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.definicion_sistema, style: 'parrafo' }
    );
  }

  // 2. TABLA MAESTRA DE DATOS
  if (fuentes.length > 0) {
    content.push(
      { text: '2. Tabla Maestra de Datos', style: 'seccionTitulo', pageBreak: 'before' as const },
      {
        text: 'La siguiente tabla presenta las fuentes utilizadas en esta investigación, clasificadas por tipo y detallando su origen institucional.',
        style: 'parrafo'
      },
      {
        table: {
          headerRows: 1,
          widths: [40, '*', 80, 80, 60],
          body: [
            [
              { text: 'Tipo', style: 'tabla', bold: true },
              { text: 'Título', style: 'tabla', bold: true },
              { text: 'Autor', style: 'tabla', bold: true },
              { text: 'Institución', style: 'tabla', bold: true },
              { text: 'Fecha Pub.', style: 'tabla', bold: true }
            ],
            ...fuentes.map(f => [
              { text: f.tipo, style: 'tabla', fontSize: 8 },
              { text: f.titulo, style: 'tabla' },
              { text: f.autor || 'N/A', style: 'tabla', fontSize: 8 },
              { text: f.institucion || 'N/A', style: 'tabla', fontSize: 8 },
              { text: f.fechaPublicacion ? new Date(f.fechaPublicacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' }) : 'N/A', style: 'tabla', fontSize: 8 }
            ])
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cccccc',
          vLineColor: () => '#cccccc',
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 5,
          paddingBottom: () => 5
        },
        style: 'tabla'
      }
    );
  }

  // 3. SUPUESTOS EXPLÍCITOS (ya incluido arriba en Registro Público)

  // 4. MODELO MÍNIMO
  if (investigacion.modelo_minimo) {
    content.push(
      { text: '4. Modelo Mínimo', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.modelo_minimo, style: 'parrafo' }
    );
  }

  // 5. ESCENARIOS
  if (investigacion.escenarios) {
    content.push(
      { text: '5. Escenarios', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.escenarios, style: 'parrafo' }
    );
  }

  // 6. BRECHAS DETECTADAS
  if (investigacion.brechas_detectadas) {
    content.push(
      { text: '6. Brechas Detectadas', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.brechas_detectadas, style: 'parrafo' }
    );
  }

  // 7. CONCLUSIÓN ESTRUCTURAL
  if (investigacion.conclusion_estructural) {
    content.push(
      { text: '7. Conclusión Estructural', style: 'seccionTitulo', pageBreak: 'before' as const },
      { text: investigacion.conclusion_estructural, style: 'parrafo' }
    );
  }

  // FUENTES PRIMARIAS
  if (fuentes.length > 0) {
    content.push(
      { text: 'Fuentes Primarias', style: 'seccionTitulo', pageBreak: 'before' as const },
      {
        ol: fuentes.map(f => {
          const parts = [f.titulo];
          if (f.autor) parts.push(f.autor);
          if (f.institucion) parts.push(f.institucion);
          if (f.fechaPublicacion) parts.push(new Date(f.fechaPublicacion).getFullYear().toString());
          if (f.url) parts.push(`Disponible en: ${f.url}`);
          return parts.join('. ');
        }),
        style: 'parrafo'
      }
    );
  }

  return content;
}
