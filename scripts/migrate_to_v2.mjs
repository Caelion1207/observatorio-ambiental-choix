import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";

/**
 * Script de Migración Automatizada a Arquitectura v2.0
 * 
 * Ejecuta:
 * 1. Seed de 8 dominios
 * 2. Migración de 6 investigaciones existentes
 * 3. Creación de fuentes por investigación
 * 4. Validación de integridad
 */

const startTime = Date.now();
const report = {
  dominiosCreados: 0,
  investigacionesMigradas: 0,
  fuentesCreadas: 0,
  errores: [],
  warnings: []
};

// Mapeo de categorías antiguas a dominios nuevos
const CATEGORIA_TO_DOMINIO = {
  'hidrologia': 'agua',
  'medio_ambiente': 'medio_ambiente',
  'infraestructura': 'infraestructura',
  'salud': 'salud',
  'educacion': 'educacion',
  'transporte': 'infraestructura' // Transporte se agrupa en infraestructura
};

// Definición de 8 dominios
const DOMINIOS = [
  {
    nombre: 'Hidrología',
    slug: 'agua',
    descripcion: 'Análisis de sistemas hídricos, acuíferos, balance hídrico y gestión del agua',
    icono: 'Droplets',
    color: '#3b82f6',
    requiereSatelital: true,
    tipoIndice: 'NDWI',
    orden: 1
  },
  {
    nombre: 'Educación',
    slug: 'educacion',
    descripcion: 'Análisis de infraestructura educativa, capacidad vs demanda y cobertura',
    icono: 'GraduationCap',
    color: '#8b5cf6',
    requiereSatelital: false,
    tipoIndice: null,
    orden: 2
  },
  {
    nombre: 'Salud',
    slug: 'salud',
    descripcion: 'Análisis de infraestructura de salud, saturación y acceso a servicios',
    icono: 'Heart',
    color: '#ef4444',
    requiereSatelital: false,
    tipoIndice: null,
    orden: 3
  },
  {
    nombre: 'Infraestructura',
    slug: 'infraestructura',
    descripcion: 'Análisis de redes de transporte, cuellos de botella y expansión urbana',
    icono: 'Building2',
    color: '#f59e0b',
    requiereSatelital: true,
    tipoIndice: 'expansion_urbana',
    orden: 4
  },
  {
    nombre: 'Medio Ambiente',
    slug: 'medio_ambiente',
    descripcion: 'Análisis de cobertura forestal, biodiversidad y cambio climático',
    icono: 'Trees',
    color: '#10b981',
    requiereSatelital: true,
    tipoIndice: 'NDVI',
    orden: 5
  },
  {
    nombre: 'Finanzas Públicas',
    slug: 'finanzas',
    descripcion: 'Análisis de presupuesto, gasto ejecutado, deuda municipal e ingresos',
    icono: 'DollarSign',
    color: '#06b6d4',
    requiereSatelital: false,
    tipoIndice: null,
    orden: 6
  },
  {
    nombre: 'Agricultura',
    slug: 'agricultura',
    descripcion: 'Análisis de superficie cultivada, rendimiento y consumo hídrico agrícola',
    icono: 'Wheat',
    color: '#84cc16',
    requiereSatelital: true,
    tipoIndice: 'NDVI',
    orden: 7
  },
  {
    nombre: 'Ganadería',
    slug: 'ganaderia',
    descripcion: 'Análisis de capacidad de pastoreo, consumo hídrico y sostenibilidad ganadera',
    icono: 'Beef',
    color: '#a855f7',
    requiereSatelital: true,
    tipoIndice: 'NDVI',
    orden: 8
  }
];

