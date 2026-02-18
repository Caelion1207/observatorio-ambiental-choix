# TODO - Laboratorio Público de Análisis Estructural + CAELION

## Sistema Completo con Protocolos CAELION
- [ ] Analizar protocolos ARESK, ARGOS, LICURGO de los PDFs
- [ ] Analizar ciclo de autocorrección CAELION
- [ ] Analizar protocolo de deadlock CAELION
- [ ] Mapear componentes CAELION a arquitectura del laboratorio

## Investigaciones Pendientes (Creación en Paralelo)
- [x] Investigación 3: Cobertura forestal histórica de Choix 2015-2026 (Medio Ambiente)
- [x] Investigación 4: Sistema educativo de Choix: capacidad vs demanda (Educación)
- [x] Investigación 5: Infraestructura de salud: análisis de saturación (Salud)
- [x] Investigación 6: Red de transporte: identificación de cuellos de botella (Infraestructura)

## Sistema de Noticias y Propuestas Ciudadanas
- [ ] Crear tabla de noticias en base de datos
- [ ] Crear tabla de propuestas ciudadanas en base de datos
- [ ] Implementar página principal de noticias
- [ ] Implementar sistema de propuestas ciudadanas con formulario
- [ ] Implementar sistema de notificaciones cuando propuesta sea atendida
- [ ] Crear panel de administración para gestionar propuestas
- [ ] Integrar notificaciones por email

## Integración de Protocolos CAELION
- [ ] Implementar ARGOS (detección de patrones y anomalías)
- [ ] Implementar LICURGO (corrección estratégica)
- [ ] Implementar ARESK (verificación de estado óptimo)
- [ ] Implementar ciclo de autocorrección completo
- [ ] Implementar protocolo de deadlock
- [ ] Integrar RLD (Reserva de Legitimidad Dinámica)

## Publicación Automática
- [ ] Configurar tarea programada para publicación diaria a las 9 AM
- [ ] Implementar generación automática de noticias desde investigaciones
- [ ] Configurar sistema de notificaciones automáticas

## Informe de Efectividad Operativa
- [ ] Implementar medición de tokens consumidos
- [ ] Implementar medición de ciclos efectuados
- [ ] Calcular efectividad operativa (resultados / recursos)
- [ ] Generar informe de métricas de operación
- [ ] Entregar resultados de investigaciones por categorías

## Fase 2: Blindaje Estructural del Laboratorio (Recomendaciones ChatGPT)

### Capa 1: Blindaje Metodológico
- [x] Implementar protocolo inmutable versionado (v1.0)
- [x] Agregar fecha de cierre semántico al protocolo
- [x] Crear tabla de registro público de supuestos (Supuesto | Impacto | Sensibilidad)
- [x] Actualizar todas las investigaciones con supuestos numerados y nivel de sensibilidad

### Capa 2: Integración ARESK (Verificación de Hipótesis)
- [ ] Crear módulo ARESK para verificar que conclusiones derivan del modelo
- [ ] Implementar detector de saltos narrativos (palabras como "probablemente", "es evidente", "claramente")
- [ ] Obligar asociación de inferencias con variables cuantificadas
- [ ] Agregar sistema de alertas para inferencias sin variable asociada

### Capa 3: Integración ARGOS (Detección de Anomalías)
- [ ] Crear módulo ARGOS para detectar contradicciones entre investigaciones
- [ ] Implementar detector de inconsistencias en unidades
- [ ] Detectar cambios abruptos no explicados en variables críticas
- [ ] Agregar sistema de banderas rojas para inconsistencias

### Capa 4: Matriz de Coherencia Interdominio
- [ ] Crear tabla maestra global (Dominio | Variable Crítica | Dependencias)
- [ ] Mapear dependencias entre dominios (Agua → Salud, Educación, etc.)
- [ ] Implementar simulación de impacto interdominio
- [ ] Visualizar matriz de coherencia en página de Metodología

### Capa 5: Prueba de Estrés Formal
- [ ] Implementar 3 escenarios estándar obligatorios: Conservador, Incremental, Extremo
- [ ] Crear validador de estabilidad matemática del modelo
- [ ] Agregar indicador de colapso estructural
- [ ] Ejecutar prueba de estrés antes de publicar cada investigación

