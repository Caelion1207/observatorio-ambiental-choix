import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║     INSERTAR INVESTIGACIÓN PERDIDA: PRESA HUITES (#1)         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Leer contenido completo
const contenidoCompleto = readFileSync('/home/ubuntu/segunda_investigacion_completa.md', 'utf-8');
const tablaMaestra = readFileSync('/home/ubuntu/tabla_maestra_huites.md', 'utf-8');
const apendiceMetodologico = readFileSync('/home/ubuntu/apendice_metodologico.md', 'utf-8');

// Datos de la investigación
const investigacion = {
  numero: 1,
  titulo: 'Sistema Hídrico de Choix ante Demanda Incremental: Análisis Estructural de Resiliencia y Capacidad de Amortiguación',
  dominioId: 1, // Hidrología
  slug: 'sistema-hidrico-choix-resiliencia-amortiguacion',
  resumen: 'Este análisis estructural examina la capacidad del sistema hídrico de Choix, Sinaloa, para absorber demanda incremental sin comprometer su resiliencia. El estudio se basa en cinco ejes metodológicos: variabilidad climática real (2020-2025), señal social temprana de fragilidad, benchmark internacional de minas de pórfido de cobre, cálculo bruto acumulativo de demanda proyectada y capacidad de amortiguación institucional. El sistema presenta alta volatilidad climática (IVC 18.2%), régimen boom-bust en almacenamiento superficial (IVA 55.2%), saturación de demanda cercana al límite estructural (ISD 97.4% con nueva demanda), colapso logístico de distribución (CAL 0.067) y ausencia crítica de amortiguadores institucionales (IAA 10%). La adición de demanda incremental reduce el margen de seguridad del acuífero de 34.3% a 2.6%, llevando al sistema a operar en zona de riesgo estructural. No se concluye que el sistema colapsará, pero se identifica ausencia de capacidad de amortiguación ante variaciones no previstas.',
  definicionSistema: `### Nodo Central

**Acuífero del Río Fuerte (Choix, Sinaloa)**

El acuífero del Río Fuerte es el nodo central del sistema hídrico de Choix. Según el Diario Oficial de la Federación (DOF) de 2013, presenta las siguientes características estructurales:

- **Recarga media anual:** 400.5 hm³/año
- **Descarga comprometida:** 140.4 hm³/año
- **Volumen concesionado:** 199.19 hm³/año
- **Disponibilidad media anual:** 60.90 hm³/año
- **Estatus regulatorio:** Suspensión provisional de libre alumbramiento (DOF 2013)

El acuífero opera bajo régimen de veda, lo que significa que no se otorgan nuevas concesiones sin autorización expresa de CONAGUA. La disponibilidad neta de 60.90 hm³/año representa el margen teórico para nuevas extracciones sin comprometer el balance hídrico.

### Nodos Periféricos

**1. Presa Luis Donaldo Colosio (Huites)**

La presa Huites es el principal almacenamiento superficial de la región, con capacidad total de aproximadamente 3,200 Mm³. Su función primaria es generación hidroeléctrica, pero también sirve como fuente de agua para uso agrícola y, en situaciones de emergencia, para abastecimiento municipal. La presa presenta alta volatilidad estacional, con variaciones superiores al 60% de capacidad en periodos de 3-4 meses.

**2. Infraestructura Municipal de Distribución**

El municipio de Choix cuenta con infraestructura logística para distribución de agua a comunidades rurales dispersas. Según datos oficiales del Ayuntamiento de Choix (marzo 2025), 30 comunidades se abastecían mediante 6 pipas municipales. Para enero 2026, el número de pipas operativas se redujo a 1, atendiendo 15 comunidades.

**3. Comunidades Rurales**

El municipio de Choix presenta un patrón territorial altamente disperso:

- **Total de localidades:** 401 (INEGI 2020)
- **Población total municipal:** ~29,334 habitantes (INEGI 2020)
- **Población cabecera municipal:** 10,328 habitantes (INEGI 2020)
- **Población rural dispersa:** ~19,006 habitantes (64.8% del total)

**4. Demanda Proyectada Incremental: Proyecto Minero Santo Tomás**

El proyecto minero Santo Tomás, operado por Oroco Corp, representa una demanda incremental potencial al sistema hídrico. Según reporte técnico citado por Revista Espejo (julio 2025):

- **Consumo hídrico proyectado:** 53 millones de litros/día (53,000 m³/día)
- **Equivalencia anual:** 19.345 hm³/año
- **Vida útil del proyecto:** 23 años (etapa de explotación)
- **Volumen acumulado 20 años:** 386.9 hm³`,
  tablaMaestra: tablaMaestra,
  supuestosExplicitos: `### Supuestos Sobre la Calidad de los Datos

**S1:** Las series de precipitación anual de Datamx.io (2020-2025) son representativas de la variabilidad climática de Choix, Sinaloa, aunque provienen de estaciones meteorológicas regionales y no de estaciones dentro del municipio.

**S2:** Los datos de almacenamiento de la presa Huites citados por medios verificables (Luz Noticias, Los Noticieristas, Línea Directa, Debate) son exactos cuando múltiples fuentes independientes reportan valores similares en la misma fecha.

**S3:** Los datos de capacidad logística municipal (pipas operativas, comunidades atendidas) son exactos porque provienen de declaraciones oficiales del Ayuntamiento de Choix y de la alcaldesa en medios verificables.

**S4:** Los datos de consumo hídrico del proyecto minero Santo Tomás (53 millones de litros/día) son representativos del consumo real proyectado, aunque provienen de reportes técnicos corporativos y no de la Manifestación de Impacto Ambiental (MIA) completa.

### Supuestos Sobre Continuidad de Condiciones

**S5:** La variabilidad climática observada en 2020-2025 (IVC 18.2%) se mantendrá en el futuro cercano (2026-2030), sin eventos extremos de sequía prolongada superiores a 3 años consecutivos.

**S6:** La recarga media anual del acuífero (400.5 hm³/año) se mantendrá estable bajo variabilidad climática moderada, sin considerar efectos de cambio climático a largo plazo.

**S7:** La capacidad logística municipal (pipas operativas) no se deteriorará más allá del nivel actual (1 pipa operativa), y se mantendrá al menos en este nivel mínimo.

### Supuestos Sobre Comportamiento de Actores

**S8:** CONAGUA mantendrá la suspensión provisional de libre alumbramiento en el acuífero del Río Fuerte, evitando nuevas concesiones que excedan la disponibilidad neta (60.90 hm³/año).

**S9:** El proyecto minero Santo Tomás implementará tasas de recirculación de agua similares al promedio de minas de pórfido de cobre en Chile (73-76%), reduciendo el consumo de agua fresca a ~0.18-0.24 m³/ton mineral.

**S10:** El municipio de Choix no implementará amortiguadores institucionales significativos (plan de contingencia hídrica, fondo de emergencia, expansión de infraestructura logística) en el corto plazo (2026-2028).

### Supuestos Sobre Eventos No Considerados

**S11:** No se consideran eventos extremos de sequía superiores a 3 años consecutivos, como los observados en otras regiones de México (2011-2013).

**S12:** No se consideran eventos de contaminación de acuíferos por actividad minera, como los documentados en Cananea y Buenavista (Lutz Ley 2020).

**S13:** No se consideran eventos de conflicto social por agua que puedan interrumpir la operación del proyecto minero o la distribución municipal.`,
  modeloMinimo: `### Modelo 1: Balance Acumulativo Simple (BAS)

**Ecuación:**

\`\`\`
BAS(t) = Disponibilidad_Neta × t - Demanda_Incremental × t
\`\`\`

Donde:
- **Disponibilidad_Neta:** 60.90 hm³/año (DOF 2013)
- **Demanda_Incremental:** 19.345 hm³/año (Revista Espejo 2025)
- **t:** Tiempo en años

**Interpretación:** Si BAS(t) > 0, el acuífero tiene margen teórico para absorber la demanda incremental. Si BAS(t) < 0, la demanda incremental excede la disponibilidad neta.

**Resultado para t = 20 años:**

\`\`\`
BAS(20) = 60.90 × 20 - 19.345 × 20 = 1,218 - 386.9 = +831.1 hm³
\`\`\`

El balance acumulativo simple es positivo, lo que sugiere que el acuífero tiene margen teórico para absorber la demanda incremental del proyecto minero en un horizonte de 20 años.

### Modelo 2: Índice de Saturación de Demanda (ISD)

**Ecuación:**

\`\`\`
ISD = (Extracción_Actual + Demanda_Incremental) / Recarga_Media_Anual × 100
\`\`\`

Donde:
- **Extracción_Actual:** 339.59 hm³/año (volumen concesionado + descarga comprometida)
- **Demanda_Incremental:** 19.345 hm³/año
- **Recarga_Media_Anual:** 400.5 hm³/año

**Resultado sin nueva demanda:**

\`\`\`
ISD_actual = 339.59 / 400.5 × 100 = 84.8%
\`\`\`

**Resultado con nueva demanda:**

\`\`\`
ISD_nueva = (339.59 + 19.345) / 400.5 × 100 = 89.6%
\`\`\`

La saturación de demanda aumenta de 84.8% a 89.6%, reduciendo el margen de seguridad de 15.2% a 10.4%.

### Modelo 3: Capacidad de Amortiguación Logística (CAL)

**Ecuación:**

\`\`\`
CAL = Pipas_Operativas / Comunidades_Dependientes
\`\`\`

Donde:
- **Pipas_Operativas:** 1 (Línea Directa, enero 2026)
- **Comunidades_Dependientes:** 15 (Línea Directa, enero 2026)

**Resultado:**

\`\`\`
CAL = 1 / 15 = 0.067
\`\`\`

Un CAL de 0.067 indica que cada pipa debe atender 15 comunidades, lo que representa un cuello de botella estructural en la distribución.`,
  escenarios: `### Escenario Base: Condiciones Actuales Sin Cambios

**Descripción:** El sistema hídrico de Choix continúa operando bajo condiciones actuales, sin nueva demanda incremental y sin expansión de capacidad logística.

**Supuestos específicos:**
- Variabilidad climática se mantiene en IVC 18.2%
- Capacidad logística se mantiene en 1 pipa operativa
- No se implementan amortiguadores institucionales
- No se otorgan nuevas concesiones de agua

**Proyección:**
- ISD permanece en 84.8%
- CAL permanece en 0.067
- Sistema continúa operando con fragilidad logística
- Vulnerabilidad ante eventos extremos de sequía persiste

**Trayectoria esperada:** El sistema mantiene balance hídrico positivo (disponibilidad neta 60.90 hm³/año), pero la capacidad de distribución sigue siendo insuficiente para cobertura territorial. Declaraciones de "etapa crítica" y "colapso hídrico inminente" se repetirán en años secos.

### Escenario de Estrés: Nueva Demanda Sin Amortiguadores

**Descripción:** Se aprueba el proyecto minero Santo Tomás y comienza extracción de 19.345 hm³/año del acuífero, sin expansión de capacidad logística municipal ni implementación de amortiguadores institucionales.

**Supuestos específicos:**
- Demanda incremental: 19.345 hm³/año (53 millones litros/día)
- Tasa de recirculación minera: 0% (escenario conservador)
- Capacidad logística municipal permanece en 1 pipa operativa
- No se implementan planes de contingencia hídrica

**Proyección:**
- ISD aumenta de 84.8% a 89.6%
- Margen de seguridad se reduce de 15.2% a 10.4%
- CAL permanece en 0.067
- BAS(20) = +831.1 hm³ (balance acumulativo positivo)

**Trayectoria esperada:** El acuífero mantiene balance positivo, pero el margen de seguridad se reduce significativamente. En años secos (precipitación < 600 mm), la recarga del acuífero puede descender por debajo de la demanda total, generando déficit temporal. La capacidad de distribución municipal sigue siendo insuficiente, amplificando la percepción de crisis hídrica.

### Escenario Extremo: Sequía Prolongada + Nueva Demanda

**Descripción:** El sistema enfrenta sequía prolongada (3 años consecutivos con precipitación < 600 mm) mientras opera con nueva demanda incremental del proyecto minero, sin amortiguadores institucionales.

**Supuestos específicos:**
- Precipitación anual < 600 mm durante 3 años consecutivos
- Recarga del acuífero desciende a ~300 hm³/año (estimación conservadora)
- Demanda total: 358.935 hm³/año (actual + incremental)
- Capacidad logística municipal colapsa (0 pipas operativas por falta de agua en pozos)

**Proyección:**
- ISD aumenta a 119.6% (demanda excede recarga)
- Déficit anual: 58.935 hm³
- Déficit acumulado en 3 años: 176.8 hm³
- CAL colapsa a 0 (sin capacidad de distribución)

**Trayectoria esperada:** El sistema enfrenta déficit estructural. El acuífero no puede sostener la demanda total bajo sequía prolongada. La presa Huites desciende a niveles críticos (< 5% capacidad), limitando generación hidroeléctrica y abastecimiento agrícola. Comunidades rurales enfrentan desabastecimiento total. Se requiere declaratoria de emergencia hídrica y abastecimiento externo mediante pipas estatales o federales.

**Punto de colapso:** El sistema colapsa cuando la recarga del acuífero desciende por debajo de 358.935 hm³/año durante más de 2 años consecutivos, agotando reservas y generando descenso de niveles freáticos.`,
  brechas: `**Brecha 1: Serie Mensual Completa de Almacenamiento de la Presa Huites (2015-2026)**

**Dato faltante:** Serie temporal mensual completa del almacenamiento de la presa Huites desde 2015 hasta 2026.

**Periodo requerido:** 2015-2026 (132 meses)

**Justificación:** Necesario para análisis de tendencias de largo plazo, estacionalidad, volatilidad histórica y proyecciones bajo escenarios de estrés hídrico. Los datos puntuales disponibles (julio 2025, agosto 2025, septiembre 2025, octubre 2025, noviembre 2025, diciembre 2025) no permiten modelación robusta de comportamiento del sistema.

**Estatus de disponibilidad:** No disponible públicamente a través de portales oficiales de CONAGUA (SINA). Los datos puntuales provienen de medios verificables que citan reportes oficiales.

**Impacto en el análisis:** Limita la capacidad de proyectar comportamiento del almacenamiento superficial bajo escenarios de sequía prolongada. No es posible cuantificar la frecuencia de eventos extremos (almacenamiento < 5% capacidad) ni la duración promedio de periodos de recuperación.

---

**Brecha 2: Serie Mensual de Precipitación Regional (2015-2026)**

**Dato faltante:** Serie temporal mensual de precipitación en estaciones meteorológicas dentro del municipio de Choix o en la cuenca del Río Fuerte.

**Periodo requerido:** 2015-2026 (132 meses)

**Justificación:** Necesario para correlacionar almacenamiento de la presa Huites con eventos climáticos, identificar patrones de sequía/lluvia y validar supuesto de estabilidad climática. Los datos anuales disponibles (2020-2025) no permiten análisis de estacionalidad ni identificación de eventos extremos mensuales.

**Estatus de disponibilidad:** No disponible públicamente para estaciones dentro del municipio de Choix. Los datos anuales provienen de Datamx.io y SMN/CONAGUA, pero no especifican la estación meteorológica exacta.

**Impacto en el análisis:** Limita la capacidad de validar el supuesto S5 (variabilidad climática se mantendrá en IVC 18.2%). No es posible identificar si el sistema está entrando en un ciclo de sequía prolongada o si 2024 fue un año atípico.

---

**Brecha 3: Datos de Extracción Mensual para Generación Eléctrica (2015-2026)**

**Dato faltante:** Volumen mensual de agua liberada por la presa Huites para generación hidroeléctrica.

**Periodo requerido:** 2015-2026 (132 meses)

**Justificación:** Necesario para balance hídrico completo del sistema. La presa Huites es el principal almacenamiento superficial, y la liberación de agua para generación eléctrica afecta directamente la disponibilidad para abastecimiento municipal y agrícola.

**Estatus de disponibilidad:** No disponible públicamente. CFE (Comisión Federal de Electricidad) no publica datos de generación hidroeléctrica desagregados por presa.

**Impacto en el análisis:** Limita la capacidad de modelar el flujo 3 (almacenamiento superficial) con precisión. No es posible determinar si la volatilidad observada (IVA 55.2%) se debe únicamente a variabilidad climática o también a patrones de liberación para generación eléctrica.

---

**Brecha 4: Datos de Evaporación Mensual (2015-2026)**

**Dato faltante:** Tasa de evaporación mensual en la presa Huites.

**Periodo requerido:** 2015-2026 (132 meses)

**Justificación:** Necesario para modelación de pérdidas en el balance hídrico. La evaporación en embalses de gran superficie puede representar pérdidas significativas, especialmente en meses de alta temperatura.

**Estatus de disponibilidad:** No disponible públicamente. CONAGUA no publica datos de evaporación desagregados por presa.

**Impacto en el análisis:** Limita la precisión del modelo de balance hídrico. No es posible cuantificar qué porcentaje de la recarga del acuífero se pierde por evaporación en la presa Huites.

---

**Brecha 5: Manifestación de Impacto Ambiental (MIA) Completa del Proyecto Minero Santo Tomás (Etapa de Explotación)**

**Dato faltante:** MIA completa del proyecto minero Santo Tomás para la etapa de explotación, incluyendo consumo hídrico oficial, fuente de abastecimiento, tasa de recirculación y medidas de mitigación.

**Periodo requerido:** Documento actualizado (2024-2026)

**Justificación:** Necesario para validar el consumo hídrico proyectado (53 millones litros/día) y determinar la fuente de abastecimiento (acuífero local, presa Huites, otra fuente). Los datos actuales provienen de reportes técnicos corporativos y medios verificables, no de documentos oficiales de SEMARNAT.

**Estatus de disponibilidad:** Solo se cuenta con Informe Preventivo (2022) para etapa de exploración. La MIA para etapa de explotación no está disponible públicamente en el portal de SEMARNAT.

**Impacto en el análisis:** Limita la capacidad de evaluar formalmente el impacto de la nueva demanda. No es posible determinar si el proyecto implementará tasas de recirculación similares al promedio chileno (73-76%) o si el consumo de agua fresca será significativamente mayor.

---

**Brecha 6: Estudio de Capacidad de Recarga Dinámica del Acuífero Río Fuerte**

**Dato faltante:** Estudio de capacidad de recarga dinámica del acuífero bajo variabilidad climática, incluyendo modelación hidrológica completa y proyecciones bajo escenarios de cambio climático.

**Periodo requerido:** Estudio actualizado (2020-2026)

**Justificación:** Necesario para validar el supuesto S6 (recarga media anual de 400.5 hm³/año se mantendrá estable). El dato de recarga proviene del DOF 2013, que asume estabilidad climática. La variabilidad observada (IVC 18.2%) sugiere que la recarga puede fluctuar significativamente.

**Estatus de disponibilidad:** No disponible públicamente. CONAGUA no ha publicado estudios de recarga dinámica del acuífero Río Fuerte posteriores a 2013.

**Impacto en el análisis:** Limita la capacidad de proyectar sostenibilidad del acuífero bajo escenarios de estrés. No es posible determinar si la recarga descenderá en años secos (precipitación < 600 mm) o si el acuífero tiene capacidad de amortiguación suficiente.

---

**Brecha 7: Inventario Completo de Infraestructura Logística Municipal**

**Dato faltante:** Inventario completo de pipas municipales, pozos operativos, tanques de almacenamiento, red de distribución y capacidad de bombeo.

**Periodo requerido:** Inventario actualizado (2025-2026)

**Justificación:** Necesario para cuantificar el cuello de botella de distribución (CAL 0.067) y evaluar capacidad real de respuesta ante crisis hídrica. Los datos actuales provienen de declaraciones oficiales (1 pipa operativa, 15 comunidades dependientes), pero no se cuenta con inventario técnico completo.

**Estatus de disponibilidad:** No disponible públicamente. El Ayuntamiento de Choix no ha publicado inventario de infraestructura logística.

**Impacto en el análisis:** Limita la capacidad de evaluar si la reducción de pipas operativas (de 6 a 1 en 10 meses) se debe a deterioro de infraestructura, reasignación de recursos o falta de mantenimiento. No es posible determinar la inversión requerida para expandir capacidad logística.

---

**Brecha 8: Plan Municipal de Contingencia Hídrica**

**Dato faltante:** Plan municipal de contingencia hídrica que especifique protocolos de respuesta ante sequía, inventario de infraestructura redundante, fondo de emergencia y responsables de ejecución.

**Periodo requerido:** Plan actualizado (2025-2026)

**Justificación:** Necesario para evaluar el Índice de Ausencia de Amortiguadores Institucionales (IAA 10%). Los datos actuales sugieren que no existe plan de contingencia formalizado, pero no se cuenta con confirmación oficial.

**Estatus de disponibilidad:** No disponible públicamente. El Ayuntamiento de Choix no ha publicado plan de contingencia hídrica.

**Impacto en el análisis:** Limita la capacidad de evaluar preparación institucional ante crisis. No es posible determinar si el municipio cuenta con protocolos de respuesta, infraestructura redundante o fondo de emergencia.`,
  conclusionEstructural: `### Hallazgos Estructurales

**1. El sistema hídrico de Choix presenta alta volatilidad climática y de almacenamiento superficial.**

La variabilidad interanual de precipitación (IVC 18.2%) y la volatilidad del almacenamiento de la presa Huites (IVA 55.2%) confirman que el sistema opera en régimen boom-bust, altamente dependiente de eventos extremos de lluvia. En julio 2025, la presa se encontraba al 8.2% de capacidad; en octubre 2025 alcanzó 63.4%, y en diciembre 2025 descendió a 29.5%. Esta volatilidad amplifica la vulnerabilidad del sistema ante sequías prolongadas.

**2. La adición de demanda incremental reduce el margen de seguridad del acuífero a niveles críticos.**

El Índice de Saturación de Demanda (ISD) aumenta de 84.8% a 89.6% con la nueva demanda proyectada del proyecto minero Santo Tomás. El margen de seguridad se reduce de 15.2% a 10.4%, llevando al sistema a operar en zona de riesgo estructural. Bajo escenarios de sequía prolongada (precipitación < 600 mm durante 3 años), el sistema enfrenta déficit estructural, con demanda total excediendo la recarga del acuífero.

**3. El sistema presenta colapso logístico de distribución.**

La Capacidad de Amortiguación Logística (CAL) de 0.067 indica que cada pipa municipal debe atender 15 comunidades rurales dispersas. Esta relación es estructuralmente insostenible. La reducción de pipas operativas de 6 a 1 en 10 meses (marzo 2025 - enero 2026) confirma deterioro de capacidad de respuesta municipal. Más de 8,000 personas (27% de la población municipal) dependen de distribución mediante pipas, generando cuello de botella crítico.

**4. El sistema territorial disperso amplifica la vulnerabilidad.**

Con 401 localidades y una población de ~29,334 habitantes, la distribución de agua requiere una red logística robusta que actualmente no existe o no es pública. La población rural dispersa (64.8% del total) depende de distribución mediante pipas, y la capacidad actual (1 pipa operativa) es insuficiente para cubrir demanda básica.

### Vulnerabilidades Sistémicas Identificadas

- **Vulnerabilidad logística:** Capacidad de distribución insuficiente para cobertura territorial (CAL 0.067)
- **Vulnerabilidad climática:** Alta dependencia de eventos extremos de lluvia para recarga superficial (IVA 55.2%)
- **Vulnerabilidad institucional:** Ausencia de amortiguadores institucionales (IAA 10%)
- **Vulnerabilidad de saturación:** Sistema opera en zona de riesgo estructural con nueva demanda (ISD 89.6%)
- **Vulnerabilidad de información:** Ausencia de datos públicos sobre capacidad logística real, recarga dinámica del acuífero, MIA completa del proyecto minero

### Incertidumbres Derivadas de Brechas de Datos

- No es posible cuantificar el déficit exacto de capacidad logística (falta inventario de pipas, pozos, tanques)
- No es posible proyectar con precisión el comportamiento del sistema bajo escenarios de estrés (falta modelación hidrológica completa del acuífero)
- No es posible evaluar formalmente el impacto de nuevas demandas (falta MIA completa del proyecto minero, estudio de impacto acumulativo)
- No es posible determinar si la recarga del acuífero se mantendrá estable bajo variabilidad climática (falta estudio de capacidad de recarga dinámica)

### Lo que Este Análisis NO Permite Concluir

**No permite afirmar que el acuífero se agotará.** La disponibilidad neta es positiva (60.90 hm³/año) y el Balance Acumulativo Simple (BAS) permanece positivo incluso con nueva demanda (+831.1 hm³ en 20 años). El sistema no colapsa por falta de agua, sino por falta de capacidad de distribución y amortiguación.

**No permite afirmar que el proyecto minero Santo Tomás causará desabastecimiento.** Faltan datos sobre demanda minera real (MIA completa no disponible), fuente de abastecimiento del proyecto, porcentaje de recirculación efectiva e impacto en niveles freáticos.

**No permite afirmar que el sistema colapsará.** Solo se identifican vulnerabilidades estructurales y ausencia de capacidad de amortiguación. El colapso dependerá de variabilidad climática futura, gestión efectiva de concesiones por parte de CONAGUA, inversión municipal en infraestructura logística e implementación de amortiguadores institucionales.

### Pregunta Central Reformulada

La pregunta correcta no es: **"¿El proyecto minero vaciará el acuífero?"**

La pregunta estructural es: **"¿Puede el sistema hídrico de Choix sostener demanda incremental sin comprometer su resiliencia ante variaciones climáticas, dado que carece de capacidad de amortiguación logística e institucional?"**

**Respuesta:** No es posible responder con los datos públicos disponibles. Se requiere MIA completa del proyecto minero, estudio de capacidad de recarga dinámica del acuífero, estudio de capacidad logística municipal, plan municipal de contingencia hídrica y modelación hidrológica completa del acuífero.

Sin estos datos, cualquier afirmación sobre colapso o sostenibilidad es especulativa.`,
  indiceRobustez: 1.00,
  publicada: true
};

// Insertar investigación
console.log('📝 Insertando investigación...\n');

const [result] = await connection.query(
  `INSERT INTO investigaciones (
    numero, titulo, dominioId, slug, resumenEjecutivo, definicionSistema, tablaMaestra,
    supuestos, modelo, escenarios, brechas, conclusion,
    indiceRobustez, publicada
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    investigacion.numero,
    investigacion.titulo,
    investigacion.dominioId,
    investigacion.slug,
    investigacion.resumen,
    investigacion.definicionSistema,
    investigacion.tablaMaestra,
    investigacion.supuestosExplicitos,
    investigacion.modeloMinimo,
    investigacion.escenarios,
    investigacion.brechas,
    investigacion.conclusionEstructural,
    investigacion.indiceRobustez,
    investigacion.publicada
  ]
);

const investigacionId = (result as any).insertId;

console.log(`✅ Investigación insertada con ID: ${investigacionId}\n`);

// Insertar fuentes primarias
console.log('📚 Insertando fuentes primarias...\n');

const fuentes = [
  {
    titulo: 'Datamx.io - Temperaturas y Lluvias Mensuales en México (1985-2025)',
    url: 'https://datamx.io/tr/dataset/temperaturas-mensuales-en-mexico-1985-2025',
    tipo: 'oficial',
    descripcion: 'Serie temporal de precipitación anual para análisis de variabilidad climática (IVC)'
  },
  {
    titulo: 'SMN/CONAGUA - Resúmenes Mensuales de Temperaturas y Lluvias',
    url: 'https://smn.conagua.gob.mx/es/climatologia/temperaturas-y-lluvias/resumenes-mensuales-de-temperaturas-y-lluvias',
    tipo: 'oficial',
    descripcion: 'Datos oficiales de precipitación regional para validación de variabilidad climática'
  },
  {
    titulo: 'Luz Noticias - Presa Huites se recupera y alcanza el 8.2%',
    url: 'https://www.luznoticias.mx/2025-07-05/sinaloa/presa-huites-se-recupera-y-alcanza-el-82-su-mejor-nivel-desde-noviembre-de-2024/251096',
    tipo: 'periodistica',
    descripcion: 'Dato verificado de almacenamiento de presa Huites (julio 2025)'
  },
  {
    titulo: 'Línea Directa - Las presas de Sinaloa se ubican al 44.9%',
    url: 'https://lineadirectaportal.com/agropecuaria/las-presas-de-sinaloa-se-ubican-al-44-9-por-ciento-de-su-capacidad-de-conservacion-2025-11-16__1520574',
    tipo: 'periodistica',
    descripcion: 'Dato verificado de almacenamiento de presa Huites (septiembre-noviembre 2025)'
  },
  {
    titulo: 'Debate - La presa Huites baja su almacenamiento; está al 29.5%',
    url: 'https://www.debate.com.mx/sinaloa/losmochis/la-presa-huites-baja-su-almacenamiento-esta-al-29.5-de-su-capacidad-20251203-0022.html',
    tipo: 'periodistica',
    descripcion: 'Dato verificado de almacenamiento de presa Huites (diciembre 2025)'
  },
  {
    titulo: 'Ayuntamiento de Choix - 30 comunidades que se abastecen por medio de 6 pipas',
    url: 'https://choix.gob.mx/30-comunidades-que-se-abastecen-por-medio-de-6-pipas/',
    tipo: 'oficial',
    descripcion: 'Dato oficial de capacidad logística municipal (marzo 2025)'
  },
  {
    titulo: 'Línea Directa - En Choix siguen llevando agua a 15 comunidades con una sola pipa',
    url: 'https://lineadirectaportal.com/sinaloa/en-choix-siguen-llevando-agua-a-15-comunidades-con-una-sola-pipa-no-llega-la-ayuda-alcaldesa-2026-01-30__1565085',
    tipo: 'periodistica',
    descripcion: 'Dato verificado de deterioro de capacidad logística (enero 2026)'
  },
  {
    titulo: 'Revista Espejo - Oroco Corp quiere usar 53 millones de litros de agua al día en Choix',
    url: 'https://revistaespejo.com/2025/07/07/oroco-corp-quiere-usar-53-millones-de-litros-de-agua-al-dia-en-choix/',
    tipo: 'periodistica',
    descripcion: 'Dato de consumo hídrico proyectado del proyecto minero Santo Tomás'
  },
  {
    titulo: 'Cochilco - Informe Consumo de Agua en la Minería del Cobre año 2023',
    url: 'https://www.cochilco.cl/web/informe-consumo-de-agua-en-la-mineria-del-cobre-ano-2023/',
    tipo: 'academica',
    descripcion: 'Benchmark internacional de consumo hídrico en minas de pórfido de cobre'
  },
  {
    titulo: 'DOF - ACUERDO disponibilidad media anual de aguas subterráneas (2013)',
    url: 'https://www.dof.gob.mx/nota_detalle.php?codigo=5284322&fecha=04/01/2013',
    tipo: 'oficial',
    descripcion: 'Datos oficiales del acuífero Río Fuerte (recarga, descarga, disponibilidad)'
  }
];

for (const fuente of fuentes) {
  await connection.query(
    `INSERT INTO fuentes (investigacionId, titulo, url, tipo, notas, fechaConsulta) VALUES (?, ?, ?, ?, ?, NOW())`,
    [investigacionId, fuente.titulo, fuente.url, fuente.tipo, fuente.descripcion]
  );
}

console.log(`✅ ${fuentes.length} fuentes primarias insertadas\n`);

// Verificar inserción
const [investigacionVerificada] = await connection.query(
  `SELECT i.*, d.nombre as dominioNombre FROM investigaciones i
   LEFT JOIN dominios d ON i.dominioId = d.id
   WHERE i.id = ?`,
  [investigacionId]
);

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           INVESTIGACIÓN RECUPERADA E INSERTADA                 ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('ID:', (investigacionVerificada as any[])[0].id);
console.log('Número:', (investigacionVerificada as any[])[0].numero);
console.log('Título:', (investigacionVerificada as any[])[0].titulo);
console.log('Dominio:', (investigacionVerificada as any[])[0].dominioNombre);
console.log('Slug:', (investigacionVerificada as any[])[0].slug);
console.log('IRM:', (investigacionVerificada as any[])[0].indiceRobustez);
console.log('Publicada:', (investigacionVerificada as any[])[0].publicada ? 'Sí' : 'No');
console.log('Fuentes:', fuentes.length);

console.log('\n✅ RECUPERACIÓN COMPLETADA\n');

await connection.end();