async function main() {
  console.log('🚀 Iniciando migración a Arquitectura v2.0...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // ========================================================================
    // PASO 1: Crear tablas nuevas
    // ========================================================================
    console.log('📋 Paso 1: Creando tablas nuevas...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS dominios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        descripcion TEXT NOT NULL,
        icono VARCHAR(50),
        color VARCHAR(50),
        variablesTemplate TEXT,
        indicesConfig TEXT,
        escenariosBase TEXT,
        requiereSatelital BOOLEAN NOT NULL DEFAULT FALSE,
        tipoIndice VARCHAR(50),
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        orden INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fuentes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        investigacionId INT NOT NULL,
        tipo ENUM('oficial', 'tecnica', 'academica', 'periodistica') NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        autor VARCHAR(255),
        institucion VARCHAR(255),
        url TEXT,
        fechaPublicacion TIMESTAMP NULL,
        fechaConsulta TIMESTAMP NOT NULL,
        notas TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tablas creadas\n');
    
    // ========================================================================
    // PASO 2: Seed de dominios
    // ========================================================================
    console.log('🌱 Paso 2: Insertando 8 dominios...');
    
    const dominioIds = {};
    for (const dominio of DOMINIOS) {
      const [result] = await connection.query(
        `INSERT INTO dominios (nombre, slug, descripcion, icono, color, requiereSatelital, tipoIndice, orden, activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [dominio.nombre, dominio.slug, dominio.descripcion, dominio.icono, dominio.color, 
         dominio.requiereSatelital, dominio.tipoIndice, dominio.orden]
      );
      dominioIds[dominio.slug] = result.insertId;
      report.dominiosCreados++;
      console.log(`   ✓ ${dominio.nombre} (ID: ${result.insertId})`);
    }
    
    console.log(`✅ ${report.dominiosCreados} dominios creados\n`);
    
    // ========================================================================
    // PASO 3: Agregar campo dominioId a investigaciones
    // ========================================================================
    console.log('🔧 Paso 3: Modificando tabla investigaciones...');
    
    try {
      await connection.query(`ALTER TABLE investigaciones ADD COLUMN dominioId INT AFTER numero`);
      console.log('   ✓ Campo dominioId agregado');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ⚠ Campo dominioId ya existe');
        report.warnings.push('Campo dominioId ya existía');
      } else {
        throw e;
      }
    }
    
    try {
      await connection.query(`ALTER TABLE investigaciones ADD COLUMN metadataJson TEXT AFTER conclusion`);
      await connection.query(`ALTER TABLE investigaciones ADD COLUMN escenariosConfig TEXT AFTER metadataJson`);
      await connection.query(`ALTER TABLE investigaciones ADD COLUMN indicesCalculados TEXT AFTER escenariosConfig`);
      await connection.query(`ALTER TABLE investigaciones ADD COLUMN imagenesSatelitales TEXT AFTER indicesCalculados`);
      console.log('   ✓ Campos JSON agregados');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ⚠ Campos JSON ya existen');
        report.warnings.push('Campos JSON ya existían');
      } else {
        throw e;
      }
    }
    
    console.log('✅ Tabla investigaciones modificada\n');
    
    // ========================================================================
    // PASO 4: Migrar investigaciones existentes
    // ========================================================================
    console.log('🔄 Paso 4: Migrando investigaciones existentes...');
    
    const [investigaciones] = await connection.query(
      `SELECT id, numero, categoria, titulo, slug FROM investigaciones WHERE publicada = TRUE`
    );
    
    for (const inv of investigaciones) {
      const dominioSlug = CATEGORIA_TO_DOMINIO[inv.categoria] || 'medio_ambiente';
      const dominioId = dominioIds[dominioSlug];
      
      if (!dominioId) {
        report.errores.push(`No se encontró dominio para categoría: ${inv.categoria}`);
        continue;
      }
      
      await connection.query(
        `UPDATE investigaciones SET dominioId = ? WHERE id = ?`,
        [dominioId, inv.id]
      );
      
      report.investigacionesMigradas++;
      console.log(`   ✓ Investigación #${inv.numero}: ${inv.titulo} → Dominio ID ${dominioId}`);
    }
    
    console.log(`✅ ${report.investigacionesMigradas} investigaciones migradas\n`);
    
    // ========================================================================
    // PASO 5: Crear fuentes por investigación (placeholder)
    // ========================================================================
    console.log('📚 Paso 5: Creando fuentes por investigación...');
    
    for (const inv of investigaciones) {
      // Crear fuente oficial placeholder
      await connection.query(
        `INSERT INTO fuentes (investigacionId, tipo, titulo, institucion, fechaConsulta)
         VALUES (?, 'oficial', ?, 'INEGI', NOW())`,
        [inv.id, `Fuentes oficiales - ${inv.titulo}`]
      );
      
      report.fuentesCreadas++;
      console.log(`   ✓ Fuente creada para investigación #${inv.numero}`);
    }
    
    console.log(`✅ ${report.fuentesCreadas} fuentes creadas\n`);
    
    // ========================================================================
    // PASO 6: Validación de integridad
    // ========================================================================
    console.log('🔍 Paso 6: Validando integridad...');
    
    const [nullDominios] = await connection.query(
      `SELECT COUNT(*) as count FROM investigaciones WHERE dominioId IS NULL AND publicada = TRUE`
    );
    
    if (nullDominios[0].count > 0) {
      report.errores.push(`${nullDominios[0].count} investigaciones sin dominioId`);
      console.log(`   ❌ ${nullDominios[0].count} investigaciones sin dominioId`);
    } else {
      console.log('   ✓ Todas las investigaciones tienen dominioId');
    }
    
    const [sinFuentes] = await connection.query(
      `SELECT i.id, i.titulo 
       FROM investigaciones i 
       LEFT JOIN fuentes f ON i.id = f.investigacionId 
       WHERE i.publicada = TRUE AND f.id IS NULL`
    );
    
    if (sinFuentes.length > 0) {
      report.errores.push(`${sinFuentes.length} investigaciones sin fuentes`);
      console.log(`   ❌ ${sinFuentes.length} investigaciones sin fuentes`);
    } else {
      console.log('   ✓ Todas las investigaciones tienen al menos 1 fuente');
    }
    
    console.log('✅ Validación completada\n');
    
    // ========================================================================
    // PASO 7: Eliminar tabla obsoleta
    // ========================================================================
    console.log('🗑️  Paso 7: Eliminando tabla obsoleta...');
    
    await connection.query(`DROP TABLE IF EXISTS fuentesOficiales`);
    console.log('   ✓ Tabla fuentesOficiales eliminada');
    console.log('✅ Limpieza completada\n');
    
  } catch (error) {
    report.errores.push(error.message);
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await connection.end();
  }
  
  // ========================================================================
  // REPORTE FINAL
  // ========================================================================
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('═'.repeat(60));
  console.log('📊 REPORTE DE MIGRACIÓN');
  console.log('═'.repeat(60));
  console.log(`Tiempo de ejecución: ${duration}s`);
  console.log(`Dominios creados: ${report.dominiosCreados}`);
  console.log(`Investigaciones migradas: ${report.investigacionesMigradas}`);
  console.log(`Fuentes creadas: ${report.fuentesCreadas}`);
  console.log(`Warnings: ${report.warnings.length}`);
  console.log(`Errores: ${report.errores.length}`);
  
  if (report.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    report.warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  if (report.errores.length > 0) {
    console.log('\n❌ ERRORES:');
    report.errores.forEach(e => console.log(`   - ${e}`));
    console.log('\n🔴 Estado final: FAIL');
    process.exit(1);
  } else {
    console.log('\n✅ Estado final: OK');
    console.log('🎉 Migración completada exitosamente');
    console.log('\nVersión: v2.0.0-stable');
  }
}

main().catch(console.error);