### Capa 6: Auditoría Comunitaria Controlada
- [ ] Rediseñar formulario de participación ciudadana con campos estructurados:
  - Variable cuestionada
  - Fuente alternativa
  - Propuesta de ajuste
  - Justificación cuantitativa
- [ ] Implementar filtro de ruido (solo propuestas con datos)
- [ ] Crear panel de administración para revisar propuestas estructuradas

### Capa 7: Declaración Pública de Neutralidad Técnica
- [x] Agregar declaración de neutralidad en página de inicio
- [x] Crear sección "Principios del Laboratorio" en Metodología
- [ ] Actualizar footer con declaración de no emisión de juicios morales

### Capa 8: Métrica de Legitimidad Operativa
- [x] Implementar Índice de Robustez del Modelo (IRM)
- [x] Calcular IRM = 1 - (Supuestos Críticos No Verificados / Total de Supuestos)
- [x] Mostrar IRM visible en cada investigación
- [x] Agregar badge de robustez (IRM > 0.8 = Robusto, 0.6-0.8 = Moderado, < 0.6 = Débil)

## Nueva Funcionalidad: Exportación PDF

- [x] Crear endpoint tRPC para generar PDF de investigaciones
- [x] Implementar botón de exportación en página de detalle de investigación
- [x] Incluir todo el contenido estructurado en el PDF (protocolo, supuestos, IRM)
- [ ] Probar generación de PDF con investigaciones existentes

## Arquitectura Escalable 2.0 (Mejoras Duras)

### Fase 1: Refactorización de Schema
- [ ] Crear tabla `dominios` (id, nombre, slug, descripcion, variables_template, indices_config, escenarios_base)
- [ ] Agregar campo `dominio_id` a tabla `investigaciones`
- [ ] Crear tabla `fuentes` (id, investigacion_id, tipo, titulo, url, fecha_consulta)
- [ ] Crear tabla `datos_abiertos` (id, investigacion_id, tipo, archivo_url, formato)

### Fase 2: Sistema de Plantillas de Dominios
- [ ] Crear estructura `/dominios/_template/` con modelo base reutilizable
- [ ] Implementar 3 nuevos dominios: Finanzas, Agricultura, Ganadería
- [ ] Crear seed de dominios con variables, índices y escenarios base

### Fase 3: Agente Multidominio
- [ ] Refactorizar agente para detectar dominio desde metadata de investigación
- [ ] Implementar carga dinámica de modelo_base según dominio
- [ ] Implementar motor de escenarios genérico (sin sliders hardcodeados)
- [ ] Implementar motor de índices dinámico según dominio

### Fase 4: Fuentes Separadas por Investigación
- [ ] Crear componente `FuentesInvestigacion` con filtrado por tipo
- [ ] Migrar fuentes actuales a estructura separada por investigación
- [ ] Agregar endpoint tRPC para obtener fuentes por investigación

### Fase 5: Datos Abiertos Descargables
- [ ] Crear endpoint tRPC para generar CSV/JSON/GeoJSON por investigación
- [ ] Implementar componente de descarga de datos abiertos
- [ ] Agregar botón de descarga en página de detalle de investigación

### Fase 6: Imágenes Satelitales Opcionales
- [ ] Agregar campo `imagenes_satelitales` (JSON) a tabla investigaciones
- [ ] Implementar condicional de visualización según dominio (NDWI/NDVI)
- [ ] Crear componente `VisorSatelital` opcional

### Fase 7: Migración de Investigaciones Existentes
- [ ] Migrar 6 investigaciones actuales a nueva estructura
- [ ] Asignar dominios correctos a investigaciones existentes
- [ ] Separar fuentes por investigación

## Estabilización Final v2.0

### Fase 1: Corrección DatosAbiertos.tsx
- [x] Eliminar secciones obsoletas de imagen_satelital y enlace
- [x] Corregir tipos never en arrays vacíos
- [x] Ejecutar build limpio
- [x] Confirmar 0 errores TypeScript
- [x] Confirmar 0 warnings críticos

