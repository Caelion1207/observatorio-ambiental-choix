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
