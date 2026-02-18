import mysql from 'mysql2/promise';
import { writeFileSync } from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║              DUMP COMPLETO DE BASE DE DATOS                    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
let dumpContent = `-- DUMP COMPLETO OBSERVATORIO CHOIX\n`;
dumpContent += `-- Fecha: ${new Date().toISOString()}\n`;
dumpContent += `-- Base de datos: ${process.env.DATABASE_URL?.split('/').pop()?.split('?')[0]}\n\n`;

// 1. DOMINIOS
console.log('📁 Exportando dominios...');
const [dominios] = await connection.query('SELECT * FROM dominios ORDER BY id');
dumpContent += `\n-- ============================================================================\n`;
dumpContent += `-- TABLA: dominios (${(dominios as any[]).length} registros)\n`;
dumpContent += `-- ============================================================================\n\n`;
dumpContent += JSON.stringify(dominios, null, 2);

// 2. INVESTIGACIONES
console.log('📊 Exportando investigaciones...');
const [investigaciones] = await connection.query('SELECT * FROM investigaciones ORDER BY numero');
dumpContent += `\n\n-- ============================================================================\n`;
dumpContent += `-- TABLA: investigaciones (${(investigaciones as any[]).length} registros)\n`;
dumpContent += `-- ============================================================================\n\n`;
dumpContent += JSON.stringify(investigaciones, null, 2);

// 3. FUENTES
console.log('📚 Exportando fuentes...');
const [fuentes] = await connection.query('SELECT * FROM fuentes ORDER BY investigacionId, id');
dumpContent += `\n\n-- ============================================================================\n`;
dumpContent += `-- TABLA: fuentes (${(fuentes as any[]).length} registros)\n`;
dumpContent += `-- ============================================================================\n\n`;
dumpContent += JSON.stringify(fuentes, null, 2);

// 4. USERS
console.log('👤 Exportando users...');
const [users] = await connection.query('SELECT id, openId, name, email, role FROM users');
dumpContent += `\n\n-- ============================================================================\n`;
dumpContent += `-- TABLA: users (${(users as any[]).length} registros)\n`;
dumpContent += `-- ============================================================================\n\n`;
dumpContent += JSON.stringify(users, null, 2);

// Guardar archivo
const filename = `/home/ubuntu/db_dump_${timestamp}.json`;
writeFileSync(filename, dumpContent);

console.log(`\n✅ Dump completado: ${filename}`);
console.log(`   Tamaño: ${(dumpContent.length / 1024).toFixed(2)} KB\n`);

// Resumen
console.log('📈 RESUMEN DEL DUMP:\n');
console.log(`   Dominios: ${(dominios as any[]).length}`);
console.log(`   Investigaciones: ${(investigaciones as any[]).length}`);
console.log(`   Fuentes: ${(fuentes as any[]).length}`);
console.log(`   Usuarios: ${(users as any[]).length}`);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    DUMP COMPLETADO                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
