/**
 * Funciones únicas de cálculo de métricas estructurales
 * 
 * Este archivo contiene las funciones canónicas para calcular IRM, brechas y nivel de incertidumbre.
 * TODAS las vistas (dominio, investigación individual, resumen) DEBEN consumir estas funciones.
 * 
 * NO crear cálculos paralelos en otros archivos.
 */

export interface Investigacion {
  id: number;
  titulo: string;
  indiceRobustez: string | number | null;
  brechas: string | null;
  supuestosEstructurados: string | null;
}

/**
 * Calcula el IRM (Índice de Robustez Metodológica) de una investigación
 * 
 * @param investigacion - Objeto investigación con campo indiceRobustez
 * @returns IRM como número entre 0 y 1, o null si no está disponible
 */
export function calcularIRM(investigacion: Investigacion): number | null {
  if (!investigacion.indiceRobustez) {
    return null;
  }

  const irm = typeof investigacion.indiceRobustez === 'number' 
    ? investigacion.indiceRobustez 
    : parseFloat(investigacion.indiceRobustez as string);

  if (isNaN(irm)) {
    return null;
  }

  return irm;
}

/**
 * Calcula el IRM promedio de un conjunto de investigaciones
 * 
 * @param investigaciones - Array de investigaciones
 * @returns IRM promedio como número entre 0 y 1, o null si no hay investigaciones con IRM
 */
export function calcularIRMPromedio(investigaciones: Investigacion[]): number | null {
  const irmsValidos = investigaciones
    .map(inv => calcularIRM(inv))
    .filter((irm): irm is number => irm !== null);

  if (irmsValidos.length === 0) {
    return null;
  }

  return irmsValidos.reduce((sum, irm) => sum + irm, 0) / irmsValidos.length;
}

/**
 * Calcula el número de brechas de una investigación
 * 
 * El campo `brechas` puede ser:
 * - JSON array: se cuenta la longitud
 * - Texto Markdown: se cuentan ocurrencias del patrón "**Brecha \d+:"
 * 
 * @param investigacion - Objeto investigación con campo brechas
 * @returns Número de brechas detectadas
 */
export function calcularBrechas(investigacion: Investigacion): number {
  if (!investigacion.brechas) {
    return 0;
  }

  try {
    const brechasArray = JSON.parse(investigacion.brechas);
    if (Array.isArray(brechasArray)) {
      return brechasArray.length;
    }
  } catch {
    // Campo brechas contiene texto Markdown, contar ocurrencias de "**Brecha"
    const matches = investigacion.brechas.match(/\*\*Brecha \d+:/g);
    return matches ? matches.length : 0;
  }

  return 0;
}

/**
 * Calcula el total de brechas de un conjunto de investigaciones
 * 
 * @param investigaciones - Array de investigaciones
 * @returns Total de brechas detectadas
 */
export function calcularBrechasTotales(investigaciones: Investigacion[]): number {
  return investigaciones.reduce((sum, inv) => sum + calcularBrechas(inv), 0);
}

/**
 * Calcula el nivel de incertidumbre analítica basado en IRM
 * 
 * Este nivel NO mide peligro social ni ambiental.
 * Mide el grado de respaldo documental del análisis.
 * 
 * Escala:
 * - IRM ≥ 0.75 → Incertidumbre Baja
 * - IRM 0.50-0.74 → Incertidumbre Media
 * - IRM < 0.50 → Incertidumbre Alta
 * 
 * @param irm - Índice de Robustez Metodológica (0-1)
 * @returns Nivel de incertidumbre como string
 */
export function calcularNivelIncertidumbre(irm: number | null): string {
  if (irm === null) {
    return "No disponible";
  }

  if (irm >= 0.75) {
    return "Baja";
  } else if (irm >= 0.50) {
    return "Media";
  } else {
    return "Alta";
  }
}

/**
 * Calcula el estado de robustez de una investigación basado en IRM
 * 
 * Escala:
 * - IRM ≥ 0.80 → Robusto
 * - IRM 0.60-0.79 → Moderado
 * - IRM < 0.60 → Débil
 * 
 * @param irm - Índice de Robustez Metodológica (0-1)
 * @returns Estado de robustez como string
 */
export function calcularEstadoRobustez(irm: number | null): string {
  if (irm === null) {
    return "No disponible";
  }

  if (irm >= 0.80) {
    return "Robusto";
  } else if (irm >= 0.60) {
    return "Moderado";
  } else {
    return "Débil";
  }
}
