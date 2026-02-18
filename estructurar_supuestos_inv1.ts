import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║    ESTRUCTURAR SUPUESTOS DE INVESTIGACIÓN #1 (SISTEMA HÍDRICO) ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Supuestos estructurados extraídos del campo `supuestos` (Markdown)
const supuestosEstructurados = [
  {
    id: 1,
    supuesto: "Los datos de CONAGUA, DOF, INEGI, SMN y Cochilco son completos y representativos de las condiciones reales",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: true
  },
  {
    id: 2,
    supuesto: "Los datos de medios verificables que citan a CONAGUA son considerados verificados cuando múltiples fuentes independientes reportan el mismo valor",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  },
  {
    id: 3,
    supuesto: "El consumo hídrico proyectado del proyecto minero Santo Tomás (53 millones de litros/día) es representativo de la demanda real",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: false
  },
  {
    id: 4,
    supuesto: "La ausencia de registro en REPDA indica ausencia de concesión otorgada",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: true
  },
  {
    id: 5,
    supuesto: "Las condiciones de recarga del acuífero seguirán patrones históricos promedio (400.5 hm³/año)",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: false
  },
  {
    id: 6,
    supuesto: "La capacidad logística municipal permanece constante o se deteriora",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  },
  {
    id: 7,
    supuesto: "El crecimiento poblacional sigue tendencias demográficas moderadas",
    impacto: "Bajo",
    sensibilidad: "Bajo",
    verificado: true
  },
  {
    id: 8,
    supuesto: "La volatilidad de la Presa Huites (régimen boom-bust) continuará debido a dependencia de eventos extremos de lluvia",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: true
  },
  {
    id: 9,
    supuesto: "Las comunidades rurales sin acceso directo a red de agua dependen exclusivamente de pipas municipales",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  },
  {
    id: 10,
    supuesto: "El acuífero permanece en suspensión de libre alumbramiento",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: true
  },
  {
    id: 11,
    supuesto: "El proyecto minero Santo Tomás extraerá agua del acuífero del Río Fuerte",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: false
  },
  {
    id: 12,
    supuesto: "No se modelan eventos extremos como sequías prolongadas (>2 años) o inundaciones catastróficas",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  },
  {
    id: 13,
    supuesto: "No se considera cambio climático acelerado que altere patrones de precipitación más allá de la variabilidad observada (IVC 18.2%)",
    impacto: "Alto",
    sensibilidad: "Crítico",
    verificado: false
  },
  {
    id: 14,
    supuesto: "No se considera colapso de infraestructura logística (pérdida total de pipas operativas)",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  },
  {
    id: 15,
    supuesto: "No se considera contaminación del acuífero que reduzca su disponibilidad efectiva",
    impacto: "Medio",
    sensibilidad: "Moderado",
    verificado: true
  }
];

console.log(`Total supuestos a estructurar: ${supuestosEstructurados.length}`);
console.log(`Supuestos críticos: ${supuestosEstructurados.filter(s => s.sensibilidad === 'Crítico').length}`);
console.log(`Supuestos verificados: ${supuestosEstructurados.filter(s => s.verificado).length}`);
console.log(`Críticos verificados: ${supuestosEstructurados.filter(s => s.sensibilidad === 'Crítico' && s.verificado).length}`);

// Actualizar investigación #1
await connection.query(
  'UPDATE investigaciones SET supuestosEstructurados = ? WHERE numero = 1',
  [JSON.stringify(supuestosEstructurados)]
);

console.log('\n✅ Supuestos estructurados insertados en investigación #1');

// Recalcular IRM
const totalSupuestos = supuestosEstructurados.length;
const supuestosVerificados = supuestosEstructurados.filter(s => s.verificado).length;
const supuestosCriticos = supuestosEstructurados.filter(s => s.sensibilidad === 'Crítico');
const criticosVerificados = supuestosCriticos.filter(s => s.verificado).length;
const totalCriticos = supuestosCriticos.length;

const tasaVerificacion = supuestosVerificados / totalSupuestos;
const tasaCriticosVerificados = criticosVerificados / totalCriticos;
const pesoCriticos = tasaCriticosVerificados < 1.0 
  ? 0.5 + (tasaCriticosVerificados * 0.5) 
  : 1.0;

let irm = tasaVerificacion * pesoCriticos;
irm = Math.max(irm, 0.30);
irm = parseFloat(irm.toFixed(2));

console.log(`\nCálculo IRM:`);
console.log(`  Tasa de verificación: ${(tasaVerificacion * 100).toFixed(1)}%`);
console.log(`  Tasa críticos verificados: ${(tasaCriticosVerificados * 100).toFixed(1)}%`);
console.log(`  Peso críticos: ${pesoCriticos.toFixed(2)}`);
console.log(`  IRM calculado: ${irm}`);

await connection.query(
  'UPDATE investigaciones SET indiceRobustez = ? WHERE numero = 1',
  [irm.toString()]
);

console.log(`\n✅ IRM actualizado a ${irm}`);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                  ESTRUCTURACIÓN COMPLETADA                     ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

await connection.end();
