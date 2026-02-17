import { drizzle } from "drizzle-orm/mysql2";
import { investigaciones } from "./drizzle/schema.js";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

// Leer las investigaciones creadas en paralelo
const investigacionesData = [
  {
    numero: 3,
    titulo: "Cobertura Forestal Histórica de Choix 2015-2026",
    categoria: "Medio Ambiente",
    resumen: "La presente investigación analiza la evolución de la cobertura forestal en el municipio de Choix, Sinaloa, durante el periodo 2015-2026, aplicando el protocolo de 7 secciones del Laboratorio Público de Análisis Estructural. El estudio identifica la cobertura forestal como el nodo central del sistema, influenciado por nodos periféricos como el uso de suelo, factores climáticos y actividades antrópicas. Se establece un modelo mínimo para cuantificar el cambio neto en la superficie forestal, considerando las tasas de deforestación y reforestación como variables clave. A través de la construcción de tres escenarios (Base, Estrés y Extremo), se proyectan las posibles trayectorias de la cobertura forestal, revelando una tendencia general hacia la degradación progresiva bajo las condiciones actuales.\n\nEl análisis estructural concluye que el sistema de cobertura forestal de Choix se encuentra en una zona de tensión, con un déficit acumulativo debido a que la tasa de deforestación supera la capacidad de recuperación del ecosistema. Se identifican brechas significativas en la disponibilidad de datos a nivel municipal, lo que limita la precisión del análisis y la toma de decisiones. La investigación subraya la necesidad de una intervención estratégica en los nodos periféricos y una mayor inversión en flujos de restauración para revertir la tendencia de deterioro y transitar hacia un estado de equilibrio forestal. Las fuentes principales para este análisis incluyen datos de CONAFOR, INEGI y el Plan Municipal de Desarrollo Urbano de Choix.",
    slug: "cobertura-forestal-historica-choix-2015-2026",
    archivoPath: "/home/ubuntu/investigacion_completa_extracted/0_HSrBAeNx37LNTuBIK3NfEF_1771358646590_na1fn_L2hvbWUvdWJ1bnR1L2ludmVzdGlnYWNpb25fY2hvaXhfY29iZXJ0dXJhX2ZvcmVzdGFs.md"
  },
  {
    numero: 4,
    titulo: "Sistema Educativo de Choix - Capacidad vs Demanda",
    categoria: "Educación",
    resumen: "El presente análisis estructural evalúa el sistema educativo del municipio de Choix, Sinaloa, contrastando la capacidad instalada con la demanda demográfica proyectada para el ciclo escolar 2024-2025. Utilizando datos de la Secretaría de Educación Pública (SEP) y del Instituto Nacional de Estadística y Geografía (INEGI), se modeló la interacción entre la oferta de servicios educativos y la población en edad escolar bajo tres escenarios: base, de estrés y extremo.\n\nLos resultados del escenario base indican un superávit de capacidad en todos los niveles educativos (Básica, Media Superior y Superior), sugiriendo una subutilización de la infraestructura y el personal docente existentes. Esta condición persiste incluso en un escenario de estrés con un aumento del 10% en la demanda. Sin embargo, un escenario extremo que combina una reducción del 20% en la capacidad y un aumento del 15% en la demanda revela una vulnerabilidad crítica en la Educación Básica, que transitaría a un déficit de más de 1,000 alumnos.\n\nLa principal conclusión estructural es la necesidad de mejorar la granularidad y actualidad de los datos a nivel municipal para permitir una planificación más precisa y una gestión eficiente de los recursos. Aunque el sistema parece tener holgura en su capacidad actual, la dependencia de extrapolaciones y la falta de métricas locales robustas constituyen una debilidad que podría enmascarar desequilibrios y limitar la capacidad de respuesta ante cambios demográficos o de política educativa.",
    slug: "sistema-educativo-choix-capacidad-vs-demanda",
    archivoPath: "/home/ubuntu/investigacion_completa_extracted/1_8Pw2gA0hZHERrGVeLatolF_1771358671433_na1fn_L2hvbWUvdWJ1bnR1L2ludmVzdGlnYWNpb25fY2hvaXhfZWR1Y2FjaW9u.md"
  },
  {
    numero: 5,
    titulo: "Infraestructura de Salud en Choix - Análisis de Saturación",
    categoria: "Salud",
    resumen: "La presente investigación aborda la infraestructura de salud en el municipio de Choix, Sinaloa, bajo el protocolo de 7 secciones del Laboratorio Público de Análisis Estructural. El objetivo es analizar la saturación de los servicios de salud mediante el estudio de camas hospitalarias, personal médico, demanda demográfica y cobertura real, utilizando datos oficiales de la Secretaría de Salud y el INEGI. Se identifican las variables críticas del sistema de salud local, incluyendo el Hospital Integral Choix como nodo central y los centros de salud periféricos, así como los flujos de pacientes, personal e insumos.\n\nEl modelo mínimo desarrollado se basa en la cuantificación de tasas por cada mil habitantes para camas hospitalarias (TCH), personal médico (TPMH) y consultorios (TCXH). Los cálculos revelan una TCH de 0.36, una TPMH de 2.00 y una TCXH de 0.79, lo que posiciona a Choix en una Zona de Déficit. Se exploran tres escenarios: el Base, que confirma la insuficiencia actual; el de Estrés, que proyecta una saturación crítica ante un aumento del 20% en la demanda; y el Extremo, que anticipa una presión sostenida por el crecimiento y envejecimiento poblacional. Estos escenarios subrayan la falta de resiliencia del sistema de salud local frente a variaciones en la demanda o cambios demográficos.\n\nLas brechas detectadas incluyen la desactualización y falta de desagregación de datos oficiales, la ausencia de indicadores de uso y ocupación de servicios, y la escasa información sobre la salud rural. Se concluye que la infraestructura de salud en Choix es estructuralmente limitada y vulnerable, requiriendo una inversión sustancial y estratégica para garantizar una atención adecuada. La investigación enfatiza la necesidad de datos públicos actualizados y detallados para una gestión proactiva y la optimización de los recursos sanitarios.",
    slug: "infraestructura-salud-choix-analisis-saturacion",
    archivoPath: "/home/ubuntu/investigacion_completa_extracted/2_TZHypWnHtQxuu9bM7ca7Ar_1771358066775_na1fn_L2hvbWUvdWJ1bnR1L2ludmVzdGlnYWNpb25fc2FsdWRfY2hvaXg.md"
  },
  {
    numero: 6,
    titulo: "Red de Transporte de Choix - Identificación de Cuellos de Botella",
    categoria: "Infraestructura",
    resumen: "La presente investigación aborda la red de transporte del municipio de Choix, Sinaloa, enfocándose en la identificación de posibles cuellos de botella. Se define el sistema de transporte a partir de un nodo central (cabecera municipal) y nodos periféricos (localidades y conexiones con la red estatal/federal), analizando flujos vehiculares y variables críticas como capacidad vial, flujo, velocidad de operación y densidad. La tabla maestra de datos revela que la información sobre la red carretera municipal y su tipología proviene del Plan Municipal de Desarrollo Urbano de Choix (2012) y el Manual de Capacidad Vial (IMT, 1985), con estimaciones de flujo vehicular y proyecciones de crecimiento para 2026-2036.\n\nSe establecen supuestos explícitos, incluyendo la validez de la información del Plan Municipal de 2012 y la aplicabilidad de las metodologías del Manual de Capacidad Vial de 1985. El modelo mínimo propuesto para determinar el Nivel de Servicio (NS) se basa en la relación entre el flujo vehicular (Q) y la capacidad vial (C), NS = Q / C. Se plantean tres escenarios: base, estrés (incremento del 20% en el flujo) y extremo (reducción del 50% de la capacidad por bloqueo parcial). Las brechas detectadas incluyen la falta de aforos vehiculares públicos y actualizados, la desactualización del Plan Municipal de Desarrollo Urbano y la ausencia de estudios de origen-destino.\n\nEn conclusión, la red de transporte de Choix muestra una alta dependencia de la carretera Choix-El Fuerte, la cual es vulnerable a la congestión y a interrupciones debido a su estado físico y la carencia de rutas alternas. La falta de datos actualizados sobre flujo vehicular y patrones de movilidad obstaculiza un análisis preciso y la planificación efectiva. Se subraya la necesidad de aforos vehiculares periódicos y la actualización de los instrumentos de planificación urbana para garantizar un desarrollo vial sostenible en infraestructura vialidad sostenible.",
    slug: "red-transporte-choix-cuellos-botella",
    archivoPath: "/home/ubuntu/investigacion_completa_extracted/3_OEdJjQwmduHghp69lcy5eQ_1771358116847_na1fn_L2hvbWUvdWJ1bnR1L2ludmVzdGlnYWNpb25fY2hvaXg.md"
  }
];

