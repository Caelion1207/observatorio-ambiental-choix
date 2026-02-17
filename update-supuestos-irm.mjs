import Database from "better-sqlite3";

const db = new Database(process.env.DATABASE_URL?.replace("mysql://", "") || "./local.db");

// Supuestos estructurados por investigación
const supuestosPorInvestigacion = {
  1: [ // Balance Hídrico Proyectado del Acuífero de Choix 2025-2030
    {
      id: 1,
      supuesto: "La recarga del acuífero se mantiene constante en 60.9 hm³/año durante el periodo 2025-2030",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "La demanda de agua crece linealmente a una tasa del 3% anual",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 3,
      supuesto: "No ocurren eventos climáticos extremos (sequías prolongadas o inundaciones) que alteren drásticamente la recarga",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 4,
      supuesto: "La eficiencia de extracción se mantiene constante sin mejoras tecnológicas significativas",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 5,
      supuesto: "No se implementan políticas de restricción de uso de agua durante el periodo analizado",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: false
    }
  ],
  2: [ // Sistema Hídrico de Choix ante Demanda Incremental
    {
      id: 1,
      supuesto: "El almacenamiento de Presa Huites se mantiene dentro del rango operativo normal (2,500-3,000 hm³)",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "La variabilidad climática (IVC) no excede 1.5 desviaciones estándar respecto a la media histórica",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 3,
      supuesto: "La capacidad institucional de absorción (CAL) permanece constante sin reformas administrativas",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 4,
      supuesto: "El Índice de Saturación de Demanda (ISD) se calcula con datos oficiales de CONAGUA sin ajustes locales",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 5,
      supuesto: "No se construyen nuevas presas o infraestructura hidráulica mayor en la región durante el periodo",
      impacto: "Bajo",
      sensibilidad: "Bajo",
      verificado: false
    }
  ],
  3: [ // Cobertura Forestal Histórica de Choix 2015-2026
    {
      id: 1,
      supuesto: "Los datos de cobertura forestal de INEGI son representativos de la realidad local de Choix",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "La tasa de deforestación observada en el periodo 2015-2020 se mantiene constante hasta 2026",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 3,
      supuesto: "El cambio de uso de suelo se debe principalmente a expansión agrícola y ganadera, no a minería o urbanización",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 4,
      supuesto: "No ocurrieron incendios forestales masivos no documentados que alteren significativamente la cobertura",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 5,
      supuesto: "La tasa de reforestación es inferior al 10% de la tasa de deforestación",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: false
    }
  ],
  4: [ // Sistema Educativo de Choix - Capacidad vs Demanda
    {
      id: 1,
      supuesto: "Los datos de matrícula escolar de la SEP son completos y actualizados hasta el ciclo 2024-2025",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "La tasa de crecimiento poblacional en edad escolar se mantiene constante en 2.5% anual",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 3,
      supuesto: "La capacidad instalada de infraestructura educativa no aumenta significativamente sin inversión pública",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 4,
      supuesto: "El índice de deserción escolar se mantiene en niveles históricos (15-20% en secundaria)",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 5,
      supuesto: "No se implementan programas masivos de educación a distancia que alteren la demanda de infraestructura física",
      impacto: "Bajo",
      sensibilidad: "Bajo",
      verificado: false
    }
  ],
  5: [ // Infraestructura de Salud en Choix - Análisis de Saturación
    {
      id: 1,
      supuesto: "Los datos de infraestructura de salud de la Secretaría de Salud son actualizados y completos",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "La demanda de servicios de salud crece proporcionalmente al crecimiento poblacional (2% anual)",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 3,
      supuesto: "No ocurren epidemias o pandemias que saturen temporalmente el sistema de salud",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 4,
      supuesto: "La tasa de ocupación hospitalaria promedio se mantiene en 70-80% sin picos estacionales extremos",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 5,
      supuesto: "El personal médico disponible se mantiene constante sin migración significativa hacia otras regiones",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: false
    }
  ],
  6: [ // Red de Transporte de Choix - Identificación de Cuellos de Botella
    {
      id: 1,
      supuesto: "Los datos de infraestructura vial de SCT son representativos del estado actual de las carreteras",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: true
    },
    {
      id: 2,
      supuesto: "El flujo vehicular crece a una tasa del 4% anual sin cambios en patrones de movilidad",
      impacto: "Alto",
      sensibilidad: "Crítico",
      verificado: false
    },
    {
      id: 3,
      supuesto: "No se construyen nuevas carreteras o ampliaciones significativas en el periodo analizado",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: false
    },
    {
      id: 4,
      supuesto: "La tasa de deterioro de pavimento se mantiene constante sin mantenimiento preventivo",
      impacto: "Medio",
      sensibilidad: "Moderado",
      verificado: true
    },
    {
      id: 5,
      supuesto: "Los cuellos de botella identificados no se agravan por eventos climáticos extremos (deslaves, inundaciones)",
      impacto: "Bajo",
      sensibilidad: "Bajo",
      verificado: false
    }
  ]
};

// Función para calcular IRM
function calcularIRM(supuestos) {
  const totalSupuestos = supuestos.length;
  const supuestosCriticosNoVerificados = supuestos.filter(
    s => s.sensibilidad === "Crítico" && !s.verificado
  ).length;
  
  const irm = 1 - (supuestosCriticosNoVerificados / totalSupuestos);
  return irm.toFixed(2);
}

// Actualizar cada investigación
console.log("Actualizando investigaciones con supuestos estructurados y calculando IRM...\n");

for (const [id, supuestos] of Object.entries(supuestosPorInvestigacion)) {
  const supuestosJSON = JSON.stringify(supuestos);
  const irm = calcularIRM(supuestos);
  const fechaCierre = new Date().toISOString();
  
  try {
    const stmt = db.prepare(`
      UPDATE investigaciones 
      SET supuestosEstructurados = ?,
          indiceRobustez = ?,
          fechaCierreSemantico = ?
      WHERE id = ?
    `);
    
    stmt.run(supuestosJSON, irm, fechaCierre, id);
    
    console.log(`✓ Investigación ${id} actualizada:`);
    console.log(`  - Supuestos: ${supuestos.length}`);
    console.log(`  - Supuestos críticos no verificados: ${supuestos.filter(s => s.sensibilidad === "Crítico" && !s.verificado).length}`);
    console.log(`  - IRM: ${irm}`);
    console.log(`  - Estado: ${irm >= 0.8 ? "Robusto" : irm >= 0.6 ? "Moderado" : "Débil"}\n`);
  } catch (error) {
    console.error(`✗ Error actualizando investigación ${id}:`, error.message);
  }
}

db.close();
console.log("✓ Actualización completada");
