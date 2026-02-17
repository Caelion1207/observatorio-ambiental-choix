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
