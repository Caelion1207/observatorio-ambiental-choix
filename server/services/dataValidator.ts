/**
 * DataValidator Service
 * Validación de integridad y completitud de datos recolectados
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Valida que un array de datos no contenga valores nulos o indefinidos
   */
  validateCompleteness<T>(data: T[], fieldName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || data.length === 0) {
      errors.push(`${fieldName}: Dataset vacío`);
      return { isValid: false, errors, warnings };
    }

    const nullCount = data.filter((item) => item === null || item === undefined).length;
    if (nullCount > 0) {
      errors.push(`${fieldName}: ${nullCount} valores nulos o indefinidos detectados`);
      return { isValid: false, errors, warnings };
    }

    return { isValid: true, errors, warnings };
  }

  /**
   * Valida que una serie temporal tenga longitud mínima suficiente para análisis
   */
  validateSeriesLength<T>(data: T[], minLength: number, fieldName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (data.length < minLength) {
      errors.push(`${fieldName}: Serie insuficiente (${data.length} < ${minLength} requeridos)`);
      return { isValid: false, errors, warnings };
    }

    if (data.length < minLength * 1.5) {
      warnings.push(`${fieldName}: Serie corta (${data.length} puntos). Recomendado: >${minLength * 1.5}`);
    }

    return { isValid: true, errors, warnings };
  }

  /**
   * Valida que los valores numéricos estén dentro de rangos esperados
   */
  validateRange(
    data: number[],
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const outOfRange = data.filter((value) => value < min || value > max);
    if (outOfRange.length > 0) {
      errors.push(
        `${fieldName}: ${outOfRange.length} valores fuera de rango [${min}, ${max}]`
      );
      return { isValid: false, errors, warnings };
    }

    return { isValid: true, errors, warnings };
  }

  /**
   * Valida que una serie temporal no tenga gaps (huecos) significativos
   */
  validateContinuity(
    years: number[],
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const sortedYears = [...years].sort((a, b) => a - b);
    
    for (let i = 1; i < sortedYears.length; i++) {
      const gap = sortedYears[i] - sortedYears[i - 1];
      if (gap > 1) {
        warnings.push(
          `${fieldName}: Gap detectado entre ${sortedYears[i - 1]} y ${sortedYears[i]} (${gap} años)`
        );
      }
    }

    return { isValid: true, errors, warnings };
  }

  /**
   * Valida dataset completo con múltiples criterios
   */
  validateDataset<T extends Record<string, any>>(
    data: T[],
    config: {
      minLength: number;
      requiredFields: string[];
      numericFields?: { field: string; min: number; max: number }[];
      yearField?: string;
    }
  ): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validar completitud general
    const completenessResult = this.validateCompleteness(data, "Dataset");
    allErrors.push(...completenessResult.errors);
    allWarnings.push(...completenessResult.warnings);

    if (!completenessResult.isValid) {
      return { isValid: false, errors: allErrors, warnings: allWarnings };
    }

    // Validar longitud mínima
    const lengthResult = this.validateSeriesLength(data, config.minLength, "Dataset");
    allErrors.push(...lengthResult.errors);
    allWarnings.push(...lengthResult.warnings);

    if (!lengthResult.isValid) {
      return { isValid: false, errors: allErrors, warnings: allWarnings };
    }

    // Validar campos requeridos
    for (const field of config.requiredFields) {
      const fieldValues = data.map((item) => item[field]);
      const fieldResult = this.validateCompleteness(fieldValues, field);
      allErrors.push(...fieldResult.errors);
      allWarnings.push(...fieldResult.warnings);
    }

    // Validar rangos numéricos
    if (config.numericFields) {
      for (const { field, min, max } of config.numericFields) {
        const numericValues = data.map((item) => item[field]).filter((v) => typeof v === "number");
        const rangeResult = this.validateRange(numericValues, min, max, field);
        allErrors.push(...rangeResult.errors);
        allWarnings.push(...rangeResult.warnings);
      }
    }

    // Validar continuidad temporal
    if (config.yearField) {
      const yearField = config.yearField;
      const years = data.map((item) => item[yearField]).filter((v) => typeof v === "number");
      const continuityResult = this.validateContinuity(years, config.yearField);
      allWarnings.push(...continuityResult.warnings);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}
