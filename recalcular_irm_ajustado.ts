import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║      RECALCULAR IRM AJUSTADO - TODAS LAS INVESTIGACIONES      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('ALGORITMO AJUSTADO:');
console.log('IRM = (Supuestos Verificados / Total Supuestos) × Peso Críticos\n');
console.log('Donde:');
console.log('- Peso Críticos = 1.0 si todos los críticos están verificados');
console.log('- Peso Críticos = 0.5 + (Críticos Verificados / Total Críticos) × 0.5 si hay críticos no verificados');
console.log('- IRM mínimo = 0.30 (incluso si no hay supuestos verificados)\n');

// Obtener todas las investigaciones
const [investigaciones] = await connection.query(`
  SELECT id, numero, titulo, supuestosEstructurados
  FROM investigaciones
  ORDER BY numero
`);

for (const inv of investigaciones as any[]) {
  console.log(`\n📊 Investigación #${inv.numero}: ${inv.titulo}`);
  
  try {
    // Parsear supuestos estructurados
    const supuestos = JSON.parse(inv.supuestosEstructurados || '[]');
    
    if (supuestos.length === 0) {
      console.log('   ⚠️  No hay supuestos estructurados - asignando IRM = 0.30');
      await connection.query(
        'UPDATE investigaciones SET indiceRobustez = ? WHERE id = ?',
        ['0.30', inv.id]
      );
      continue;
    }
    
    // Normalizar campos (verificado vs estado)
    const supuestosNormalizados = supuestos.map((s: any) => ({
      ...s,
      verificado: s.verificado !== undefined 
        ? s.verificado 
        : (s.estado === 'Verificado' || s.estado === 'verificado'),
      critico: s.sensibilidad === 'Crítico' || s.sensibilidad === 'crítica' || s.sensibilidad === 'alta' || s.impacto === 'Alto'
    }));
    
    const totalSupuestos = supuestosNormalizados.length;
    const supuestosVerificados = supuestosNormalizados.filter((s: any) => s.verificado).length;
    const supuestosCriticos = supuestosNormalizados.filter((s: any) => s.critico);
    const criticosVerificados = supuestosCriticos.filter((s: any) => s.verificado).length;
    const totalCriticos = supuestosCriticos.length;
    
    // Calcular tasa base de verificación
    const tasaVerificacion = totalSupuestos > 0 ? supuestosVerificados / totalSupuestos : 0;
    
    // Calcular peso por supuestos críticos
    let pesoCriticos = 1.0;
    if (totalCriticos > 0) {
      const tasaCriticosVerificados = criticosVerificados / totalCriticos;
      if (tasaCriticosVerificados < 1.0) {
        // Penalización por críticos no verificados
        pesoCriticos = 0.5 + (tasaCriticosVerificados * 0.5);
      }
    }
    
    // IRM final = tasa de verificación × peso de críticos
    let irm = tasaVerificacion * pesoCriticos;
    
    // IRM mínimo de 0.30 (incluso con datos escasos, el protocolo tiene valor)
    irm = Math.max(irm, 0.30);
    
    // Redondear a 2 decimales
    irm = parseFloat(irm.toFixed(2));
    
    console.log(`   Total supuestos: ${totalSupuestos}`);
    console.log(`   Supuestos verificados: ${supuestosVerificados}`);
    console.log(`   Tasa de verificación: ${(tasaVerificacion * 100).toFixed(1)}%`);
    console.log(`   Supuestos críticos: ${totalCriticos}`);
    console.log(`   Críticos verificados: ${criticosVerificados}`);
    console.log(`   Peso críticos: ${pesoCriticos.toFixed(2)}`);
    console.log(`   IRM calculado: ${irm}`);
    
    // Actualizar en base de datos
    await connection.query(
      'UPDATE investigaciones SET indiceRobustez = ? WHERE id = ?',
      [irm.toString(), inv.id]
    );
    
    console.log(`   ✅ IRM actualizado a ${irm}`);
    
  } catch (error) {
    console.log(`   ❌ Error al procesar supuestos: ${error}`);
  }
}

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                  RECALCULACIÓN COMPLETADA                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
