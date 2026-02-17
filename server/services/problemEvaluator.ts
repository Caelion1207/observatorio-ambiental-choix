/**
 * ProblemEvaluator Service
 * Evaluación de riesgo estructural del sistema hídrico
 */

export type RiskLevel = "ESTABLE" | "RIESGO MODERADO" | "RIESGO ALTO" | "CRÍTICO";
export type LogisticStatus = "CAPACIDAD SUFICIENTE" | "PRESIÓN LOGÍSTICA" | "COLAPSO LOGÍSTICO";
export type OperationalZone = "ESTABLE" | "TENSIÓN" | "RIESGO" | "DÉFICIT";

export interface WaterStressEvaluation {
  riskLevel: RiskLevel;
  decliningYears: number;
  totalYears: number;
  decliningPercentage: number;
}

export interface LogisticEvaluation {
  status: LogisticStatus;
  dailyNeedM3: number;
  dailyCapacityM3: number;
  deficit: number;
}

export class ProblemEvaluator {
  /**
   * Evalúa el nivel de estrés hídrico basado en tendencia de almacenamiento
   */
  evaluateWaterStress(storageSeries: number[]): WaterStressEvaluation {
    const decliningYears = storageSeries.reduce((count, storage, index) => {
      if (index === 0) return count;
      return storage < storageSeries[index - 1] ? count + 1 : count;
    }, 0);

    const totalYears = storageSeries.length - 1;
    const decliningPercentage = (decliningYears / totalYears) * 100;

    let riskLevel: RiskLevel;
    if (decliningPercentage > 75) {
      riskLevel = "CRÍTICO";
    } else if (decliningPercentage > 60) {
      riskLevel = "RIESGO ALTO";
    } else if (decliningPercentage > 30) {
      riskLevel = "RIESGO MODERADO";
    } else {
      riskLevel = "ESTABLE";
    }

    return {
      riskLevel,
      decliningYears,
      totalYears,
      decliningPercentage,
    };
  }

  /**
   * Evalúa la presión logística del sistema de distribución
   */
  evaluateLogisticPressure(
    population: number,
    litersPerPerson: number,
    logisticCapacityM3PerDay: number
  ): LogisticEvaluation {
    const dailyNeedM3 = (population * litersPerPerson) / 1000;
    const deficit = dailyNeedM3 - logisticCapacityM3PerDay;

    let status: LogisticStatus;
    if (deficit > logisticCapacityM3PerDay * 0.5) {
      status = "COLAPSO LOGÍSTICO";
    } else if (deficit > 0) {
      status = "PRESIÓN LOGÍSTICA";
    } else {
      status = "CAPACIDAD SUFICIENTE";
    }

    return {
      status,
      dailyNeedM3,
      dailyCapacityM3: logisticCapacityM3PerDay,
      deficit,
    };
  }

  /**
   * Evalúa la capacidad de amortiguación institucional
   */
  evaluateInstitutionalCapacity(indicators: {
    hasContingencyPlan: boolean;
    hasEmergencyFund: boolean;
    hasRedundantInfrastructure: boolean;
    hasProportionalInvestment: boolean;
  }): {
    score: number;
    maxScore: number;
    percentage: number;
    level: "NULA" | "BAJA" | "MODERADA" | "ALTA";
  } {
    const score = Object.values(indicators).filter(Boolean).length;
    const maxScore = Object.keys(indicators).length;
    const percentage = (score / maxScore) * 100;

    let level: "NULA" | "BAJA" | "MODERADA" | "ALTA";
    if (percentage === 0) {
      level = "NULA";
    } else if (percentage < 50) {
      level = "BAJA";
    } else if (percentage < 75) {
      level = "MODERADA";
    } else {
      level = "ALTA";
    }

    return {
      score,
      maxScore,
      percentage,
      level,
    };
  }

  /**
   * Evalúa vulnerabilidad climática basada en volatilidad
   */
  evaluateClimateVulnerability(ivc: number): {
    level: "BAJA" | "MODERADA" | "ALTA" | "MUY ALTA";
    interpretation: string;
  } {
    let level: "BAJA" | "MODERADA" | "ALTA" | "MUY ALTA";
    let interpretation: string;

    if (ivc < 0.15) {
      level = "BAJA";
      interpretation = "Precipitación relativamente estable";
    } else if (ivc < 0.25) {
      level = "MODERADA";
      interpretation = "Variabilidad climática moderada";
    } else if (ivc < 0.35) {
      level = "ALTA";
      interpretation = "Alta variabilidad climática";
    } else {
      level = "MUY ALTA";
      interpretation = "Volatilidad climática extrema";
    }

    return { level, interpretation };
  }

