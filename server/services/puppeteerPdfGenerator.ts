import puppeteer from 'puppeteer';
import type { Investigacion, Fuente } from '../../drizzle/schema';
import { generateInvestigacionHTML } from './htmlGenerator';

export async function generatePDFFromInvestigacion(
  investigacion: Investigacion,
  fuentes: Fuente[]
): Promise<Buffer> {
  const timestamp = new Date().toISOString();
  console.log(`[Puppeteer PDF] [${timestamp}] Iniciando generación PDF`);
  console.log(`[Puppeteer PDF] Investigación ID: ${investigacion.id}`);
  console.log(`[Puppeteer PDF] Título: ${investigacion.titulo}`);
  console.log(`[Puppeteer PDF] Slug: ${investigacion.slug}`);
  console.log(`[Puppeteer PDF] Fuentes recibidas: ${fuentes?.length || 0}`);

  let html: string;
  try {
    html = generateInvestigacionHTML(investigacion, fuentes);
    console.log(`[Puppeteer PDF] HTML generado, tamaño: ${html.length} caracteres`);
  } catch (htmlError: any) {
    console.error(`[Puppeteer PDF] Error al generar HTML:`);
    console.error(`[Puppeteer PDF] - Message: ${htmlError.message}`);
    console.error(`[Puppeteer PDF] - Stack: ${htmlError.stack}`);
    throw new Error(`Fallo en generación HTML: ${htmlError.message}`);
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false, // Headers/footers manejados por CSS @page
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    console.log(`[Puppeteer PDF] ✅ PDF generado exitosamente`);
    console.log(`[Puppeteer PDF] - Investigación ID: ${investigacion.id}`);
    console.log(`[Puppeteer PDF] - Tamaño PDF: ${pdfBuffer.length} bytes`);
    console.log(`[Puppeteer PDF] - Tamaño HTML: ${html.length} caracteres`);
    console.log(`[Puppeteer PDF] - Ratio compresión: ${(pdfBuffer.length / html.length).toFixed(2)}x`);
    return Buffer.from(pdfBuffer);
  } catch (error: any) {
    console.error(`[Puppeteer PDF] ========== ERROR CRÍTICO ==========`);
    console.error(`[Puppeteer PDF] Timestamp: ${new Date().toISOString()}`);
    console.error(`[Puppeteer PDF] Investigación ID: ${investigacion.id}`);
    console.error(`[Puppeteer PDF] Título: ${investigacion.titulo}`);
    console.error(`[Puppeteer PDF] Slug: ${investigacion.slug}`);
    console.error(`[Puppeteer PDF] Tamaño HTML: ${html?.length || 0} caracteres`);
    console.error(`[Puppeteer PDF] Error Message: ${error.message}`);
    console.error(`[Puppeteer PDF] Error Stack:`);
    console.error(error.stack);
    console.error(`[Puppeteer PDF] ====================================`);
    throw new Error(`Fallo al generar PDF para investigación #${investigacion.id}: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
