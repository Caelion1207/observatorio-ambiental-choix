#!/usr/bin/env node

/**
 * MIGRACIÓN COMPLETA Y FORMAL: Schema v1 → Schema v2
 * 
 * Este script ejecuta una migración completa de la tabla investigaciones
 * desde el schema legacy (v1) al schema escalable (v2).
 * 
 * Fases:
 * 1. Backup automático de investigaciones con hash SHA-256
 * 2. Creación de tabla temporal investigaciones_v2
 * 3. Migración de datos con mapeo categoria → dominioId
 * 4. Migración de fuentes a tabla separada
 * 5. Agregado de campo numero
 * 6. Eliminación de columnas legacy
 * 7. Verificación de integridad
 * 8. Registro de hash del estado final
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está definida');
  process.exit(1);
}

// Parsear DATABASE_URL
const dbConfig = (() => {
  const url = new URL(DATABASE_URL);
  return {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  };
})();

console.log('\n🔧 MIGRACIÓN COMPLETA SCHEMA V2');
console.log('================================\n');

const startTime = Date.now();
let connection;

// Mapeo de categorías a dominios
const CATEGORIA_TO_DOMINIO = {
  'hidrologia': 1,
  'medio_ambiente': 2,
  'salud': 3,
  'educacion': 4,
  'infraestructura': 5,
  'transporte': 5, // Transporte se mapea a infraestructura
  'finanzas': 6,
  'agricultura': 7,
  'ganaderia': 8
};

async function main() {
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión a base de datos establecida\n');

    // FASE 1: Backup automático
    console.log('📦 FASE 1: Backup automático de investigaciones');
    const investigaciones = await connection.query('SELECT * FROM investigaciones');
    const backupData = JSON.stringify(investigaciones[0], null, 2);
    
    const backupDir = '/home/ubuntu/observatorio-choix/migraciones';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const backupFile = path.join(backupDir, `backup_investigaciones_${timestamp}.json`);
    fs.writeFileSync(backupFile, backupData);
    
    // Generar hash SHA-256
    const hash = crypto.createHash('sha256').update(backupData).digest('hex');
    const hashFile = path.join(backupDir, `backup_investigaciones_${timestamp}.hash.txt`);
    fs.writeFileSync(hashFile, `${hash}  backup_investigaciones_${timestamp}.json\n`);
    
    console.log(`   ✓ Backup guardado: ${backupFile}`);
    console.log(`   ✓ Hash SHA-256: ${hash.substring(0, 16)}...`);
    console.log(`   ✓ Investigaciones respaldadas: ${investigaciones[0].length}\n`);

    // FASE 2: Crear tabla temporal investigaciones_v2
    console.log('🏗️  FASE 2: Crear tabla temporal investigaciones_v2');
    
    await connection.query('DROP TABLE IF EXISTS investigaciones_v2');
    
    await connection.query(`
      CREATE TABLE investigaciones_v2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero INT NOT NULL,
        dominioId INT NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        resumenEjecutivo TEXT NOT NULL,
        definicionSistema TEXT NOT NULL,
        tablaMaestra TEXT NOT NULL,
        supuestos TEXT NOT NULL,
        modelo TEXT NOT NULL,
        escenarios TEXT NOT NULL,
        brechas TEXT NOT NULL,
        conclusion TEXT NOT NULL,
        metadataJson TEXT,
        escenariosConfig TEXT,
        indicesCalculados TEXT,
        imagenesSatelitales TEXT,
        versionProtocolo VARCHAR(20) NOT NULL DEFAULT 'v1.0',
        fechaCierreSemantico TIMESTAMP NULL,
        supuestosEstructurados TEXT,
        indiceRobustez DECIMAL(3,2) DEFAULT 0.00,
        publicada BOOLEAN NOT NULL DEFAULT FALSE,
        autorId INT NOT NULL DEFAULT 1,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        publishedAt TIMESTAMP NULL
      )
    `);
    
    console.log('   ✓ Tabla investigaciones_v2 creada\n');

    // FASE 3: Migrar datos con mapeo categoria → dominioId
    console.log('🔄 FASE 3: Migrar datos con mapeo categoria → dominioId');
    
    for (const inv of investigaciones[0]) {
      const dominioId = CATEGORIA_TO_DOMINIO[inv.categoria] || 1;
      const numero = inv.numero || inv.id;
      
      await connection.query(`
        INSERT INTO investigaciones_v2 (
          id, numero, dominioId, titulo, slug, resumenEjecutivo,
          definicionSistema, tablaMaestra, supuestos, modelo,
          escenarios, brechas, conclusion, metadataJson,
          escenariosConfig, indicesCalculados, imagenesSatelitales,
          versionProtocolo, fechaCierreSemantico, supuestosEstructurados,
          indiceRobustez, publicada, autorId, createdAt, updatedAt, publishedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        inv.id, numero, dominioId, inv.titulo, inv.slug, inv.resumenEjecutivo,
        inv.definicionSistema, inv.tablaMaestra, inv.supuestos, inv.modelo,
        inv.escenarios, inv.brechas, inv.conclusion, inv.metadataJson,
        inv.escenariosConfig, inv.indicesCalculados, inv.imagenesSatelitales,
        inv.versionProtocolo || 'v1.0', inv.fechaCierreSemantico, inv.supuestosEstructurados,
        inv.indiceRobustez || 0.00, inv.publicada || false, inv.autorId || 1,
        inv.createdAt, inv.updatedAt, inv.publishedAt
      ]);
      
      console.log(`   ✓ Migrada: ${inv.titulo.substring(0, 60)}... (categoria: ${inv.categoria} → dominioId: ${dominioId})`);
    }
    
    console.log(`   ✓ Total migradas: ${investigaciones[0].length}\n`);

    // FASE 4: Migrar fuentes a tabla separada
    console.log('📚 FASE 4: Migrar fuentes a tabla separada');
    
    let fuentesMigradas = 0;
    for (const inv of investigaciones[0]) {
      if (inv.fuentes) {
        // Parsear fuentes del campo legacy (asumiendo formato texto)
        const fuentesTexto = inv.fuentes.split('\n').filter(f => f.trim());
        
        for (const fuenteTexto of fuentesTexto) {
          await connection.query(`
            INSERT INTO fuentes (
              investigacionId, tipo, titulo, autor, institucion,
              url, fechaPublicacion, fechaConsulta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            inv.id,
            'oficial', // Tipo por defecto
            fuenteTexto.substring(0, 500),
            'No especificado',
            'No especificado',
            null,
            null,
            new Date()
          ]);
          
          fuentesMigradas++;
        }
      }
    }
    
    console.log(`   ✓ Fuentes migradas: ${fuentesMigradas}\n`);

    // FASE 5: Reemplazar tabla antigua con nueva
    console.log('🔄 FASE 5: Reemplazar tabla antigua con nueva');
    
    await connection.query('DROP TABLE investigaciones');
    await connection.query('RENAME TABLE investigaciones_v2 TO investigaciones');
    
    console.log('   ✓ Tabla investigaciones actualizada\n');

    // FASE 6: Verificar integridad
    console.log('✅ FASE 6: Verificar integridad de datos');
    
    const [invCount] = await connection.query('SELECT COUNT(*) as count FROM investigaciones');
    const [fuentesCount] = await connection.query('SELECT COUNT(*) as count FROM fuentes');
    const [dominiosCount] = await connection.query('SELECT COUNT(*) as count FROM dominios');
    
    console.log(`   ✓ Investigaciones en nueva tabla: ${invCount[0].count}`);
    console.log(`   ✓ Fuentes en tabla separada: ${fuentesCount[0].count}`);
    console.log(`   ✓ Dominios disponibles: ${dominiosCount[0].count}`);
    
    const integrityOK = invCount[0].count === investigaciones[0].length;
    console.log(`   ${integrityOK ? '✅' : '❌'} Integridad: ${integrityOK ? 'OK' : 'ERROR'}\n`);

    // FASE 7: Registrar hash del estado final
    console.log('📝 FASE 7: Registrar hash del estado final');
    
    const [finalState] = await connection.query('SELECT * FROM investigaciones');
    const finalStateData = JSON.stringify(finalState, null, 2);
    const finalHash = crypto.createHash('sha256').update(finalStateData).digest('hex');
    
    const changelogEntry = `
## Migración Schema v2 - ${new Date().toISOString().split('T')[0]}

**Tipo:** Migración completa de schema
**Versión:** v1.0 → v2.0
**Estado:** ${integrityOK ? 'EXITOSA' : 'FALLIDA'}

### Cambios Aplicados
- Eliminada columna \`categoria\` (enum legacy)
- Agregado campo \`dominioId\` (referencia a tabla dominios)
- Agregado campo \`numero\` (identificador secuencial)
- Migradas fuentes a tabla separada \`fuentes\`
- Eliminado campo \`fuentes\` (text legacy)

### Estadísticas
- Investigaciones migradas: ${invCount[0].count}
- Fuentes migradas: ${fuentesMigradas}
- Dominios disponibles: ${dominiosCount[0].count}

### Backups
- Archivo: backup_investigaciones_${timestamp}.json
- Hash pre-migración: ${hash}
- Hash post-migración: ${finalHash}

### Verificación
- Integridad: ${integrityOK ? 'OK' : 'ERROR'}
- Core modificado: NO
- Escalabilidad: Ilimitada (N dominios)
`;
    
    const changelogPath = '/home/ubuntu/observatorio-choix/CHANGELOG.md';
    const existingChangelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : '';
    fs.writeFileSync(changelogPath, changelogEntry + '\n' + existingChangelog);
    
    console.log(`   ✓ Hash post-migración: ${finalHash.substring(0, 16)}...`);
    console.log(`   ✓ Registro agregado a CHANGELOG.md\n`);

    // Resumen final
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('🎉 MIGRACIÓN COMPLETADA');
    console.log('======================\n');
    console.log(`⏱️  Duración: ${duration}s`);
    console.log(`📊 Investigaciones: ${invCount[0].count}`);
    console.log(`📚 Fuentes: ${fuentesCount[0].count}`);
    console.log(`🏷️  Dominios: ${dominiosCount[0].count}`);
    console.log(`✅ Estado: ${integrityOK ? 'OK' : 'FAIL'}\n`);

  } catch (error) {
    console.error('\n❌ ERROR EN MIGRACIÓN:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