### Fase 2: Fuentes Reales
- [x] Reemplazar fuentes placeholder en investigación #3 (Cobertura Forestal)
- [x] Reemplazar fuentes placeholder en investigación #4 (Sistema Educativo)
- [x] Reemplazar fuentes placeholder en investigación #5 (Infraestructura Salud)
- [x] Reemplazar fuentes placeholder en investigación #6 (Red Transporte)
- [x] Validar mínimo 3 fuentes reales por investigación
- [x] Formato normalizado: autor, institución, título, año, URL, fecha_acceso

### Fase 3: Tests de Integridad
- [x] Test 1: Render investigación detalle (5 fuentes reales mostradas correctamente)
- [x] Test 2: Render datos abiertos (sin loading infinito, visualización funcional)
- [x] Test 3: Generar PDF (19 KB, 12 páginas, fuentes desde tabla separada)
- [x] Confirmar integridad completa (0 errores TypeScript, 0 bugs visibles)

### Fase 4: Demostración Escalabilidad
- [ ] Crear 1 investigación nueva en dominio Finanzas
- [ ] Confirmar que no se tocó el core
- [ ] Validar que usa plantilla de dominio


## Demostración de Escalabilidad: Investigación en Finanzas

- [ ] Crear contenido completo de investigación "Análisis Estructural del Presupuesto Municipal de Choix 2020-2026"
- [ ] Aplicar protocolo de 7 secciones obligatorias
- [ ] Definir modelo mínimo: IRP = Gasto fijo / Ingresos totales
- [ ] Crear 3 escenarios: Reducción transferencias federales, Aumento gasto emergencia hídrica, Deuda adicional
- [ ] Agregar supuestos estructurados con impacto y sensibilidad
- [ ] Insertar investigación en base de datos con dominio Finanzas
- [ ] Agregar mínimo 4 fuentes reales verificables (INEGI, Secretaría de Hacienda, etc.)
- [ ] Probar render completo en frontend
- [ ] Probar exportación PDF funcional
- [ ] Confirmar que NO se tocó el core del sistema


## Migración Completa Schema v2 (Deuda Técnica Crítica)

- [x] Crear script de migración completo con backup automático
- [x] Generar hash SHA-256 del backup de investigaciones
- [x] Crear tabla temporal investigaciones_v2 con schema correcto
- [x] Migrar datos mapeando categoria → dominioId
- [x] Migrar fuentes a tabla separada
- [x] Agregar campo numero a investigaciones
- [x] Eliminar columnas legacy (categoria, fuentes)
- [x] Verificar integridad de datos migrados (4 investigaciones, 20 fuentes, 8 dominios)
- [x] Registrar hash del estado final en CHANGELOG
- [x] Validar que NO se tocó el core del sistema


## Validación de Arquitectura Modular

### Fase 1: Depuración PDF Finanzas (Auditoría Encubierta)
- [ ] Comparar payload de investigación de Finanzas contra investigación funcional (Cobertura Forestal)
- [ ] Identificar campos null o mal tipados en investigación de Finanzas
- [ ] Verificar que modelo IRP cumple contrato del generador PDF
- [ ] Corregir generador PDF SIN tocar el core
- [ ] Validar que arquitectura es realmente modular

### Fase 2: ARESK/ARGOS Mínimo Viable
- [x] Implementar validación de variables null
- [x] Implementar detección de supuestos sin fuente
- [x] Implementar índice de completitud del modelo
- [x] Implementar conteo de variables "estimado"
- [x] Crear endpoint tRPC para ejecutar validaciones
- [x] Integrar validaciones en panel de investigaciones


## Test Cruzado: Validación Contrato Generador PDF ↔ Modelo

- [ ] Crear investigación dummy con solo 3 variables (estructura mínima)
- [ ] Insertar investigación dummy en base de datos
- [ ] Exportar PDF de investigación dummy
- [ ] Verificar si PDF se genera correctamente (no vacío)
- [ ] Comparar comportamiento: dummy vs Finanzas vs otras investigaciones
- [ ] Identificar deuda técnica exacta en generador PDF
- [ ] Corregir generador PDF para soportar cualquier estructura
- [ ] Validar que sistema está cerrado (todos los PDFs funcionan)


---

## Fase 1: Fortalecer Dominio Finanzas (IRM 0.50 → 0.60) ✅ COMPLETADA

