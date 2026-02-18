import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface Investigacion {
  numero: number;
  titulo: string;
  resumenEjecutivo: string;
  definicionSistema: string;
  tablaMaestra: string;
  supuestos: string;
  modelo: string;
  escenarios: string;
  brechas: string;
  conclusion: string;
  fuentes: string;
  versionProtocolo: string;
  fechaCierreSemantico: Date | null;
  indiceRobustez: string | null;
  supuestosEstructurados: string | null;
  fechaPublicacion: Date;
}

interface Supuesto {
  id: number;
  supuesto: string;
  impacto: string;
  sensibilidad: string;
  verificado: boolean;
}

export async function generarPDFInvestigacion(investigacion: Investigacion, fuentes?: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      console.log('[PDF Generator] Iniciando generación PDF para:', investigacion.titulo);
      console.log('[PDF Generator] Fuentes recibidas:', fuentes?.length || 0);
      
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: investigacion.titulo,
          Author: 'Laboratorio Público de Análisis Estructural - Choix',
          Subject: `Investigación ${investigacion.numero}: ${investigacion.titulo}`,
          Keywords: `análisis estructural, Choix, Sinaloa`,
          CreationDate: new Date()
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        console.log('[PDF Generator] PDF generado exitosamente, tamaño:', Buffer.concat(buffers).length, 'bytes');
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', (err) => {
        console.error('[PDF Generator] Error en stream PDF:', err);
        reject(err);
      });
    doc.on('error', reject);

    // Portada
    doc.fontSize(24).font('Helvetica-Bold').text('Laboratorio Público de Análisis Estructural', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('Choix, Sinaloa', { align: 'center' });
    doc.moveDown(2);
    
    doc.fontSize(20).font('Helvetica-Bold').text(investigacion.titulo, { align: 'center' });
    doc.moveDown(1);
    
    doc.fontSize(12).font('Helvetica').text(`Investigación #${investigacion.numero}`, { align: 'center' });
    doc.moveDown(1);
    
    const fechaPublicacion = new Date(investigacion.fechaPublicacion);
    doc.fontSize(10).text(`Fecha de publicación: ${fechaPublicacion.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    
    // Blindaje Metodológico
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica-Bold').text('Blindaje Metodológico', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Helvetica');
    doc.text(`Protocolo: v${investigacion.versionProtocolo || '1.0'}`);
    
    if (investigacion.fechaCierreSemantico) {
      const fechaCierre = new Date(investigacion.fechaCierreSemantico);
      doc.text(`Cierre Semántico: ${fechaCierre.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    }
    
    if (investigacion.indiceRobustez) {
      const irm = parseFloat(investigacion.indiceRobustez);
      const estado = irm >= 0.8 ? 'Robusto' : irm >= 0.6 ? 'Moderado' : 'Débil';
      doc.text(`Índice de Robustez del Modelo (IRM): ${irm.toFixed(2)} - ${estado}`);
    }
    
    doc.addPage();
    
    // Declaración de Neutralidad Técnica
    doc.fontSize(14).font('Helvetica-Bold').text('Declaración de Neutralidad Técnica', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(
      'Este laboratorio no emite juicios morales ni acusaciones. Evalúa estructuras, no personas. ' +
      'Si los datos cambian, las conclusiones cambian. Toda inferencia debe estar respaldada por variables cuantificadas. ' +
      'Todo supuesto crítico debe ser verificable. Todo modelo debe ser auditable.',
      { align: 'justify' }
    );
    
    doc.moveDown(2);
    
    // Resumen Ejecutivo
    agregarSeccion(doc, 'Resumen Ejecutivo', investigacion.resumenEjecutivo);
    
    // Registro Público de Supuestos
    if (investigacion.supuestosEstructurados) {
      try {
        const supuestos: Supuesto[] = JSON.parse(investigacion.supuestosEstructurados);
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Registro Público de Supuestos', { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(9).font('Helvetica').text(
          'Cada supuesto está clasificado por su impacto en el modelo y su nivel de sensibilidad. ' +
          'Los supuestos verificados cuentan con fuentes primarias que respaldan su validez.',
          { align: 'justify' }
        );
        doc.moveDown(1);
        
        supuestos.forEach((sup) => {
          doc.fontSize(9).font('Helvetica-Bold').text(`${sup.id}. ${sup.supuesto}`);
          doc.fontSize(8).font('Helvetica');
          doc.text(`   Impacto: ${sup.impacto} | Sensibilidad: ${sup.sensibilidad} | Estado: ${sup.verificado ? 'Verificado' : 'Pendiente'}`);
          doc.moveDown(0.5);
        });
      } catch (e) {
        console.error('Error parsing supuestosEstructurados:', e);
      }
    }
    
    // Protocolo de 7 Secciones
    doc.addPage();
    agregarSeccion(doc, '1. Definición del Sistema', investigacion.definicionSistema);
    
    doc.addPage();
    agregarSeccion(doc, '2. Tabla Maestra de Datos', investigacion.tablaMaestra);
    
    doc.addPage();
    agregarSeccion(doc, '3. Supuestos Explícitos', investigacion.supuestos);
    
    doc.addPage();
    agregarSeccion(doc, '4. Modelo Mínimo', investigacion.modelo);
    
    doc.addPage();
    agregarSeccion(doc, '5. Escenarios', investigacion.escenarios);
    
    doc.addPage();
    agregarSeccion(doc, '6. Brechas Detectadas', investigacion.brechas);
    
    doc.addPage();
    agregarSeccion(doc, '7. Conclusión Estructural', investigacion.conclusion);
    
    doc.addPage();
    // Formatear fuentes desde tabla separada
    let fuentesTexto = '';
    if (fuentes && fuentes.length > 0) {
      fuentesTexto = fuentes.map((f, idx) => {
        let texto = `${idx + 1}. ${f.titulo}`;
        if (f.autor) texto += ` - ${f.autor}`;
        if (f.institucion) texto += ` (${f.institucion})`;
        if (f.url) texto += `\n   URL: ${f.url}`;
        if (f.fechaPublicacion) texto += `\n   Fecha: ${new Date(f.fechaPublicacion).toLocaleDateString('es-MX')}`;
        return texto;
      }).join('\n\n');
    } else {
      fuentesTexto = 'No se encontraron fuentes registradas para esta investigación.';
    }
    agregarSeccion(doc, 'Fuentes Primarias', fuentesTexto);
    
    // Footer en todas las páginas
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).font('Helvetica').text(
        `Laboratorio Público de Análisis Estructural - Choix, Sinaloa | Página ${i + 1} de ${range.count}`,
        50,
        doc.page.height - 30,
        { align: 'center' }
      );
    }
    
    doc.end();
    } catch (error) {
      console.error('[PDF Generator] Error fatal al generar PDF:', error);
      reject(error);
    }
  });
}

