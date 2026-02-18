import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

const [rows] = await connection.query('SELECT id, numero, titulo, dominioId, indiceRobustez FROM investigaciones ORDER BY numero');

console.log('\n=== INVESTIGACIONES EN BASE DE DATOS ===\n');
console.log(`Total: ${(rows as any[]).length} investigaciones\n`);

(rows as any[]).forEach(row => {
  console.log(`ID: ${row.id}`);
  console.log(`Número: ${row.numero}`);
  console.log(`Título: ${row.titulo}`);
  console.log(`DominioID: ${row.dominioId}`);
  console.log(`IRM: ${row.indiceRobustez}`);
  console.log('---');
});

await connection.end();
