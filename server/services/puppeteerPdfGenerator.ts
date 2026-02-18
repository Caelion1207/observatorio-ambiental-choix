import puppeteer from 'puppeteer';
import type { Investigacion, Fuente } from '../../drizzle/schema';
import { generateInvestigacionHTML } from './htmlGenerator';

export async function generatePDFFromInvestigacion(
  investigacion: Investigacion,
  fuentes: Fuente[]
): Promise<Buffer> {
  console.log('[Puppeteer PDF] Iniciando generación PDF para:', investigacion.titulo);
  console.log('[Puppeteer PDF] Fuentes recibidas:', fuentes?.length || 0);

  const html = generateInvestigacionHTML(investigacion, fuentes);

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

    console.log('[Puppeteer PDF] PDF generado exitosamente, tamaño:', pdfBuffer.length, 'bytes');
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('[Puppeteer PDF] Error al generar PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
