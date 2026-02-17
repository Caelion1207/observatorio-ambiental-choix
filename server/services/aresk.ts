/**
 * ARESK - Verificación de Hipótesis
 * 
 * Función: Verificar que las conclusiones derivan del modelo sin saltos narrativos.
 * Detecta inferencias sin variable asociada y palabras que indican opinión o narrativa.
 */

export interface AnalisisARESK {
  esValido: boolean;
  alertas: Alerta[];
  puntajeRobustez: number; // 0-100
  resumen: string;
}

export interface Alerta {
  tipo: "salto_narrativo" | "inferencia_sin_variable" | "palabra_opinion" | "conclusion_no_derivada";
  severidad: "alta" | "media" | "baja";
  ubicacion: string; // Sección donde se detectó
  fragmento: string; // Texto problemático
  sugerencia: string;
}

// Palabras que indican opinión o narrativa en lugar de análisis técnico
const PALABRAS_OPINION = [
  "probablemente",
  "es evidente",
  "claramente",
  "obviamente",
  "sin duda",
  "indudablemente",
  "es claro que",
  "se puede decir que",
  "es obvio",
  "naturalmente",
  "lógicamente",
  "por supuesto",
  "evidentemente",
  "aparentemente",
  "presumiblemente",
  "seguramente",
  "definitivamente",
  "ciertamente"
];

// Palabras que indican conclusiones derivadas de datos
const PALABRAS_TECNICAS = [
  "según los datos",
  "el modelo indica",
  "se observa que",
  "los resultados muestran",
  "el análisis revela",
  "la variable",
  "el indicador",
  "la métrica",
  "el cálculo",
  "la medición"
];

/**
 * Analiza una investigación completa usando el protocolo ARESK
 */
export function analizarConARESK(investigacion: {
  definicionSistema: string;
  tablaMaestra: string;
  supuestos: string;
  modelo: string;
  escenarios: string;
  brechas: string;
  conclusion: string;
}): AnalisisARESK {
  const alertas: Alerta[] = [];

  // 1. Detectar saltos narrativos en conclusiones
  const alertasConclusiones = detectarSaltosNarrativos(investigacion.conclusion, "Conclusión Estructural");
  alertas.push(...alertasConclusiones);

  // 2. Detectar palabras de opinión en todas las secciones
  const secciones = [
    { nombre: "Definición del Sistema", contenido: investigacion.definicionSistema },
    { nombre: "Tabla Maestra", contenido: investigacion.tablaMaestra },
    { nombre: "Supuestos Explícitos", contenido: investigacion.supuestos },
    { nombre: "Modelo Mínimo", contenido: investigacion.modelo },
    { nombre: "Escenarios", contenido: investigacion.escenarios },
    { nombre: "Brechas Detectadas", contenido: investigacion.brechas },
    { nombre: "Conclusión Estructural", contenido: investigacion.conclusion }
  ];

  for (const seccion of secciones) {
    const alertasOpinion = detectarPalabrasOpinion(seccion.contenido, seccion.nombre);
    alertas.push(...alertasOpinion);
  }

  // 3. Verificar que conclusiones derivan del modelo
  const alertasDerivacion = verificarDerivacionConclusiones(
    investigacion.modelo,
    investigacion.conclusion
  );
  alertas.push(...alertasDerivacion);

  // 4. Calcular puntaje de robustez
  const puntajeRobustez = calcularPuntajeRobustez(alertas);

  // 5. Generar resumen
  const resumen = generarResumen(alertas, puntajeRobustez);

  return {
    esValido: alertas.filter(a => a.severidad === "alta").length === 0,
    alertas,
    puntajeRobustez,
    resumen
  };
}

/**
 * Detecta saltos narrativos (afirmaciones sin respaldo en datos)
 */
function detectarSaltosNarrativos(texto: string, ubicacion: string): Alerta[] {
  const alertas: Alerta[] = [];
  const lineas = texto.split("\n");

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].toLowerCase();
    
    // Buscar afirmaciones categóricas sin referencia a datos
    const tieneAfirmacionCategorica = /\b(es|son|está|están|será|serán)\b/.test(linea);
    const tieneReferenciaADatos = PALABRAS_TECNICAS.some(palabra => linea.includes(palabra));
    
    if (tieneAfirmacionCategorica && !tieneReferenciaADatos && linea.length > 50) {
      // Verificar que no sea solo una definición o descripción
      const esDefinicion = linea.includes("se define como") || linea.includes("se entiende por");
      
      if (!esDefinicion) {
        alertas.push({
          tipo: "conclusion_no_derivada",
          severidad: "media",
          ubicacion,
          fragmento: lineas[i].substring(0, 100) + "...",
          sugerencia: "Asociar esta afirmación con una variable cuantificada del modelo o agregar referencia a datos específicos."
        });
      }
    }
  }

  return alertas;
}

/**
 * Detecta palabras que indican opinión en lugar de análisis técnico
 */