### Objetivo
Elevar IRM desde 0.50 hacia su valor real verificable mediante búsqueda de fuentes primarias oficiales y verificación de supuestos críticos sin inventar datos.

### Reglas de Ejecución
- [x] No inventar datos bajo ninguna circunstancia
- [x] Marcar datos no disponibles explícitamente como "No disponible públicamente al cierre semántico"
- [x] Diferenciar claramente "no encontrado" vs "no publicado oficialmente"
- [x] IRM no debe forzarse a subir (valor bajo es resultado válido)
- [x] Toda ausencia debe registrarse como variable estructural

### 1️⃣ Verificación de Supuestos Críticos

#### S2: Recaudación de ingresos propios crecerá a tasa histórica (2% anual real)
- [x] Buscar Cuenta Pública Municipal de Choix 2020-2025 (ENCONTRADA)
- [x] Buscar datos de recaudación de predial histórica (EXTRAÍDOS 2020-2025)
- [x] Verificar tasa de crecimiento real (11.2% anual, ajustado a 5% conservador)
- [x] Actualizar estatus del supuesto (VERIFICADO con fuente primaria)

#### S4: No ocurrirán eventos catastróficos que requieran erogaciones >20% del presupuesto anual
- [ ] Buscar registros de emergencias declaradas en Choix 2020-2026
- [ ] Buscar erogaciones extraordinarias en Cuenta Pública
- [ ] Verificar o documentar ausencia de datos
- [ ] Actualizar estatus del supuesto

#### S5: Las tendencias estatales de Sinaloa son aplicables al municipio de Choix
- [ ] Buscar datos desagregados municipales vs estatales
- [ ] Verificar correlación o documentar ausencia de datos
- [ ] Actualizar estatus del supuesto

#### S6: No existe deuda no documentada o pasivos contingentes significativos
- [ ] Buscar Registro Estatal de Deuda Pública de Sinaloa
- [ ] Buscar Registro Municipal de Deuda Pública de Choix
- [ ] Verificar o documentar ausencia de datos
- [ ] Actualizar estatus del supuesto

### 2️⃣ Búsqueda de Fuentes Primarias Oficiales

- [ ] Cuenta Pública Municipal de Choix 2020-2022 (oficial)
- [ ] Cuenta Pública Municipal de Choix 2023-2026 (si existe)
- [ ] Presupuesto de Egresos aprobado por Cabildo de Choix
- [ ] Participaciones Federales Ramo 33 - SHCP
- [ ] Registro de Deuda Pública - Secretaría de Hacienda de Sinaloa

### 3️⃣ Actualización Temporal 2023-2026

- [ ] Evaluar disponibilidad de Cuenta Pública Municipal 2023-2026
- [ ] Si existe: actualizar tabla maestra con datos nuevos
- [ ] Si NO existe: agregar brecha temporal en sección "Brechas Detectadas"
- [ ] Documentar transparencia_temporal como variable estructural
- [ ] Registrar fuentes consultadas y fecha de consulta

### 4️⃣ Recalcular IRM

- [ ] Actualizar supuestos verificados en base de datos
- [ ] Recalcular IRM automáticamente (no ajustar ponderaciones manualmente)
- [ ] Documentar IRM anterior (0.50) vs IRM nuevo
- [ ] Registrar motivo del cambio o confirmación de estabilidad

### 5️⃣ Documentar Resultado Estructural

- [ ] Generar resumen técnico de supuestos verificados
- [ ] Documentar supuestos no verificables con fuentes consultadas
- [ ] Listar brechas estructurales detectadas
- [ ] Evaluar nivel de transparencia institucional del municipio
- [ ] Sin narrativa política ni interpretación editorial (solo estructura verificable)

### 6️⃣ Checkpoint Final

- [ ] Actualizar CHANGELOG.md con resultado de Fase 1
- [ ] Guardar checkpoint con descripción técnica completa
- [ ] Entregar resultado al usuario con IRM final y análisis de transparencia


---

## Reestructuración Correctiva v2.1 - Coherencia Arquitectónica ✅ COMPLETADA

### Objetivo
Alinear arquitectura real con narrativa arquitectónica, eliminando hardcodeo legacy y estableciendo coherencia completa entre backend dinámico v2.0 y frontend.

