/**
 * HydroModel Service
 * Simulación de balance hídrico con demanda incremental
 */

export interface SimulationConfig {
  storageInitial: number; // Almacenamiento inicial (m³)
  years: number; // Años a simular
  rechargeAvg: number; // Recarga promedio anual (m³/año)
  extractionBase: number; // Extracción base anual (m³/año)
  miningM3Year: number; // Demanda minera anual (m³/año)
}

export interface SimulationResult {
  year: number;
  storage: number; // Almacenamiento al final del año (m³)
  recharge: number; // Recarga del año (m³)
  extraction: number; // Extracción total del año (m³)
  balance: number; // Balance neto del año (m³)
}

export class HydroModel {
  private miningM3Year: number;

  constructor(miningM3Year: number) {
    this.miningM3Year = miningM3Year;
  }

  /**
   * Simula el balance hídrico del sistema durante N años
   */
  simulate(config: Omit<SimulationConfig, "miningM3Year">): SimulationResult[] {
    let storage = config.storageInitial;
    const results: SimulationResult[] = [];

    for (let year = 1; year <= config.years; year++) {
      const recharge = config.rechargeAvg;
      const extraction = config.extractionBase + this.miningM3Year;
      const balance = recharge - extraction;
      
      storage = storage + balance;

      results.push({
        year,
        storage,
        recharge,
        extraction,
        balance,
      });
    }

    return results;
  }

  /**
   * Simula múltiples escenarios con diferentes parámetros
   */
  simulateScenarios(baseConfig: Omit<SimulationConfig, "miningM3Year">): {
    base: SimulationResult[];
    stress: SimulationResult[];
    extreme: SimulationResult[];
  } {
    // Escenario Base: Sin nueva demanda
    const baseScenario = new HydroModel(0).simulate(baseConfig);

    // Escenario de Estrés: Con nueva demanda + reducción de recarga 10%
    const stressScenario = new HydroModel(this.miningM3Year).simulate({
      ...baseConfig,
      rechargeAvg: baseConfig.rechargeAvg * 0.9,
    });

    // Escenario Extremo: Con nueva demanda + reducción de recarga 20%
    const extremeScenario = new HydroModel(this.miningM3Year).simulate({
      ...baseConfig,
      rechargeAvg: baseConfig.rechargeAvg * 0.8,
    });

    return {
      base: baseScenario,
      stress: stressScenario,
      extreme: extremeScenario,
    };
  }

  /**
   * Calcula el Índice de Saturación de Demanda (ISD)
   */
  calculateISD(demandTotal: number, availabilityAnnual: number): number {
    return (demandTotal / availabilityAnnual) * 100;
  }

  /**
   * Calcula el Balance Acumulativo Simple (BAS)
   */
  calculateBAS(
    availabilityAnnual: number,
    demandAnnual: number,
    years: number
  ): number {
    const availabilityAccumulated = availabilityAnnual * years;
    const demandAccumulated = demandAnnual * years;
    return availabilityAccumulated - demandAccumulated;
  }

  /**
   * Calcula el Índice de Volatilidad Climática (IVC)
   */
  calculateIVC(precipitationData: number[]): number {
    const mean = precipitationData.reduce((sum, val) => sum + val, 0) / precipitationData.length;
    const variance =
      precipitationData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      precipitationData.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
  }

  /**
   * Calcula el Índice de Volatilidad de Almacenamiento (IVA)
   */
  calculateIVA(storageMin: number, storageMax: number, capacityTotal: number): number {
    return (storageMax - storageMin) / capacityTotal;
  }
}