function detectarPalabrasOpinion(texto: string, ubicacion: string): Alerta[] {
  const alertas: Alerta[] = [];
  const textoLower = texto.toLowerCase();

  for (const palabra of PALABRAS_OPINION) {
    const regex = new RegExp(`\\b${palabra}\\b`, "gi");
    const coincidencias = texto.match(regex);
    
    if (coincidencias) {
      // Encontrar contexto de la primera coincidencia
      const indice = textoLower.indexOf(palabra);
      const inicio = Math.max(0, indice - 50);
      const fin = Math.min(texto.length, indice + palabra.length + 50);
      const fragmento = texto.substring(inicio, fin);

      alertas.push({
        tipo: "palabra_opinion",
        severidad: "alta",
        ubicacion,
        fragmento,
        sugerencia: `Reemplazar "${palabra}" con una referencia a datos cuantificados o eliminar la afirmación si no puede ser respaldada por el modelo.`
      });
    }
  }

  return alertas;
}

/**
 * Verifica que las conclusiones deriven del modelo (variables mencionadas en ambos)
 */
function verificarDerivacionConclusiones(modelo: string, conclusion: string): Alerta[] {
  const alertas: Alerta[] = [];

  // Extraer variables del modelo (buscar patrones como IVC, ISD, BAS, etc.)
  const variablesModelo = extraerVariables(modelo);
  const variablesConclusiones = extraerVariables(conclusion);

  // Verificar que al menos el 50% de las variables en conclusiones estén en el modelo
  const variablesComunes = variablesConclusiones.filter(v => variablesModelo.includes(v));
  const porcentajeCobertura = variablesComunes.length / Math.max(variablesConclusiones.length, 1);

  if (porcentajeCobertura < 0.5 && variablesConclusiones.length > 0) {
    alertas.push({
      tipo: "inferencia_sin_variable",
      severidad: "alta",
      ubicacion: "Conclusión Estructural",
      fragmento: `Variables en conclusiones: ${variablesConclusiones.join(", ")}. Variables en modelo: ${variablesModelo.join(", ")}`,
      sugerencia: "Las conclusiones deben derivarse de variables definidas en el Modelo Mínimo. Agregar variables faltantes al modelo o eliminar inferencias no respaldadas."
    });
  }

  return alertas;
}

/**
 * Extrae variables técnicas del texto (patrones como IVC, ISD, BAS, etc.)
 */
function extraerVariables(texto: string): string[] {
  const variables: Set<string> = new Set();
  
  // Buscar acrónimos en mayúsculas (2-5 letras)
  const acronimos = texto.match(/\b[A-Z]{2,5}\b/g) || [];
  acronimos.forEach(v => variables.add(v));

  // Buscar patrones como "Índice de...", "Tasa de...", "Coeficiente de..."
  const patronesVariables = [
    /Índice de [A-Za-zÁ-ú\s]+/gi,
    /Tasa de [A-Za-zÁ-ú\s]+/gi,
    /Coeficiente de [A-Za-zÁ-ú\s]+/gi,
    /Capacidad de [A-Za-zÁ-ú\s]+/gi,
    /Demanda de [A-Za-zÁ-ú\s]+/gi
  ];

  for (const patron of patronesVariables) {
    const coincidencias = texto.match(patron) || [];
    coincidencias.forEach(v => variables.add(v.trim()));
  }

  return Array.from(variables);
}

/**
 * Calcula puntaje de robustez (0-100) basado en alertas
 */
function calcularPuntajeRobustez(alertas: Alerta[]): number {
  let puntaje = 100;

  for (const alerta of alertas) {
    switch (alerta.severidad) {
      case "alta":
        puntaje -= 15;
        break;
      case "media":
        puntaje -= 8;
        break;
      case "baja":
        puntaje -= 3;
        break;
    }
  }

  return Math.max(0, puntaje);
}

/**
 * Genera resumen del análisis ARESK
 */
function generarResumen(alertas: Alerta[], puntaje: number): string {
  const alertasAltas = alertas.filter(a => a.severidad === "alta").length;
  const alertasMedias = alertas.filter(a => a.severidad === "media").length;
  const alertasBajas = alertas.filter(a => a.severidad === "baja").length;

  if (puntaje >= 85) {
    return `Análisis ARESK: ROBUSTO (${puntaje}/100). La investigación presenta ${alertas.length} alertas menores. Las conclusiones derivan correctamente del modelo y no se detectan saltos narrativos significativos.`;
  } else if (puntaje >= 70) {
    return `Análisis ARESK: MODERADO (${puntaje}/100). Se detectaron ${alertasAltas} alertas de severidad alta y ${alertasMedias} medias. Revisar las sugerencias para fortalecer la derivación de conclusiones.`;
  } else {
    return `Análisis ARESK: DÉBIL (${puntaje}/100). Se detectaron ${alertasAltas} alertas críticas. Las conclusiones requieren mayor respaldo en variables cuantificadas del modelo. Revisar urgentemente antes de publicación.`;
  }
}
