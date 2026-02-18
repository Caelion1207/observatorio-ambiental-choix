import { drizzle } from "drizzle-orm/mysql2";
import { investigaciones, dominios, fuentes } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

interface AuditoriaResult {
  seccion: string;
  estado: 'OK' | 'ADVERTENCIA' | 'CRÍTICO';
  hallazgos: string[];
}

async function auditarCoherencia() {
  const resultados: AuditoriaResult[] = [];
  
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║         AUDITORÍA DE COHERENCIA OPERATIVA                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  // 1. ALINEACIÓN BACKEND ↔ BASE DE DATOS ↔ FRONTEND
  console.log('📊 1. ALINEACIÓN BACKEND ↔ BASE DE DATOS ↔ FRONTEND\n');
  const hallazgosBackendDB: string[] = [];
  
  try {
    // Verificar que todas las investigaciones tienen campos requeridos
    const todasInvestigaciones = await db.select().from(investigaciones);
    
    const camposRequeridos = [
      'id', 'titulo', 'slug', 'dominioId', 'resumenEjecutivo',
      'definicionSistema', 'tablaMaestra', 'supuestos', 'modelo',
      'escenarios', 'brechas', 'conclusion', 'indiceRobustez',
      'publicada', 'publishedAt', 'createdAt'
    ];
    
    todasInvestigaciones.forEach((inv, index) => {
      camposRequeridos.forEach(campo => {
        if (!(campo in inv)) {
          hallazgosBackendDB.push(`Investigación ${inv.id} (${inv.titulo}) falta campo: ${campo}`);
        }
      });
      
      // Verificar que campos de texto no estén vacíos
      if (!inv.titulo || inv.titulo.trim() === '') {
        hallazgosBackendDB.push(`Investigación ${inv.id} tiene título vacío`);
      }
      if (!inv.slug || inv.slug.trim() === '') {
        hallazgosBackendDB.push(`Investigación ${inv.id} tiene slug vacío`);
      }
      if (!inv.resumenEjecutivo || inv.resumenEjecutivo.trim() === '') {
        hallazgosBackendDB.push(`Investigación ${inv.id} tiene resumenEjecutivo vacío`);
      }
    });
    
    if (hallazgosBackendDB.length === 0) {
      console.log('✅ Todas las investigaciones tienen campos requeridos completos');
      resultados.push({
        seccion: 'Backend ↔ DB',
        estado: 'OK',
        hallazgos: ['Todos los campos requeridos presentes y completos']
      });
    } else {
      console.log(`⚠️  Encontrados ${hallazgosBackendDB.length} problemas de campos:`);
      hallazgosBackendDB.forEach(h => console.log(`   - ${h}`));
      resultados.push({
        seccion: 'Backend ↔ DB',
        estado: 'ADVERTENCIA',
        hallazgos: hallazgosBackendDB
      });
    }
  } catch (error) {
    console.log(`❌ Error al auditar backend-DB: ${error}`);
    resultados.push({
      seccion: 'Backend ↔ DB',
      estado: 'CRÍTICO',
      hallazgos: [`Error de conexión o query: ${error}`]
    });
  }
  
  console.log('\n');
  
  // 2. DOMINIOS ↔ CONTENIDO
  console.log('🗂️  2. DOMINIOS ↔ CONTENIDO\n');
  const hallazgosDominios: string[] = [];
  
  try {
    const todosDominios = await db.select().from(dominios).where(eq(dominios.activo, true));
    const todasInvestigaciones = await db.select().from(investigaciones).where(eq(investigaciones.publicada, true));
    
    console.log(`Total dominios activos: ${todosDominios.length}`);
    console.log(`Total investigaciones publicadas: ${todasInvestigaciones.length}\n`);
    
    const dominiosConConteo: { [key: number]: { nombre: string; count: number } } = {};
    
    todosDominios.forEach(d => {
      dominiosConConteo[d.id] = { nombre: d.nombre, count: 0 };
    });
    
    todasInvestigaciones.forEach(inv => {
      if (dominiosConConteo[inv.dominioId]) {
        dominiosConConteo[inv.dominioId].count++;
      } else {
        hallazgosDominios.push(`Investigación ${inv.id} (${inv.titulo}) referencia dominio inexistente: ${inv.dominioId}`);
      }
    });
    
    console.log('Distribución de investigaciones por dominio:');
    Object.entries(dominiosConConteo).forEach(([id, data]) => {
      const icono = data.count === 0 ? '⚠️ ' : '✅';
      console.log(`  ${icono} ${data.nombre}: ${data.count} investigación(es)`);
      
      if (data.count === 0) {
        hallazgosDominios.push(`Dominio "${data.nombre}" (ID: ${id}) sin investigaciones`);
      }
    });
    
    if (hallazgosDominios.length === 0) {
      resultados.push({
        seccion: 'Dominios ↔ Contenido',
        estado: 'OK',
        hallazgos: ['Todos los dominios tienen contenido y todas las investigaciones tienen dominio válido']
      });
    } else {
      resultados.push({
        seccion: 'Dominios ↔ Contenido',
        estado: 'ADVERTENCIA',
        hallazgos: hallazgosDominios
      });
    }
  } catch (error) {
    console.log(`❌ Error al auditar dominios: ${error}`);
    resultados.push({
      seccion: 'Dominios ↔ Contenido',
      estado: 'CRÍTICO',
      hallazgos: [`Error: ${error}`]
    });
  }
  
  console.log('\n');
  
  // 3. FUENTES PRIMARIAS
  console.log('📚 3. FUENTES PRIMARIAS\n');
  const hallazgosFuentes: string[] = [];
  
  try {
    const todasInvestigaciones = await db.select().from(investigaciones).where(eq(investigaciones.publicada, true));
    
    for (const inv of todasInvestigaciones) {
      const fuentesInv = await db.select().from(fuentes).where(eq(fuentes.investigacionId, inv.id));
      
      if (fuentesInv.length === 0) {
        hallazgosFuentes.push(`Investigación ${inv.id} (${inv.titulo}) sin fuentes primarias`);
        console.log(`⚠️  ${inv.titulo}: 0 fuentes`);
      } else {
        console.log(`✅ ${inv.titulo}: ${fuentesInv.length} fuente(s)`);
      }
      
      // Verificar que fuentes tienen campos requeridos
      fuentesInv.forEach((f, index) => {
        if (!f.tipo || !f.titulo) {
          hallazgosFuentes.push(`Fuente ${index + 1} de investigación ${inv.id} falta tipo o título`);
        }
      });
    }
    
    if (hallazgosFuentes.length === 0) {
      resultados.push({
        seccion: 'Fuentes Primarias',
        estado: 'OK',
        hallazgos: ['Todas las investigaciones tienen fuentes primarias válidas']
      });
    } else {
      resultados.push({
        seccion: 'Fuentes Primarias',
        estado: 'ADVERTENCIA',
        hallazgos: hallazgosFuentes
      });
    }
  } catch (error) {
    console.log(`❌ Error al auditar fuentes: ${error}`);
    resultados.push({
      seccion: 'Fuentes Primarias',
      estado: 'CRÍTICO',
      hallazgos: [`Error: ${error}`]
    });
  }
  
  console.log('\n');
  
  // 4. ÍNDICE DE ROBUSTEZ METODOLÓGICA (IRM)
  console.log('📈 4. ÍNDICE DE ROBUSTEZ METODOLÓGICA (IRM)\n');
  const hallazgosIRM: string[] = [];
  
  try {
    const todasInvestigaciones = await db.select().from(investigaciones).where(eq(investigaciones.publicada, true));
    
    todasInvestigaciones.forEach(inv => {
      const irm = inv.indiceRobustez;
      
      if (irm === null || irm === undefined) {
        hallazgosIRM.push(`Investigación ${inv.id} (${inv.titulo}) sin IRM`);
        console.log(`⚠️  ${inv.titulo}: IRM no definido`);
      } else {
        const irmNum = typeof irm === 'string' ? parseFloat(irm) : Number(irm);
        
        if (isNaN(irmNum)) {
          hallazgosIRM.push(`Investigación ${inv.id} (${inv.titulo}) IRM no es número válido: ${irm}`);
          console.log(`❌ ${inv.titulo}: IRM no es número válido: ${irm}`);
        } else if (irmNum < 0 || irmNum > 1) {
          hallazgosIRM.push(`Investigación ${inv.id} (${inv.titulo}) IRM fuera de rango: ${irmNum}`);
          console.log(`❌ ${inv.titulo}: IRM fuera de rango [0,1]: ${irmNum}`);
        } else {
          console.log(`✅ ${inv.titulo}: IRM = ${irmNum.toFixed(2)}`);
        }
      }
    });
    
    if (hallazgosIRM.length === 0) {
      resultados.push({
        seccion: 'IRM',
        estado: 'OK',
        hallazgos: ['Todos los IRM están en rango válido [0,1]']
      });
    } else {
      resultados.push({
        seccion: 'IRM',
        estado: 'CRÍTICO',
        hallazgos: hallazgosIRM
      });
    }
  } catch (error) {
    console.log(`❌ Error al auditar IRM: ${error}`);
    resultados.push({
      seccion: 'IRM',
      estado: 'CRÍTICO',
      hallazgos: [`Error: ${error}`]
    });
  }
  
  console.log('\n');
  
  // RESUMEN FINAL
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    RESUMEN DE AUDITORÍA                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const criticos = resultados.filter(r => r.estado === 'CRÍTICO').length;
  const advertencias = resultados.filter(r => r.estado === 'ADVERTENCIA').length;
  const ok = resultados.filter(r => r.estado === 'OK').length;
  
  console.log(`✅ Secciones OK: ${ok}`);
  console.log(`⚠️  Advertencias: ${advertencias}`);
  console.log(`❌ Críticos: ${criticos}\n`);
  
  if (criticos > 0) {
    console.log('🔴 ESTADO: SISTEMA CON PROBLEMAS CRÍTICOS');
    console.log('   Requiere corrección antes de expansión.\n');
  } else if (advertencias > 0) {
    console.log('🟡 ESTADO: SISTEMA FUNCIONAL CON ADVERTENCIAS');
    console.log('   Estable pero con áreas de mejora.\n');
  } else {
    console.log('🟢 ESTADO: SISTEMA COHERENTE Y ESTABLE');
    console.log('   Listo para operación.\n');
  }
  
  // Detalle de hallazgos
  console.log('DETALLE DE HALLAZGOS:\n');
  resultados.forEach(r => {
    const icono = r.estado === 'OK' ? '✅' : r.estado === 'ADVERTENCIA' ? '⚠️ ' : '❌';
    console.log(`${icono} ${r.seccion}:`);
    r.hallazgos.forEach(h => console.log(`   - ${h}`));
    console.log('');
  });
  
  process.exit(criticos > 0 ? 1 : 0);
}

auditarCoherencia().catch(error => {
  console.error('Error fatal en auditoría:', error);
  process.exit(1);
});
