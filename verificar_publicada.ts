import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         VERIFICACIÓN CAMPO PUBLICADA - INVESTIGACIONES        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const [investigaciones] = await connection.query(`
  SELECT id, numero, titulo, publicada
  FROM investigaciones
  ORDER BY numero
`);

console.log('ID     | Nº | Título                                                      | Publicada');
console.log('-------|----|------------------------------------------------------------|----------');
(investigaciones as any[]).forEach(inv => {
  const publicadaStatus = inv.publicada === 1 ? '✅ SÍ' : '❌ NO';
  console.log(`${inv.id.toString().padEnd(6)} | ${inv.numero.toString().padEnd(2)} | ${inv.titulo.substring(0, 58).padEnd(58)} | ${publicadaStatus}`);
});

const totalPublicadas = (investigaciones as any[]).filter(i => i.publicada === 1).length;
const totalNoPublicadas = (investigaciones as any[]).filter(i => i.publicada === 0).length;

console.log('\n📊 RESUMEN:');
console.log(`   Total investigaciones: ${(investigaciones as any[]).length}`);
console.log(`   Publicadas: ${totalPublicadas}`);
console.log(`   No publicadas: ${totalNoPublicadas}`);

if (totalNoPublicadas > 0) {
  console.log('\n⚠️  ACCIÓN REQUERIDA: Hay investigaciones con publicada=0');
  console.log('   Estas investigaciones NO aparecerán en el frontend.');
}

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                  VERIFICACIÓN COMPLETADA                       ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
