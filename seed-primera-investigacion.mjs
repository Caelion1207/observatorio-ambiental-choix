import { drizzle } from "drizzle-orm/mysql2";
import { investigaciones } from "./drizzle/schema.js";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

const primeraInvestigacion = {
  titulo: "Balance hídrico proyectado del acuífero de Choix 2025–2030",
  slug: "balance-hidrico-acuifero-choix-2025-2030",
  resumenEjecutivo: `Este estudio presenta un análisis técnico del balance hídrico proyectado para el acuífero del Río Fuerte en la región de Choix, Sinaloa, para el período 2025-2030. Basado en los datos oficiales disponibles de la Comisión Nacional del Agua (CONAGUA), se evalúa la disponibilidad de agua frente a la demanda actual y potencial, considerando la suspensión de libre alumbramiento vigente. El análisis concluye que, si bien existe una disponibilidad nominal, el sistema opera bajo un estrés logístico significativo y cualquier nueva concesión a gran escala, como la propuesta por el proyecto minero Santo Tomás, podría comprometer la sostenibilidad del suministro para las comunidades rurales.`,
  
  contexto: `El municipio de Choix, Sinaloa, se caracteriza por un sistema territorial disperso con 401 localidades y una población de aproximadamente 29,334 habitantes. La principal fuente de agua superficial es la presa Luis Donaldo Colosio (Huites), cuyo almacenamiento es altamente volátil y dependiente de eventos de lluvia extremos. El acuífero del Río Fuerte, con una disponibilidad media anual de 60.90 hm³, se encuentra en un estado de suspensión provisional de libre alumbramiento desde 2013, lo que restringe la emisión de nuevas concesiones. En este contexto, el proyecto minero Santo Tomás representa una demanda potencial significativa que debe ser evaluada rigurosamente.`,
  
  datosOficiales: `| Fuente | Dato | Valor |
| :--- | :--- | :--- |
| DOF (2013) | Recarga media anual del acuífero | 400.5 hm³/año |
| DOF (2013) | Descarga comprometida | 140.4 hm³/año |
| DOF (2013) | Volumen concesionado | 199.19 hm³/año |
| DOF (2013) | Disponibilidad media anual | 60.90 hm³/año |
| REPDA | Concesión de agua a Minera Xochipala | No registrada |
| SEMARNAT | MIA para explotación minera | No aprobada |
| CONAGUA | Almacenamiento Presa Huites (Sep 2025) | ~44.9% |`,
  
  metodologia: `El análisis se basa en un balance hídrico simple, comparando la disponibilidad media anual del acuífero con el volumen concesionado actual y la demanda proyectada. No se realiza una modelación hidrológica compleja debido a la falta de series de tiempo históricas detalladas. Las proyecciones se basan en un escenario tendencial que asume la continuidad de las condiciones actuales de recarga y demanda, y se evalúa el impacto potencial de una nueva concesión minera.`,
  
  analisisTecnico: `El acuífero del Río Fuerte presenta una disponibilidad neta positiva de 60.90 hm³/año. Sin embargo, este volumen no considera la distribución geográfica de la demanda ni la capacidad logística para su transporte. La alta dispersión de la población y la dependencia de camiones cisterna (pipas) para el abastecimiento de comunidades rurales, cuyo número y capacidad son desconocidos, constituyen el principal cuello de botella del sistema. La declaración de la alcaldesa sobre la existencia de una sola pipa operativa para 12-13 comunidades sugiere que el sistema ya opera en su límite estructural.`,
  
  proyeccion: `Asumiendo un crecimiento poblacional moderado y sin la entrada en operación del proyecto minero, se proyecta que la demanda de agua se mantendrá dentro de los límites del volumen concesionado actual. Sin embargo, la resiliencia del sistema ante una sequía prolongada es baja debido a la volatilidad de la presa Huites y la limitada capacidad logística para distribuir el agua del acuífero.`,
  
  escenariosAlternativos: `**Escenario A (Sin Minería):** El sistema se mantiene en un equilibrio precario, con alta vulnerabilidad a la variabilidad climática y a fallas en la logística de distribución.

**Escenario B (Con Minería):** Una concesión minera del orden de 10-20 Mm³/año, aunque teóricamente cubierta por la disponibilidad del acuífero, generaría una presión insostenible sobre la infraestructura logística y competiría directamente por los recursos hídricos superficiales en épocas de estiaje, exacerbando la vulnerabilidad de las comunidades rurales.`,
  
  limitaciones: `La principal limitación de este estudio es la ausencia de una serie de tiempo histórica completa (2015-2026) del almacenamiento de la presa Huites y de los volúmenes de precipitación mensual. Esta información es crítica para realizar una modelación hidrológica robusta y proyecciones más precisas. Asimismo, la falta de datos sobre la capacidad logística real del municipio (número y capacidad de pipas) impide una cuantificación exacta del déficit de distribución.`,
  
  conclusiones: `El riesgo hídrico en Choix no reside en la disponibilidad total de agua en el acuífero, sino en la capacidad para distribuirla de manera eficiente y equitativa. La pregunta central no es si la mina agotará el agua, sino si el sistema logístico puede soportar la presión adicional. Se requiere un estudio detallado de la capacidad logística municipal y la obtención de series de tiempo hidrológicas para validar las hipótesis aquí presentadas y formular un plan de gestión hídrica resiliente.`,
  
  fuentes: `- Diario Oficial de la Federación (DOF), 2013. ACUERDO por el que se da a conocer el resultado de los estudios de disponibilidad media anual de las aguas subterráneas de 21 acuíferos de los Estados Unidos Mexicanos, mismos que forman parte de las regiones hidrológico-administrativas que se indican.
- Registro Público de Derechos de Agua (REPDA), CONAGUA. (Consultado en febrero de 2026).
- Gaceta Ecológica, SEMARNAT. (Consultado en febrero de 2026).
- Censo de Población y Vivienda 2020, INEGI.
- Reportes de almacenamiento de la Presa Huites, CONAGUA.`,
  
  publicada: true,
  autorId: 1,
  publishedAt: new Date(),
};

async function seed() {
  try {
    console.log("Insertando primera investigación...");
    await db.insert(investigaciones).values(primeraInvestigacion);
    console.log("✅ Primera investigación publicada correctamente");
  } catch (error) {
    console.error("❌ Error al publicar la investigación:", error);
    process.exit(1);
  }
}

seed();
