/**
 * ARGOS - Detección de Anomalías
 * 
 * Función: Detectar contradicciones entre investigaciones, inconsistencias en unidades
 * y cambios abruptos no explicados en variables críticas.
 */

export interface AnalisisARGOS {
  esConsistente: boolean;
  anomalias: Anomalia[];
  puntajeConsistencia: number; // 0-100
  resumen: string;
}

export interface Anomalia {
  tipo: "contradiccion" | "inconsistencia_unidades" | "cambio_abrupto" | "dato_atipico";
  severidad: "alta" | "media" | "baja";
  investigaciones: string[]; // Títulos de investigaciones afectadas
  variable: string;
  descripcion: string;
  valores: string[]; // Valores contradictorios
  sugerencia: string;
}

export interface VariableCritica {
  nombre: string;
  valor: number;
  unidad: string;
  investigacionId: number;
  investigacionTitulo: string;
}

/**
 * Analiza consistencia entre múltiples investigaciones usando ARGOS
 */
export function analizarConARGOS(investigaciones: Array<{
  id: number;
  titulo: string;
  categoria: string;
  tablaMaestra: string;
  modelo: string;
  conclusion: string;
}>): AnalisisARGOS {
  const anomalias: Anomalia[] = [];

  // 1. Extraer variables críticas de todas las investigaciones
  const variablesPorInvestigacion = investigaciones.map(inv => ({
    investigacion: inv,
    variables: extraerVariablesCriticas(inv)
  }));

  // 2. Detectar contradicciones entre investigaciones
  const anomaliasContradicciones = detectarContradicciones(variablesPorInvestigacion);
  anomalias.push(...anomaliasContradicciones);

  // 3. Detectar inconsistencias en unidades
  const anomaliasUnidades = detectarInconsistenciasUnidades(variablesPorInvestigacion);
  anomalias.push(...anomaliasUnidades);

  // 4. Detectar cambios abruptos no explicados
  const anomaliasCambios = detectarCambiosAbruptos(variablesPorInvestigacion);
  anomalias.push(...anomaliasCambios);

  // 5. Calcular puntaje de consistencia
  const puntajeConsistencia = calcularPuntajeConsistencia(anomalias);

  // 6. Generar resumen
  const resumen = generarResumenARGOS(anomalias, puntajeConsistencia);

  return {
    esConsistente: anomalias.filter(a => a.severidad === "alta").length === 0,
    anomalias,
    puntajeConsistencia,
    resumen
  };
}

/**
 * Extrae variables críticas de una investigación
 */
function extraerVariablesCriticas(investigacion: {
  id: number;
  titulo: string;
  tablaMaestra: string;
  modelo: string;
}): VariableCritica[] {
  const variables: VariableCritica[] = [];
  const texto = investigacion.tablaMaestra + "\n" + investigacion.modelo;

  // Patrones para detectar variables con valores numéricos
  const patrones = [
    // Patrón: "Variable: 123.45 unidad"
    /([A-Za-zÁ-ú\s]+):\s*([\d,\.]+)\s*([a-zA-Z³\/]+)/g,
    // Patrón: "Variable = 123.45 unidad"
    /([A-Za-zÁ-ú\s]+)\s*=\s*([\d,\.]+)\s*([a-zA-Z³\/]+)/g,
    // Patrón: "123.45 unidad de Variable"
    /([\d,\.]+)\s*([a-zA-Z³\/]+)\s+de\s+([A-Za-zÁ-ú\s]+)/g
  ];

  for (const patron of patrones) {
    let match;
    while ((match = patron.exec(texto)) !== null) {
      const nombre = match[1] || match[3];
      const valorStr = match[2] || match[1];
      const unidad = match[3] || match[2];
      
      const valor = parseFloat(valorStr.replace(",", ""));
      
      if (!isNaN(valor) && nombre && unidad) {
        variables.push({
          nombre: nombre.trim(),
          valor,
          unidad: unidad.trim(),
          investigacionId: investigacion.id,
          investigacionTitulo: investigacion.titulo
        });
      }
    }
  }

  return variables;
}

