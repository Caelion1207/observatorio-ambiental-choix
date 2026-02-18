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

      // Portada profesional
      doc.moveDown(3);
      doc.fontSize(28).font('Helvetica-Bold').text('Laboratorio Público de Análisis Estructural', { align: 'center' });
      doc.fontSize(16).font('Helvetica').text('Choix, Sinaloa', { align: 'center' });
      doc.moveDown(4);
      
      doc.fontSize(22).font('Helvetica-Bold').text(investigacion.titulo, { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(14).font('Helvetica').text(`Investigación #${investigacion.numero}`, { align: 'center' });
      doc.moveDown(3);
      
      // Corregir fecha: verificar si es string o Date
      let fechaTexto = 'Fecha no disponible';
      if (investigacion.fechaPublicacion) {
        try {
          const fecha = typeof investigacion.fechaPublicacion === 'string' 
            ? new Date(investigacion.fechaPublicacion)
            : investigacion.fechaPublicacion;
          if (!isNaN(fecha.getTime())) {
            fechaTexto = fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
          }
        } catch (e) {
          console.error('[PDF] Error parseando fecha:', e);
        }
      }
      doc.fontSize(11).text(`Fecha de publicación: ${fechaTexto}`, { align: 'center' });
      
      // Blindaje Metodológico
      doc.moveDown(2);
      doc.fontSize(14).font('Helvetica-Bold').text('Blindaje Metodológico', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(10).font('Helvetica');
      doc.text(`Protocolo: v${investigacion.versionProtocolo || '1.0'}`);
      
      if (investigacion.fechaCierreSemantico) {
        try {
          const fechaCierre = typeof investigacion.fechaCierreSemantico === 'string'
            ? new Date(investigacion.fechaCierreSemantico)
            : investigacion.fechaCierreSemantico;
          if (!isNaN(fechaCierre.getTime())) {
            doc.text(`Cierre Semántico: ${fechaCierre.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`);
          }
        } catch (e) {
          console.error('[PDF] Error parseando fecha cierre:', e);
        }
      }
      
      if (investigacion.indiceRobustez) {
        const irm = parseFloat(investigacion.indiceRobustez);
        const estado = irm >= 0.8 ? 'Robusto' : irm >= 0.6 ? 'Moderado' : 'Débil';
        doc.text(`Índice de Robustez del Modelo (IRM): ${irm.toFixed(2)} - ${estado}`);
      }
      
      doc.addPage();
      
      // Índice (Tabla de Contenidos)
      doc.fontSize(18).font('Helvetica-Bold').text('Índice', { align: 'center' });
      doc.moveDown(1);
      
      const secciones = [
        { titulo: 'Declaración de Neutralidad Técnica', pagina: 2 },
        { titulo: 'Resumen Ejecutivo', pagina: 2 },
        { titulo: 'Registro Público de Supuestos', pagina: 3 },
        { titulo: '1. Definición del Sistema', pagina: 4 },
        { titulo: '2. Tabla Maestra de Datos', pagina: 5 },
        { titulo: '3. Supuestos Explícitos', pagina: 6 },
        { titulo: '4. Modelo Mínimo', pagina: 7 },
        { titulo: '5. Escenarios', pagina: 8 },
        { titulo: '6. Brechas Detectadas', pagina: 9 },
        { titulo: '7. Conclusión Estructural', pagina: 10 },
        { titulo: 'Fuentes Primarias', pagina: 11 }
      ];
      
      doc.fontSize(11).font('Helvetica');
      secciones.forEach((seccion) => {
        const dots = '.'.repeat(60 - seccion.titulo.length - seccion.pagina.toString().length);
        doc.text(`${seccion.titulo} ${dots} ${seccion.pagina}`, { align: 'left' });
        doc.moveDown(0.3);
      });
      
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
      
      // Protocolo de 7 Secciones (agregar página solo si queda poco espacio)
      const agregarSeccionConPaginacion = (titulo: string, contenido: string) => {
        // Si queda menos de 100 puntos de altura, agregar nueva página
        if (doc.y > doc.page.height - 100) {
          doc.addPage();
        }
        agregarSeccion(doc, titulo, contenido);
      };
      
      doc.addPage();
      agregarSeccionConPaginacion('1. Definición del Sistema', investigacion.definicionSistema);
      agregarSeccionConPaginacion('2. Tabla Maestra de Datos', investigacion.tablaMaestra);
      agregarSeccionConPaginacion('3. Supuestos Explícitos', investigacion.supuestos);
      agregarSeccionConPaginacion('4. Modelo Mínimo', investigacion.modelo);
      agregarSeccionConPaginacion('5. Escenarios', investigacion.escenarios);
      agregarSeccionConPaginacion('6. Brechas Detectadas', investigacion.brechas);
      agregarSeccionConPaginacion('7. Conclusión Estructural', investigacion.conclusion);
      
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

function renderizarTablaMarkdown(doc: PDFKit.PDFDocument, contenido: string): boolean {
  // Detectar si el contenido tiene tabla Markdown
  const lineas = contenido.split('\n');
  const tablaInicio = lineas.findIndex(l => l.includes('|') && l.trim().startsWith('|'));
  
  if (tablaInicio === -1) return false;
  
  // Extraer filas de la tabla
  const filasTabla = [];
  for (let i = tablaInicio; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (!linea.includes('|')) break;
    if (linea.match(/^\|[\s\-:]+\|$/)) continue; // Saltar separador
    const celdas = linea.split('|').map(c => c.trim()).filter(c => c !== '');
    filasTabla.push(celdas);
  }
  
  if (filasTabla.length === 0) return false;
  
  // Renderizar contenido antes de la tabla
  const antesTabla = lineas.slice(0, tablaInicio).join('\n');
  if (antesTabla.trim()) {
    doc.fontSize(10).font('Helvetica').text(antesTabla, { align: 'justify' });
    doc.moveDown(0.5);
  }
  
  // Renderizar tabla
  const anchoColumna = (doc.page.width - 100) / filasTabla[0].length;
  const xInicio = 50;
  let yActual = doc.y;
  
  // Encabezado de tabla
  doc.fontSize(8).font('Helvetica-Bold');
  filasTabla[0].forEach((celda, idx) => {
    doc.text(celda, xInicio + (idx * anchoColumna), yActual, { width: anchoColumna - 5, align: 'left' });
  });
  yActual += 15;
  
  // Línea separadora
  doc.moveTo(xInicio, yActual).lineTo(xInicio + (anchoColumna * filasTabla[0].length), yActual).stroke();
  yActual += 5;
  
  // Filas de datos
  doc.fontSize(7).font('Helvetica');
  for (let i = 1; i < filasTabla.length; i++) {
    const fila = filasTabla[i];
    const alturaFila = Math.max(...fila.map(c => doc.heightOfString(c, { width: anchoColumna - 5 })));
    
    // Verificar si necesita nueva página
    if (yActual + alturaFila > doc.page.height - 50) {
      doc.addPage();
      yActual = 50;
    }
    
    fila.forEach((celda, idx) => {
      doc.text(celda, xInicio + (idx * anchoColumna), yActual, { width: anchoColumna - 5, align: 'left' });
    });
    yActual += alturaFila + 3;
  }
  
  doc.y = yActual + 10;
  
  // Renderizar contenido después de la tabla
  const despuesTabla = lineas.slice(tablaInicio + filasTabla.length + 1).join('\n');
  if (despuesTabla.trim()) {
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(despuesTabla, { align: 'justify' });
  }
  
  return true;
}

function agregarSeccion(doc: PDFKit.PDFDocument, titulo: string, contenido: string) {
  doc.fontSize(14).font('Helvetica-Bold').text(titulo, { underline: true });
  doc.moveDown(0.5);
  
  // Validación defensiva: si contenido es null/undefined, usar string vacío
  const contenidoSeguro = contenido || '';
  
  // Intentar renderizar como tabla Markdown
  if (renderizarTablaMarkdown(doc, contenidoSeguro)) {
    doc.moveDown(1);
    return;
  }
  
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
