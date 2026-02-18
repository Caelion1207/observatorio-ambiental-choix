/**
 * Script de validación cruzada: Genera PDF de TODAS las investigaciones
 * y documenta fallos específicos
 */

import * as db from './server/db';
import { generatePDFFromInvestigacion } from './server/services/puppeteerPdfGenerator';
import { writeFileSync, mkdirSync } from 'fs';

interface TestResult {
  investigacionId: number;
  titulo: string;
  slug: string;
  success: boolean;
  pdfSize?: number;
  htmlSize?: number;
  errorMessage?: string;
  errorStack?: string;
  timestamp: string;
}

async function testAllPDFs() {
  console.log('========================================')
  console.log('VALIDACIÓN CRUZADA DE GENERADOR PDF');
  console.log('========================================\n');

  // Crear directorio si no existe
  mkdirSync('/home/ubuntu/pdf-tests', { recursive: true });

  const investigaciones = await db.getInvestigacionesPublicadas();
  console.log(`Total de investigaciones encontradas: ${investigaciones.length}\n`);

  const results: TestResult[] = [];

  for (const investigacion of investigaciones) {
    console.log(`\n[${investigacion.id}] Probando: ${investigacion.titulo}`);
    console.log(`Slug: ${investigacion.slug}`);

    const result: TestResult = {
      investigacionId: investigacion.id,
      titulo: investigacion.titulo,
      slug: investigacion.slug,
      success: false,
      timestamp: new Date().toISOString(),
    };

    try {
      const fuentes = await db.getFuentesByInvestigacionId(investigacion.id);
      console.log(`Fuentes: ${fuentes.length}`);

      const pdfBuffer = await generatePDFFromInvestigacion(investigacion as any, fuentes);

      result.success = true;
      result.pdfSize = pdfBuffer.length;

      console.log(`✅ ÉXITO - PDF generado: ${pdfBuffer.length} bytes`);

      // Guardar PDF para inspección manual
      const filename = `/home/ubuntu/pdf-tests/${investigacion.slug}.pdf`;
      writeFileSync(filename, pdfBuffer);
      console.log(`Guardado en: ${filename}`);
    } catch (error: any) {
      result.success = false;
      result.errorMessage = error.message;
      result.errorStack = error.stack;

      console.log(`❌ FALLO - ${error.message}`);
    }

    results.push(result);
  }

  // Resumen final
  console.log('\n========================================');
  console.log('RESUMEN DE VALIDACIÓN');
  console.log('========================================\n');

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log(`Total: ${results.length}`);
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${failCount}`);
  console.log(`Tasa de éxito: ${((successCount / results.length) * 100).toFixed(1)}%\n`);

  if (failCount > 0) {
    console.log('INVESTIGACIONES FALLIDAS:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`\n[${r.investigacionId}] ${r.titulo}`);
        console.log(`Error: ${r.errorMessage}`);
      });
  }

  // Guardar reporte JSON
  const reportPath = '/home/ubuntu/pdf-tests/validation-report.json';
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReporte completo guardado en: ${reportPath}`);

  // Exit code según resultado
  process.exit(failCount > 0 ? 1 : 0);
}

testAllPDFs().catch((error) => {
  console.error('Error fatal en script de validación:', error);
  process.exit(1);
});
