import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           RECALCULAR IRM - TODAS LAS INVESTIGACIONES          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

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
      console.log('   ⚠️  No hay supuestos estructurados');
      continue;
    }
    
    // Contar supuestos críticos no verificados
    const supuestosCriticos = supuestos.filter((s: any) => 
      s.sensibilidad === 'crítica' || s.sensibilidad === 'alta'
    );
    
    const supuestosNoVerificados = supuestos.filter((s: any) => 
      s.estado === 'Pendiente' || s.estado === 'No Verificado'
    );
    
    const totalSupuestos = supuestos.length;
    const criticosNoVerificados = supuestosCriticos.filter((s: any) => 
      s.estado === 'Pendiente' || s.estado === 'No Verificado'
    ).length;
    
    // Calcular IRM
    // IRM = 1 - (Supuestos Críticos No Verificados / Total de Supuestos)
    const irm = totalSupuestos > 0 
      ? parseFloat((1 - (criticosNoVerificados / totalSupuestos)).toFixed(2))
      : 0.50;
    
    console.log(`   Total supuestos: ${totalSupuestos}`);
    console.log(`   Supuestos críticos: ${supuestosCriticos.length}`);
    console.log(`   Críticos no verificados: ${criticosNoVerificados}`);
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