function agregarSeccion(doc: PDFKit.PDFDocument, titulo: string, contenido: string) {
  doc.fontSize(14).font('Helvetica-Bold').text(titulo, { underline: true });
  doc.moveDown(0.5);
  
  // Validación defensiva: si contenido es null/undefined, usar string vacío
  const contenidoSeguro = contenido || '';
  
  // Convertir markdown básico a texto plano con formato
  const lineas = contenidoSeguro.split('\n');
  
  lineas.forEach((linea) => {
    // Detectar encabezados markdown
    if (linea.startsWith('###')) {
      doc.fontSize(11).font('Helvetica-Bold').text(linea.replace(/^###\s*/, ''), { continued: false });
      doc.moveDown(0.3);
    } else if (linea.startsWith('##')) {
      doc.fontSize(12).font('Helvetica-Bold').text(linea.replace(/^##\s*/, ''), { continued: false });
      doc.moveDown(0.3);
    } else if (linea.startsWith('**') && linea.endsWith('**')) {
      doc.fontSize(10).font('Helvetica-Bold').text(linea.replace(/\*\*/g, ''), { continued: false });
      doc.moveDown(0.2);
    } else if (linea.trim().startsWith('-') || linea.trim().startsWith('*')) {
      doc.fontSize(10).font('Helvetica').text(`  • ${linea.replace(/^[\s\-\*]+/, '')}`, { continued: false });
      doc.moveDown(0.2);
    } else if (linea.trim() === '') {
      doc.moveDown(0.3);
    } else {
      doc.fontSize(10).font('Helvetica').text(linea, { align: 'justify', continued: false });
      doc.moveDown(0.2);
    }
  });
  
  doc.moveDown(1);
}