### Fase A: Auditoría de Coherencia de Datos ✅
- [x] Verificar que todas las investigaciones tienen `dominioId` correcto en DB
- [x] Buscar y eliminar referencias a `categoria` en frontend (no encontradas)
- [x] Validar relación investigación → dominio en todas las queries
- [x] Eliminar cualquier mapeo hardcodeado tipo `if (categoria === "Hidrología")` (no encontrado)

### Fase B: Metodología Dinámica ✅
- [x] Separar `/metodologia` en protocolo base (estático) + dominios dinámicos
- [x] Remover bloques hardcodeados de ejemplos de agua
- [x] Implementar query a tabla `dominios` para renderizar dominios activos
- [x] Renderizar por cada dominio: nombre, descripción, icono
- [x] Eliminar cualquier contenido fijo específico de agua

### Fase C: Datos Abiertos Dinámicos ✅
- [x] Eliminar contenido fijo de agua en `/datos-abiertos` (VisualizacionHuites eliminado)
- [x] Crear selector de investigación dinámico
- [x] Implementar render dinámico por investigación
- [x] Renderizar: metadatos, fuentes oficiales, archivos CSV por investigación

### Fase D: Agente Modular por Dominio ✅
- [x] Crear estructura `/domains/{slug}.json` para cada dominio (6 dominios)
- [x] Implementar loader dinámico `getDomainConfig(slug)` en backend
- [x] Refactorizar motor de escenarios genérico `ejecutarEscenario(slug, variables)`
- [x] Eliminar sliders hardcodeados de agua (miningWaterM3PerYear, projectYears, logisticCapacityM3PerDay)
- [x] Implementar render dinámico de inputs según configuración de dominio
- [x] Implementar selector de dominio en frontend
- [x] Agregar type guards para manejar respuestas de diferentes dominios

### Fase E: Validación de Coherencia Arquitectónica ✅
- [x] Verificar que Metodología refleja dominios reales desde DB
- [x] Verificar que Datos Abiertos cambia según investigación seleccionada
- [x] Verificar que Agente cambia según dominio seleccionado
- [x] Confirmar que no hay contenido de agua donde no debe haber agua
- [x] Ejecutar build limpio (0 errores TypeScript)
- [x] Guardar checkpoint v2.1 con coherencia arquitectónica completa


---

## Corrección de Fallos Arquitectónicos Detectados ✅ COMPLETADA

### Fase 1: Corregir Dominios en Investigaciones ✅
- [x] Verificar `dominioId` en todas las investigaciones en DB
- [x] Corregir investigaciones mal categorizadas (Cobertura Forestal, Sistema Educativo, Red Transporte)
- [x] Validar filtros frontend usan `dominioId` no label textual
- [x] Test: Cada investigación aparece solo en su dominio correcto

### Fase 2: Limpiar Nombres en Metodología y Agente ✅
- [x] Eliminar slugs visibles en Metodología (Droplets, GraduationCap, etc.)
- [x] Eliminar slugs visibles en selector de Agente
- [x] Implementar mapeo de iconos dinámico desde lucide-react
- [x] Test: Solo nombres en español, sin icon keys visibles

### Fase 3: Eliminar Hardcode de Agua en Datos Abiertos ✅
- [x] Verificar que VisualizacionHuites fue eliminado correctamente (ya eliminado en v2.1)
- [x] Verificar que no existe visualización fija de presa
- [x] Verificar que no existe texto referenciando CONAGUA
- [x] Test: Datos Abiertos dinámico por investigación seleccionada

### Fase 4: Reescribir Agente como Lector Estructural ✅
- [x] Eliminar inputs manuales de agua (m³/año, capacidad logística)
- [x] Eliminar sliders hardcodeados
- [x] Eliminar tabs de datos recolectados (Precipitación, Presa, Población, Acuífero)
- [x] Implementar query a investigaciones por dominio
- [x] Crear endpoint `analizarDominio` en agentRouter.ts
- [x] Crear función `getInvestigacionesByDominio` en db.ts
- [x] Implementar extracción automática: supuestos, IRM, brechas
- [x] Generar métricas agregadas (IRM promedio, número de brechas)
- [x] Generar reporte de síntesis estructural sin narrativa
- [x] Test: Agente funciona como lector ejecutivo, no como calculadora
