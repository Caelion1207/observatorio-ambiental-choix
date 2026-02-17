import { drizzle } from "drizzle-orm/mysql2";
import { investigaciones } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const investigacionReestructurada = {
  titulo: "Sistema Hídrico de Choix: Análisis Estructural de Capacidad y Vulnerabilidad",
  slug: "sistema-hidrico-choix-analisis-estructural",
  resumenEjecutivo: `Este análisis estructural examina el sistema hídrico de Choix, Sinaloa, identificando sus componentes críticos, vulnerabilidades y brechas en datos públicos. El sistema presenta alta volatilidad en almacenamiento superficial (Presa Huites) y limitaciones estructurales en capacidad logística de distribución. No se cuenta con series históricas completas para modelación robusta.`,
  
  // Sección 1: Definición del Sistema
  contexto: `## 1. Definición del Sistema

### Nodo Central
**Presa Luis Donaldo Colosio (Huites)**
- Capacidad total: ~3,200 Mm³
- Función: Almacenamiento de agua superficial y generación hidroeléctrica
- Característica crítica: Alta volatilidad (variaciones >60% de capacidad en 3-4 meses)

### Nodos Periféricos
1. **Acuífero del Río Fuerte**
   - Recarga media anual: 400.5 hm³/año
   - Disponibilidad media anual: 60.90 hm³/año
   - Estatus: Suspensión provisional de libre alumbramiento (DOF 2013)

2. **Comunidades Rurales**
   - Total de localidades: 401
   - Población total municipal: ~29,334 habitantes
   - Población cabecera municipal: 10,328 habitantes
   - Característica: Sistema territorial altamente disperso

3. **Infraestructura Logística Municipal**
   - Número de pipas operativas: Desconocido (declaración de alcaldesa: 1 pipa para 12-13 comunidades)
   - Capacidad de transporte: No disponible públicamente

### Flujos
- **Flujo superficial:** Presa Huites → Generación eléctrica + Extracción para uso
- **Flujo subterráneo:** Acuífero Río Fuerte → Pozos concesionados
- **Flujo logístico:** Pipas municipales → Comunidades rurales sin acceso directo

### Variables Críticas
1. Almacenamiento de la Presa Huites (Mm³)
2. Disponibilidad del acuífero (hm³/año)
3. Capacidad logística de distribución (pipas operativas)
4. Demanda poblacional dispersa (localidades sin acceso directo)
5. Volatilidad climática (precipitación estacional)`,

  // Sección 2: Tabla Maestra de Datos
  datosOficiales: `## 2. Tabla Maestra de Datos

| Variable | Valor | Unidad | Fuente Primaria | Periodo | Estatus |
|----------|-------|--------|-----------------|---------|---------|
| Capacidad total Presa Huites | ~3,200 | Mm³ | CONAGUA | - | Verificado |
| Almacenamiento Enero 2025 | ~59 | Mm³ | CONAGUA | Enero 2025 | Verificado |
| Almacenamiento Septiembre 2025 | ~1,925 | Mm³ | CONAGUA | Septiembre 2025 | Verificado |
| Almacenamiento Enero 2026 | 556.3 | Mm³ | CONAGUA | Enero 2026 | Verificado |
| Recarga media anual acuífero | 400.5 | hm³/año | DOF 2013 | 2013 | Verificado |
| Descarga comprometida | 140.4 | hm³/año | DOF 2013 | 2013 | Verificado |
| Volumen concesionado | 199.19 | hm³/año | DOF 2013 | 2013 | Verificado |
| Disponibilidad media anual | 60.90 | hm³/año | DOF 2013 | 2013 | Verificado |
| Total localidades | 401 | localidades | INEGI | 2020 | Verificado |
| Población total municipal | ~29,334 | habitantes | INEGI | 2020 | Verificado |
| Población cabecera municipal | 10,328 | habitantes | INEGI | 2020 | Verificado |
| Concesión agua Minera Xochipala | No registrada | - | REPDA | 2026 | Verificado |
| MIA explotación minera | No aprobada | - | SEMARNAT | 2026 | Verificado |
| Pipas municipales operativas | Desconocido | unidades | - | - | No disponible |
| Capacidad por pipa | Desconocido | m³ | - | - | No disponible |
| Serie mensual Huites 2015-2026 | No disponible | Mm³ | - | - | No disponible |
| Precipitación mensual 2015-2026 | No disponible | mm | - | - | No disponible |

**Nota crítica:** Los datos posteriores a septiembre 2025 para la Presa Huites son limitados. La serie histórica completa mensual 2015-2026 no está disponible públicamente.`,

  // Sección 3: Supuestos Explícitos
  metodologia: `## 3. Supuestos Explícitos

### Supuestos sobre Datos
1. Los datos de CONAGUA, DOF, INEGI y REPDA son completos y representativos de las condiciones reales
2. Los datos de medios verificables que citan a CONAGUA son considerados verificados cuando múltiples fuentes independientes reportan el mismo valor
3. La ausencia de registro en REPDA indica ausencia de concesión otorgada

### Supuestos sobre Continuidad
4. Las condiciones de recarga del acuífero seguirán patrones históricos promedio
5. La capacidad logística municipal permanece constante (no se proyecta expansión de flota de pipas)
6. El crecimiento poblacional sigue tendencias demográficas moderadas

### Supuestos sobre Comportamiento del Sistema
7. La volatilidad de la Presa Huites (régimen boom-bust) continuará debido a dependencia de eventos extremos de lluvia
8. Las comunidades rurales sin acceso directo a red de agua dependen exclusivamente de pipas municipales
9. El acuífero permanece en suspensión de libre alumbramiento (no se otorgan nuevas concesiones sin autorización expresa)

### Supuestos sobre Eventos No Considerados
10. No se modelan eventos extremos como sequías prolongadas (>2 años) o inundaciones catastróficas
11. No se considera cambio climático acelerado que altere patrones de precipitación
12. No se considera colapso de infraestructura logística (pérdida total de pipas operativas)`,

  // Sección 4: Modelo Mínimo
  analisisTecnico: `## 4. Modelo Mínimo

### Balance Hídrico Simple del Acuífero

\`\`\`
Disponibilidad Neta = Recarga Media Anual - Descarga Comprometida - Volumen Concesionado
Disponibilidad Neta = 400.5 - 140.4 - 199.19 = 60.90 hm³/año
\`\`\`

### Índice de Volatilidad de la Presa

\`\`\`
Volatilidad = (Almacenamiento Máximo - Almacenamiento Mínimo) / Capacidad Total
Volatilidad (Enero-Septiembre 2025) = (1,925 - 59) / 3,200 = 58.3%
\`\`\`

### Capacidad Logística de Distribución

\`\`\`
Capacidad Diaria Teórica = (Número de Pipas × Capacidad por Pipa × Viajes por Día)
Capacidad Diaria Real = DESCONOCIDA (datos no públicos)
\`\`\`

### Índice de Saturación Logística

\`\`\`
Saturación = Demanda de Comunidades Rurales / Capacidad Diaria Real
Saturación = NO CALCULABLE (falta capacidad logística)
\`\`\`

**Conclusión del modelo:** El cuello de botella del sistema no es la disponibilidad total de agua, sino la capacidad logística para distribuirla.`,

  // Sección 5: Escenarios
  proyeccion: `## 5. Escenarios

### Escenario Base: Condiciones Actuales Sin Cambios

**Supuestos específicos:**
- Demanda poblacional constante
- Capacidad logística constante (1 pipa operativa según declaración de alcaldesa)
- No hay nuevas concesiones de agua

**Proyección:**
- El sistema opera en límite estructural
- Alta vulnerabilidad a sequías (almacenamiento de presa cae a <5% en 4 meses)
- Comunidades rurales dependen de distribución de emergencia

**Resultado:** Sistema en equilibrio precario, alta vulnerabilidad a variabilidad climática`,

  escenariosAlternativos: `### Escenario de Estrés: Aumento del 30% en Demanda

**Supuestos específicos:**
- Crecimiento poblacional acelerado o nueva actividad económica (sin especificar minería)
- Capacidad logística constante
- Disponibilidad del acuífero constante

**Proyección:**
- Demanda supera capacidad de distribución logística
- Tiempo de espera entre entregas de agua aumenta >50%
- Comunidades más alejadas enfrentan desabastecimiento crónico

**Resultado:** Colapso de distribución logística antes de agotar disponibilidad del acuífero

### Escenario Extremo: Sequía de 2 Años + Aumento del 50% en Demanda

**Supuestos específicos:**
- Presa Huites permanece <10% de capacidad por 24 meses
- Demanda aumenta 50% (combinación de crecimiento poblacional + nueva actividad económica)
- Capacidad logística constante

**Proyección:**
- Dependencia total del acuífero (fuente superficial no disponible)
- Disponibilidad neta del acuífero (60.90 hm³/año) insuficiente para cubrir aumento de demanda
- Sistema logístico colapsa (1 pipa no puede cubrir 401 localidades con demanda incrementada)

**Resultado:** Crisis hídrica estructural, desabastecimiento generalizado en comunidades rurales`,

  // Sección 6: Brechas Detectadas
  limitaciones: `## 6. Brechas Detectadas

### Datos No Públicos (Existen pero no están disponibles)

| Dato | Justificación | Institución responsable |
|------|---------------|-------------------------|
| Número de pipas municipales operativas | Necesario para calcular capacidad logística real | Gobierno Municipal de Choix |
| Capacidad por pipa (m³) | Necesario para calcular capacidad logística real | Gobierno Municipal de Choix |
| Serie mensual completa de almacenamiento Presa Huites 2015-2026 | Necesario para análisis de tendencias y volatilidad histórica | CONAGUA |
| Serie mensual de precipitación regional 2015-2026 | Necesario para correlacionar almacenamiento con eventos climáticos | CONAGUA / SMN |
| Volumen de extracción mensual para generación eléctrica | Necesario para balance hídrico completo | CFE / CONAGUA |

### Datos Inexistentes (Deberían generarse)

| Dato | Justificación | Institución responsable |
|------|---------------|-------------------------|
| Estudio de capacidad logística municipal para distribución de agua | Necesario para cuantificar cuello de botella del sistema | Gobierno Municipal + CONAGUA |
| Modelación hidrológica completa del acuífero Río Fuerte | Necesario para proyecciones robustas bajo escenarios de estrés | CONAGUA |
| Censo de demanda de agua por localidad rural | Necesario para priorizar distribución y planificar expansión logística | Gobierno Municipal + INEGI |
| Estudio de vulnerabilidad hídrica ante cambio climático | Necesario para planificación a largo plazo | CONAGUA + INECC |

**Implicación:** La ausencia de estos datos impide cuantificar formalmente el riesgo estructural del sistema hídrico.`,

  // Sección 7: Conclusión Estructural
  conclusiones: `## 7. Conclusión Estructural

### Hallazgos Estructurales

1. **El cuello de botella no es la disponibilidad total de agua, sino la capacidad logística para distribuirla.** El acuífero del Río Fuerte presenta una disponibilidad neta de 60.90 hm³/año, pero la capacidad de transporte mediante pipas municipales es desconocida y aparentemente insuficiente (declaración de alcaldesa: 1 pipa para 12-13 comunidades).

2. **El sistema opera en régimen boom-bust con alta volatilidad.** La Presa Huites presenta variaciones superiores al 60% de capacidad en periodos de 3-4 meses, dependiendo de eventos extremos de lluvia. Esto genera ciclos de abundancia-escasez que el sistema logístico no puede absorber.

3. **El sistema territorial disperso amplifica la vulnerabilidad.** Con 401 localidades y una población de ~29,334 habitantes, la distribución de agua requiere una red logística robusta que actualmente no existe o no es pública.

### Vulnerabilidades Sistémicas Identificadas

- **Vulnerabilidad logística:** Capacidad de distribución insuficiente para cobertura territorial
- **Vulnerabilidad climática:** Alta dependencia de eventos extremos de lluvia para recarga superficial
- **Vulnerabilidad institucional:** Ausencia de datos públicos sobre capacidad logística real

### Incertidumbres Derivadas de Brechas de Datos

- No es posible cuantificar el déficit exacto de capacidad logística
- No es posible proyectar con precisión el comportamiento del sistema bajo escenarios de estrés
- No es posible evaluar formalmente el impacto de nuevas demandas (minería u otras actividades económicas)

### Lo que Este Análisis NO Permite Concluir

- **No permite afirmar que el acuífero se agotará:** La disponibilidad neta es positiva (60.90 hm³/año)
- **No permite afirmar que una nueva concesión minera causará desabastecimiento:** Faltan datos sobre demanda minera proyectada y capacidad logística
- **No permite afirmar que el sistema colapsará:** Solo se identifican vulnerabilidades estructurales, no se predice colapso

### Pregunta Central Reformulada

La pregunta correcta no es: **"¿La mina vaciará la presa?"**

La pregunta estructural es: **"¿Puede el sistema logístico municipal sostener un aumento en comunidades dependientes si cualquier nueva actividad económica incrementa presión hídrica directa o indirectamente?"**

**Respuesta:** No es posible responder con los datos públicos disponibles. Se requiere un estudio de capacidad logística municipal y series históricas completas para cuantificar el riesgo estructural.`,

  fuentes: `## Fuentes Primarias

1. Diario Oficial de la Federación (DOF), 2013. ACUERDO por el que se da a conocer el resultado de los estudios de disponibilidad media anual de las aguas subterráneas de 21 acuíferos de los Estados Unidos Mexicanos.
2. Registro Público de Derechos de Agua (REPDA), CONAGUA. Consultado en febrero de 2026.
3. Gaceta Ecológica, SEMARNAT. Consultado en febrero de 2026.
4. Censo de Población y Vivienda 2020, INEGI.
5. Reportes de almacenamiento de la Presa Huites, CONAGUA. Sistema Nacional de Información del Agua (SINA).
6. Medios verificables que citan a CONAGUA: Luz Noticias, El Debate, Línea Directa.

**Acceso directo a SINA CONAGUA:** https://sinav30.conagua.gob.mx:8080/Presas/`,

  publicada: true,
  autorId: 1,
};

try {
  await db.insert(investigaciones).values(investigacionReestructurada);
  console.log("✅ Investigación reestructurada insertada exitosamente");
} catch (error) {
  console.error("❌ Error al insertar investigación:", error);
  process.exit(1);
}

process.exit(0);