/**
 * Detecta contradicciones entre investigaciones (misma variable, valores diferentes)
 */
function detectarContradicciones(variablesPorInvestigacion: Array<{
  investigacion: any;
  variables: VariableCritica[];
}>): Anomalia[] {
  const anomalias: Anomalia[] = [];
  const variablesGlobales = new Map<string, VariableCritica[]>();

  // Agrupar variables por nombre
  for (const { variables } of variablesPorInvestigacion) {
    for (const variable of variables) {
      const clave = normalizarNombreVariable(variable.nombre);
      if (!variablesGlobales.has(clave)) {
        variablesGlobales.set(clave, []);
      }
      variablesGlobales.get(clave)!.push(variable);
    }
  }

  // Detectar contradicciones
  for (const [nombreNormalizado, instancias] of Array.from(variablesGlobales.entries())) {
    if (instancias.length > 1) {
      // Verificar si hay valores significativamente diferentes
      const valores = instancias.map((v: VariableCritica) => v.valor);
      const valorMin = Math.min(...valores);
      const valorMax = Math.max(...valores);
      const diferenciaPorcentual = ((valorMax - valorMin) / valorMin) * 100;

      // Si la diferencia es mayor al 20%, es una contradicción
      if (diferenciaPorcentual > 20) {
        anomalias.push({
          tipo: "contradiccion",
          severidad: diferenciaPorcentual > 50 ? "alta" : "media",
          investigaciones: instancias.map((v: VariableCritica) => v.investigacionTitulo),
          variable: instancias[0].nombre,
          descripcion: `La variable "${instancias[0].nombre}" presenta valores contradictorios entre investigaciones: ${valores.join(", ")} ${instancias[0].unidad}. Diferencia: ${diferenciaPorcentual.toFixed(1)}%`,
          valores: instancias.map((v: VariableCritica) => `${v.valor} ${v.unidad} (${v.investigacionTitulo})`),
          sugerencia: "Verificar fuentes de datos y periodo temporal. Si los valores corresponden a periodos diferentes, especificarlo explícitamente. Si hay error, corregir en la investigación correspondiente."
        });
      }
    }
  }

  return anomalias;
}

/**
 * Detecta inconsistencias en unidades (misma variable, unidades diferentes)
 */
function detectarInconsistenciasUnidades(variablesPorInvestigacion: Array<{
  investigacion: any;
  variables: VariableCritica[];
}>): Anomalia[] {
  const anomalias: Anomalia[] = [];
  const variablesGlobales = new Map<string, VariableCritica[]>();

  // Agrupar variables por nombre normalizado
  for (const { variables } of variablesPorInvestigacion) {
    for (const variable of variables) {
      const clave = normalizarNombreVariable(variable.nombre);
      if (!variablesGlobales.has(clave)) {
        variablesGlobales.set(clave, []);
      }
      variablesGlobales.get(clave)!.push(variable);
    }
  }

  // Detectar inconsistencias en unidades
  for (const [nombreNormalizado, instancias] of Array.from(variablesGlobales.entries())) {
    if (instancias.length > 1) {
      const unidades = new Set(instancias.map((v: VariableCritica) => v.unidad));
      
      if (unidades.size > 1) {
        anomalias.push({
          tipo: "inconsistencia_unidades",
          severidad: "alta",
          investigaciones: instancias.map((v: VariableCritica) => v.investigacionTitulo),
          variable: instancias[0].nombre,
          descripcion: `La variable "${instancias[0].nombre}" utiliza unidades inconsistentes: ${Array.from(unidades).join(", ")}`,
          valores: instancias.map((v: VariableCritica) => `${v.valor} ${v.unidad} (${v.investigacionTitulo})`),
          sugerencia: "Estandarizar unidades en todas las investigaciones. Utilizar siempre la misma unidad para facilitar comparaciones y evitar errores de interpretación."
        });
      }
    }
  }

  return anomalias;
}

