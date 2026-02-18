import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         AUDITORÍA COMPLETA - OBSERVATORIO CHOIX                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// 1. Dominios
const [dominios] = await connection.query('SELECT id, nombre, slug FROM dominios ORDER BY id');
console.log('📁 DOMINIOS REGISTRADOS:\n');
(dominios as any[]).forEach(d => {
  console.log(`  ${d.id}. ${d.nombre} (${d.slug})`);
});

// 2. Investigaciones
const [investigaciones] = await connection.query(`
  SELECT i.id, i.numero, i.titulo, i.dominioId, i.indiceRobustez, d.nombre as dominioNombre
  FROM investigaciones i
  LEFT JOIN dominios d ON i.dominioId = d.id
  ORDER BY i.numero
`);

console.log(`\n\n📊 INVESTIGACIONES PUBLICADAS: ${(investigaciones as any[]).length} total\n`);
(investigaciones as any[]).forEach(inv => {
  console.log(`  #${inv.numero} - ${inv.titulo}`);
  console.log(`      Dominio: ${inv.dominioNombre} (ID: ${inv.dominioId})`);
  console.log(`      IRM: ${inv.indiceRobustez}`);
  console.log(`      DB ID: ${inv.id}`);
  console.log('');
});

// 3. Fuentes
const [fuentes] = await connection.query('SELECT COUNT(*) as total FROM fuentes');
console.log(`\n📚 FUENTES PRIMARIAS: ${(fuentes as any[])[0].total} total\n`);

// 4. Resumen por dominio
const [resumen] = await connection.query(`
  SELECT d.nombre, COUNT(i.id) as total_investigaciones
  FROM dominios d
  LEFT JOIN investigaciones i ON d.id = i.dominioId
  GROUP BY d.id, d.nombre
  ORDER BY d.id
`);

console.log('\n📈 INVESTIGACIONES POR DOMINIO:\n');
(resumen as any[]).forEach(r => {
  console.log(`  ${r.nombre}: ${r.total_investigaciones} investigación(es)`);
});

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    FIN DE AUDITORÍA                            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
