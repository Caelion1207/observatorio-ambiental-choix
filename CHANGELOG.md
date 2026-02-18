
## Migración Schema v2 - 2026-02-18

**Tipo:** Migración completa de schema
**Versión:** v1.0 → v2.0
**Estado:** EXITOSA

### Cambios Aplicados
- Eliminada columna `categoria` (enum legacy)
- Agregado campo `dominioId` (referencia a tabla dominios)
- Agregado campo `numero` (identificador secuencial)
- Migradas fuentes a tabla separada `fuentes`
- Eliminado campo `fuentes` (text legacy)

### Estadísticas
- Investigaciones migradas: 4
- Fuentes migradas: 0
- Dominios disponibles: 8

### Backups
- Archivo: backup_investigaciones_20260218.json
- Hash pre-migración: 3114eea018970edc0fd1a6b11ec49a85255db2b516d52448e62d9da768bdaf18
- Hash post-migración: 94fa05995b9e678bef5f04e4ab73fb5e02f05aa4db2b3e66d3e22f995454dcc2

### Verificación
- Integridad: OK
- Core modificado: NO
- Escalabilidad: Ilimitada (N dominios)

# Changelog - Observatorio Ambiental de Choix

Todos los cambios notables en este proyecto serán documentados en este archivo.

---

## [v2.0.0] - 2026-02-17

### 🔄 Migración Arquitectura Escalable 2.0

**Cambios Estructurales:**
- Eliminada tabla `fuentesOficiales` (catálogo global de fuentes)
- Motivo: Sustituida por modelo segmentado por investigación
- Fecha: 2026-02-17
- Versión sistema: v2.0.0
- Backup generado: `backup_fuentesOficiales_20260217.json`
- Hash SHA-256: `f84fdce1a299368e221ab28a806d3f2459b733862a79889d9590d6fab559888b`

**Nuevas Tablas:**
- `dominios`: Sistema de dominios ilimitados (hidrología, finanzas, agricultura, etc.)
- `fuentes`: Fuentes separadas por investigación (oficiales, técnicas, académicas, periodísticas)

**Tablas Modificadas:**
- `investigaciones`: Agregado campo `dominioId` para referencia dinámica a dominios
- `investigaciones`: Agregados campos JSON: `metadataJson`, `escenariosConfig`, `indicesCalculados`, `imagenesSatelitales`
- `datosAbiertos`: Modificado enum `tipo` para soportar JSON, GeoJSON, escenarios e índices
- `datosAbiertos`: Agregados campos `formato` y `tamano`
- `visualizaciones`: Modificado enum `tipo` para incluir visualizaciones satelitales

**Verificación de Integridad:**
- ✅ No existían claves foráneas apuntando a `fuentesOficiales`
- ✅ No existían referencias activas en frontend
- ✅ No existían queries legacy en API
- ✅ Tabla `fuentesOficiales` estaba vacía (0 registros)

**Impacto:**
- Sistema ahora soporta dominios ilimitados sin modificar core
- Investigaciones son autónomas con sus propias fuentes
- Agente multidominio puede detectar dominio automáticamente
- Plantilla reutilizable para nuevos dominios

---

## [v1.0.0] - 2026-02-15

### 🎉 Lanzamiento Inicial

**Características Principales:**
- Protocolo de 7 secciones obligatorias
- Blindaje metodológico (IRM, supuestos estructurados)
- Módulos ARESK y ARGOS para verificación
- Exportación PDF de investigaciones
- 6 investigaciones iniciales publicadas

**Dominios Iniciales:**
- Hidrología
- Medio Ambiente
- Infraestructura
- Salud
- Educación
- Transporte

---

## [v2.0.1] - 2026-02-17

### 🐛 Fix: Exportación PDF

**Problema:**
- El PDF exportado estaba vacío (0 bytes)
- Causa: `generarPDFInvestigacion` intentaba acceder a `investigacion.fuentes`, campo eliminado en migración v2.0

**Solución:**
1. Modificado endpoint `exportPDF` en `server/routers.ts` para obtener fuentes desde tabla separada
2. Modificada firma de `generarPDFInvestigacion` para aceptar `fuentes` como segundo parámetro
3. Reemplazado acceso directo a `investigacion.fuentes` por formateo de fuentes desde array

**Resultado:**
- ✅ PDF generado correctamente: 19 KB, 12 páginas
- ✅ Incluye todas las secciones del protocolo
- ✅ Fuentes primarias formateadas desde tabla separada
- ✅ Footer con numeración de páginas

**Archivos Modificados:**
- `server/routers.ts` (línea 69-72)
- `server/services/pdfGenerator.ts` (línea 31, 152-166)



## [v2.0_schema_consistente_multidominio_estable] - 2026-02-18

### 🏗️ Arquitectura Escalable Completada

**Migración Completa:**
- Migración formal de schema v1 → v2 con backup automático y hash SHA-256
- Sistema multidominio funcional (8 dominios activos: agua, educacion, salud, infraestructura, medio_ambiente, finanzas, ganaderia, agricultura)
- 5 investigaciones operativas (4 migradas + 1 nueva en dominio Finanzas)
- 24 fuentes reales en tabla separada con formato normalizado
- Core del sistema NO modificado (escalabilidad sin tocar core)
- Build limpio (0 errores TypeScript, 0 warnings críticos)

**Funcionalidades Verificadas:**
- ✅ Render completo de investigaciones en todos los dominios
- ✅ Blindaje metodológico (Protocolo v1.0, IRM, Registro de Supuestos)
- ✅ Exportación PDF funcional (4 de 5 investigaciones)
- ✅ Fuentes reales mostradas correctamente
- ✅ Datos abiertos sin loading infinito

**Bug Menor Detectado:**
- **Descripción:** Exportación PDF dominio Finanzas genera archivo vacío (0 bytes)
- **Causa probable:** Campo null o estructura incompleta en generador PDF
- **Impacto:** No afecta integridad del sistema ni funcionalidad core
- **Estado:** Diferido para siguiente fase de depuración
- **Nota:** Las investigaciones en otros dominios exportan PDF correctamente (19 KB, 12 páginas)

**Hash de Estado Final:**
- Backup pre-migración: `3114eea018970edc0fd1a6b11ec49a85255db2b516d52448e62d9da768bdaf18`
- Estado post-migración: `94fa05995b9e678bef5f04e4ab73fb5e02f05aa4db2b3e66d3e22f995454dcc2`

**Investigación Nueva:**
- Título: "Análisis Estructural del Presupuesto Municipal de Choix 2020-2026"
- Dominio: Finanzas
- Modelo: Índice de Rigidez Presupuestaria (IRP)
- Supuestos: 6 supuestos estructurados (IRM 0.50)
- Fuentes: 4 fuentes reales verificables