/**
 * Detecta cambios abruptos no explicados en variables críticas
 */
function detectarCambiosAbruptos(variablesPorInvestigacion: Array<{
  investigacion: any;
  variables: VariableCritica[];
}>): Anomalia[] {
  const anomalias: Anomalia[] = [];
  
  // Agrupar variables por nombre y ordenar por investigación
  const variablesGlobales = new Map<string, VariableCritica[]>();

  for (const { variables } of variablesPorInvestigacion) {
    for (const variable of variables) {
      const clave = normalizarNombreVariable(variable.nombre);
      if (!variablesGlobales.has(clave)) {
        variablesGlobales.set(clave, []);
      }
      variablesGlobales.get(clave)!.push(variable);
    }
  }

  // Detectar cambios abruptos
  for (const [nombreNormalizado, instancias] of Array.from(variablesGlobales.entries())) {
    if (instancias.length >= 2) {
      // Ordenar por ID de investigación
      instancias.sort((a: VariableCritica, b: VariableCritica) => a.investigacionId - b.investigacionId);

      // Comparar valores consecutivos
      for (let i = 1; i < instancias.length; i++) {
        const anterior = instancias[i - 1];
        const actual = instancias[i];

        if (anterior.unidad === actual.unidad) {
          const cambio = Math.abs((actual.valor - anterior.valor) / anterior.valor) * 100;

          // Si el cambio es mayor al 40%, es abrupto
          if (cambio > 40) {
            anomalias.push({
              tipo: "cambio_abrupto",
              severidad: cambio > 70 ? "alta" : "media",
              investigaciones: [anterior.investigacionTitulo, actual.investigacionTitulo],
              variable: anterior.nombre,
              descripcion: `Cambio abrupto detectado en "${anterior.nombre}": de ${anterior.valor} a ${actual.valor} ${actual.unidad} (${cambio.toFixed(1)}% de variación)`,
              valores: [`${anterior.valor} ${anterior.unidad}`, `${actual.valor} ${actual.unidad}`],
              sugerencia: "Verificar si el cambio está justificado por eventos documentados (cambios de política, eventos climáticos, etc.). Si no hay justificación, revisar fuentes de datos."
            });
          }
        }
      }
    }
  }

  return anomalias;
}

/**
 * Normaliza nombre de variable para comparación
 */
function normalizarNombreVariable(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Calcula puntaje de consistencia (0-100)
 */
function calcularPuntajeConsistencia(anomalias: Anomalia[]): number {
  let puntaje = 100;

  for (const anomalia of anomalias) {
    switch (anomalia.severidad) {
      case "alta":
        puntaje -= 20;
        break;
      case "media":
        puntaje -= 10;
        break;
      case "baja":
        puntaje -= 5;
        break;
    }
  }

  return Math.max(0, puntaje);
}

/**
 * Genera resumen del análisis ARGOS
 */
function generarResumenARGOS(anomalias: Anomalia[], puntaje: number): string {
  const anomaliasAltas = anomalias.filter(a => a.severidad === "alta").length;
  const anomaliasMedias = anomalias.filter(a => a.severidad === "media").length;

  if (puntaje >= 85) {
    return `Análisis ARGOS: CONSISTENTE (${puntaje}/100). No se detectaron contradicciones significativas entre investigaciones. El sistema mantiene coherencia interna.`;
  } else if (puntaje >= 70) {
    return `Análisis ARGOS: MODERADAMENTE CONSISTENTE (${puntaje}/100). Se detectaron ${anomaliasMedias} anomalías de severidad media. Revisar las sugerencias para mejorar la coherencia interdominio.`;
  } else {
    return `Análisis ARGOS: INCONSISTENTE (${puntaje}/100). Se detectaron ${anomaliasAltas} anomalías críticas. Existen contradicciones o inconsistencias que requieren corrección inmediata antes de publicación.`;
  }
}