  /**
   * Genera evaluación integral del sistema
   */
  generateSystemEvaluation(metrics: {
    ivc: number;
    iva: number;
    isd: number;
    bas: number;
    storageSeries: number[];
    population: number;
    logisticCapacity: number;
  }): {
    waterStress: WaterStressEvaluation;
    logisticPressure: LogisticEvaluation;
    climateVulnerability: { level: "BAJA" | "MODERADA" | "ALTA" | "MUY ALTA"; interpretation: string };
    overallRisk: "BAJO" | "MODERADO" | "ALTO" | "CRÍTICO";
  } {
    const waterStress = this.evaluateWaterStress(metrics.storageSeries);
    const logisticPressure = this.evaluateLogisticPressure(
      metrics.population,
      50, // litros por persona por día
      metrics.logisticCapacity
    );
    const climateVulnerability = this.evaluateClimateVulnerability(metrics.ivc);

    // Determinar riesgo general
    let overallRisk: "BAJO" | "MODERADO" | "ALTO" | "CRÍTICO";
    if (
      waterStress.riskLevel === "CRÍTICO" ||
      logisticPressure.status === "COLAPSO LOGÍSTICO" ||
      metrics.isd > 100
    ) {
      overallRisk = "CRÍTICO";
    } else if (
      waterStress.riskLevel === "RIESGO ALTO" ||
      logisticPressure.status === "PRESIÓN LOGÍSTICA" ||
      metrics.isd > 80
    ) {
      overallRisk = "ALTO";
    } else if (waterStress.riskLevel === "RIESGO MODERADO" || metrics.isd > 50) {
      overallRisk = "MODERADO";
    } else {
      overallRisk = "BAJO";
    }

    return {
      waterStress,
      logisticPressure,
      climateVulnerability,
      overallRisk,
    };
  }

  /**
   * Clasifica la zona operativa del sistema según el ISD
   * Basado en funciones umbral definidas en métricas ingenieriles
   */
  classifyOperationalZone(isd: number): {
    zone: OperationalZone;
    description: string;
    actionRequired: string;
  } {
    let zone: OperationalZone;
    let description: string;
    let actionRequired: string;

    if (isd < 0.7) {
      zone = "ESTABLE";
      description = "Sistema opera con margen suficiente. Perturbaciones normales no comprometen funcionamiento.";
      actionRequired = "Monitoreo rutinario";
    } else if (isd < 0.9) {
      zone = "TENSIÓN";
      description = "Sistema opera cerca del límite. Perturbaciones moderadas pueden generar estrés temporal.";
      actionRequired = "Activación de protocolos de prevención";
    } else if (isd < 1.0) {
      zone = "RIESGO";
      description = "Sistema opera en saturación. Cualquier perturbación puede generar déficit.";
      actionRequired = "Activación de protocolos de contingencia";
    } else {
      zone = "DÉFICIT";
      description = "Demanda excede capacidad. Sistema en falla estructural.";
      actionRequired = "Intervención de emergencia";
    }

    return { zone, description, actionRequired };
  }

  /**
   * Evalúa legitimidad operativa del sistema
   * Basado en criterios de margen, capacidad logística, transparencia y contingencia
   */
  evaluateOperationalLegitimacy(params: {
    isd: number;
    margin: number;
    hasLogisticCapacity: boolean;
    hasCompleteData: boolean;
    hasContingencyPlan: boolean;
  }): {
    isLegitimate: boolean;
    score: number;
    maxScore: number;
    failedCriteria: string[];
  } {
    const criteria = [
      {
        name: "Margen mínimo (20-30%)",
        passed: params.margin >= 0.2,
      },
      {
        name: "Capacidad logística suficiente",
        passed: params.hasLogisticCapacity,
      },
      {
        name: "Datos públicos completos",
        passed: params.hasCompleteData,
      },
      {
        name: "Plan de contingencia verificable",
        passed: params.hasContingencyPlan,
      },
    ];

    const score = criteria.filter((c) => c.passed).length;
    const maxScore = criteria.length;
    const failedCriteria = criteria.filter((c) => !c.passed).map((c) => c.name);
    const isLegitimate = score === maxScore;

    return {
      isLegitimate,
      score,
      maxScore,
      failedCriteria,
    };
  }

  /**
   * Genera evaluación completa con métricas ingenieriles
   */
  generateEngineeringEvaluation(params: {
    isd: number;
    margin: number;
    hasLogisticCapacity: boolean;
    hasCompleteData: boolean;
    hasContingencyPlan: boolean;
  }) {
    const operationalZone = this.classifyOperationalZone(params.isd);
    const legitimacy = this.evaluateOperationalLegitimacy(params);

    return {
      operationalZone,
      legitimacy,
      interpretation: this.generateInterpretation(operationalZone.zone, legitimacy.isLegitimate),
    };
  }

  /**
   * Genera interpretación estructural basada en zona y legitimidad
   */
  private generateInterpretation(zone: OperationalZone, isLegitimate: boolean): string {
    if (zone === "ESTABLE" && isLegitimate) {
      return "El sistema opera en estado óptimo con legitimidad operativa completa.";
    } else if (zone === "ESTABLE" && !isLegitimate) {
      return "El sistema opera en zona estable pero carece de legitimidad operativa por ausencia de amortiguadores institucionales.";
    } else if (zone === "TENSIÓN" && isLegitimate) {
      return "El sistema opera en zona de tensión con legitimidad operativa. Requiere activación de protocolos de prevención.";
    } else if (zone === "TENSIÓN" && !isLegitimate) {
      return "El sistema opera en zona de tensión sin legitimidad operativa. Vulnerabilidad estructural moderada.";
    } else if (zone === "RIESGO" && isLegitimate) {
      return "El sistema opera en zona de riesgo con legitimidad operativa. Requiere activación inmediata de protocolos de contingencia.";
    } else if (zone === "RIESGO" && !isLegitimate) {
      return "El sistema opera en zona de riesgo sin legitimidad operativa. Vulnerabilidad estructural alta.";
    } else if (zone === "DÉFICIT") {
      return "El sistema opera en déficit estructural. Requiere intervención de emergencia independientemente de legitimidad operativa.";
    }
    return "Evaluación no disponible.";
  }
}
