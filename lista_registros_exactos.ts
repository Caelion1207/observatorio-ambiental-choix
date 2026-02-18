import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           LISTA EXACTA DE REGISTROS - CONGELAMIENTO           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// 1. DOMINIOS
console.log('📁 DOMINIOS (8 registros):\n');
const [dominios] = await connection.query('SELECT id, nombre, slug, activo FROM dominios ORDER BY id');
console.log('ID | Nombre                | Slug              | Activo');
console.log('---|----------------------|-------------------|-------');
(dominios as any[]).forEach(d => {
  console.log(`${d.id.toString().padEnd(2)} | ${d.nombre.padEnd(20)} | ${d.slug.padEnd(17)} | ${d.activo ? 'Sí' : 'No'}`);
});

// 2. INVESTIGACIONES
console.log('\n\n📊 INVESTIGACIONES (5 registros):\n');
const [investigaciones] = await connection.query(`
  SELECT i.id, i.numero, i.titulo, i.dominioId, i.indiceRobustez, i.slug, d.nombre as dominioNombre
  FROM investigaciones i
  LEFT JOIN dominios d ON i.dominioId = d.id
  ORDER BY i.numero
`);
console.log('ID     | Nº | Título                                                      | Dominio           | IRM  | Slug');
console.log('-------|----|------------------------------------------------------------|-------------------|------|-----');
(investigaciones as any[]).forEach(inv => {
  console.log(`${inv.id.toString().padEnd(6)} | ${inv.numero.toString().padEnd(2)} | ${inv.titulo.substring(0, 58).padEnd(58)} | ${(inv.dominioNombre || '').substring(0, 17).padEnd(17)} | ${inv.indiceRobustez} | ${inv.slug.substring(0, 40)}`);
});

// 3. FUENTES
console.log('\n\n📚 FUENTES (25 registros):\n');
const [fuentesPorInv] = await connection.query(`
  SELECT i.numero, i.titulo, COUNT(f.id) as total_fuentes
  FROM investigaciones i
  LEFT JOIN fuentes f ON i.id = f.investigacionId
  GROUP BY i.id, i.numero, i.titulo
  ORDER BY i.numero
`);
console.log('Inv | Título                                                      | Fuentes');
console.log('----|-------------------------------------------------------------|--------');
(fuentesPorInv as any[]).forEach(f => {
  console.log(`#${f.numero.toString().padEnd(2)} | ${f.titulo.substring(0, 59).padEnd(59)} | ${f.total_fuentes}`);
});

// 4. VERIFICAR CAMPO PUBLICADO
console.log('\n\n🔍 VERIFICACIÓN DE CAMPO PUBLICADO:\n');
try {
  const [columns] = await connection.query(`
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'investigaciones'
    AND COLUMN_NAME LIKE '%public%'
  `);
  
  if ((columns as any[]).length === 0) {
    console.log('   ⚠️  NO existe campo "publicado" en tabla investigaciones');
    console.log('   ℹ️  Todas las investigaciones en BD están implícitamente publicadas');
  } else {
    console.log('   ✅ Campo encontrado:');
    (columns as any[]).forEach(col => {
      console.log(`      ${col.COLUMN_NAME} (${col.DATA_TYPE}) - Default: ${col.COLUMN_DEFAULT}`);
    });
  }
} catch (error) {
  console.log(`   ❌ Error al verificar: ${error}`);
}

// 5. VERIFICAR CONEXIÓN DB
console.log('\n\n🔌 VERIFICACIÓN DE CONEXIÓN DB:\n');
const [dbInfo] = await connection.query('SELECT DATABASE() as db_name, VERSION() as version');
console.log(`   Base de datos activa: ${(dbInfo as any[])[0].db_name}`);
console.log(`   Versión MySQL: ${(dbInfo as any[])[0].version}`);
console.log(`   URL de conexión: ${process.env.DATABASE_URL?.split('@')[1]?.split('?')[0]}`);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                  LISTADO COMPLETADO                            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