// Leer contenido de cada investigación y preparar datos para inserción
const investigacionesParaInsertar = investigacionesData.map(inv => {
  const contenido = readFileSync(inv.archivoPath, 'utf-8');
  
  // Extraer secciones del contenido Markdown
  const secciones = {
    definicionSistema: extraerSeccion(contenido, "1. Definición del Sistema"),
    tablaMaestra: extraerSeccion(contenido, "2. Tabla Maestra de Datos"),
    supuestos: extraerSeccion(contenido, "3. Supuestos Explícitos"),
    modelo: extraerSeccion(contenido, "4. Modelo Mínimo"),
    escenarios: extraerSeccion(contenido, "5. Escenarios"),
    brechas: extraerSeccion(contenido, "6. Brechas Detectadas"),
    conclusion: extraerSeccion(contenido, "7. Conclusión Estructural"),
    fuentes: extraerSeccion(contenido, "Fuentes")
  };
  
  return {
    numero: inv.numero,
    titulo: inv.titulo,
    categoria: inv.categoria.toLowerCase().replace(" ", "_"),
    resumenEjecutivo: inv.resumen,
    slug: inv.slug,
    definicionSistema: secciones.definicionSistema,
    tablaMaestra: secciones.tablaMaestra,
    supuestos: secciones.supuestos,
    modelo: secciones.modelo,
    escenarios: secciones.escenarios,
    brechas: secciones.brechas,
    conclusion: secciones.conclusion,
    fuentes: secciones.fuentes,
    publicada: true,
    autorId: 1,
    publishedAt: new Date()
  };
});

function extraerSeccion(contenido, titulo) {
  const regex = new RegExp(`##\\s*${titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=##|$)`, 'i');
  const match = contenido.match(regex);
  return match ? match[1].trim() : "";
}

// Insertar investigaciones en la base de datos
async function seed() {
  try {
    console.log("Insertando 4 investigaciones...");
    
    for (const inv of investigacionesParaInsertar) {
      await db.insert(investigaciones).values(inv);
      console.log(`✓ Investigación ${inv.numero} insertada: ${inv.titulo}`);
    }
    
    console.log("\n✓ Todas las investigaciones insertadas correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al insertar investigaciones:", error);
    process.exit(1);
  }
}

seed();
