/**
 * Agent Router v2.1 - Multidominio
 * Motor dinámico basado en configuración por dominio
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { DataCollector } from "./services/dataCollector";
import { DataValidator } from "./services/dataValidator";
import { HydroModel } from "./services/hydroModel";
import { ProblemEvaluator } from "./services/problemEvaluator";
import { RegimeLogger } from "./services/regimeLogger";
import { ReportGenerator } from "./services/reportGenerator";
import { nanoid } from "nanoid";
import * as dbQueries from "./db";
import fs from "fs";
import path from "path";

/**
 * Loader dinámico de configuración por dominio
 */
function getDomainConfig(slug: string) {
  const filePath = path.join(process.cwd(), "domains", `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Configuración no encontrada para dominio: ${slug}`);
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

/**
 * Motor de escenarios genérico
 * Ejecuta modelo específico según dominio
 */
async function ejecutarEscenario(slug: string, variables: Record<string, any>) {
  switch (slug) {
    case "agua":
      return await modeloHidrico(variables);
    case "finanzas":
      return await modeloFinanciero(variables);
    case "agricultura":
      return await modeloAgricola(variables);
    case "ganaderia":
      return await modeloGanadero(variables);
    case "educacion":
      return await modeloEducativo(variables);
    case "salud":
      return await modeloSalud(variables);
    default:
      throw new Error(`Dominio no soportado: ${slug}`);
  }
}

/**
 * Modelo Hídrico (legacy, ahora dinámico)
 */
async function modeloHidrico(variables: Record<string, any>) {
  const operationId = nanoid();
  const logger = new RegimeLogger();

  logger.logOperationStart("modeloHidrico", {
    operationId,
    variables,
  });

  try {
    // 1. Recolección de datos
    const collector = new DataCollector();
    const precipitationData = await collector.fetchPrecipitation(26.7, -108.3);
    const presaLevels = await collector.fetchPresaLevels();
    const populationData = await collector.fetchPopulationData();
    const aquiferData = await collector.fetchAquiferData();

    logger.log("Datos recolectados exitosamente", "SUCCESS", "DATA_COLLECTOR");

    // 2. Validación de datos
    const validator = new DataValidator();
    const precipitationValidation = validator.validateDataset(precipitationData, {
      minLength: 3,
      requiredFields: ["year", "rainMm"],
      numericFields: [
        { field: "rainMm", min: 0, max: 2000 },
      ],
      yearField: "year",
    });

    const presaValidation = validator.validateDataset(presaLevels, {
      minLength: 3,
      requiredFields: ["year", "storageMillionM3"],
      numericFields: [
        { field: "storageMillionM3", min: 0, max: 3200 },
      ],
      yearField: "year",
    });

    if (!precipitationValidation.isValid || !presaValidation.isValid) {
      const errors = [
        ...precipitationValidation.errors,
        ...presaValidation.errors,
      ];
      logger.logOperationError("modeloHidrico", `Validación fallida: ${errors.join(", ")}`);
      throw new Error(`Validación de datos fallida: ${errors.join(", ")}`);
    }

    logger.log("Datos validados exitosamente", "SUCCESS", "DATA_VALIDATOR", {
      precipitationWarnings: precipitationValidation.warnings,
      presaWarnings: presaValidation.warnings,
    });

    // 3. Modelado hidrológico
    const hydro = new HydroModel(variables.demanda_incremental);

    // Calcular IVC (Índice de Volatilidad Climática)
    const rainValues = precipitationData.map((d) => d.rainMm);
    const ivc = hydro.calculateIVC(rainValues);

    // Calcular IVA (Índice de Volatilidad de Almacenamiento)
    const storageValues = presaLevels.map((d) => d.storageMillionM3);
    const storageMin = Math.min(...storageValues);
    const storageMax = Math.max(...storageValues);
    const iva = hydro.calculateIVA(storageMin, storageMax, 3200);

    // Calcular ISD (Índice de Saturación de Demanda)
    const demandTotal = variables.demanda_incremental / 1_000_000; // Convertir a hm³
    const isd = hydro.calculateISD(demandTotal, aquiferData.availabilityMeanAnnual);

    // Calcular BAS (Balance Acumulativo Simple)
    const bas = hydro.calculateBAS(
      aquiferData.availabilityMeanAnnual * 1_000_000, // Convertir a m³
      variables.demanda_incremental,
      variables.anos_proyecto
    );

    // Simular escenarios
    const scenarios = hydro.simulateScenarios({
      storageInitial: presaLevels[presaLevels.length - 1].storageMillionM3 * 1_000_000,
      years: variables.anos_proyecto,
      rechargeAvg: aquiferData.rechargeMeanAnnual * 1_000_000, // Convertir a m³
      extractionBase: (aquiferData.volumeConcessioned + aquiferData.dischargeCommitted) * 1_000_000,
    });

    logger.logMetrics({
      IVC: ivc,
      IVA: iva,
      ISD: isd,
      BAS_millones_m3: bas / 1_000_000,
    });

    // 4. Evaluación de problemática
    const evaluator = new ProblemEvaluator();

    const waterStress = evaluator.evaluateWaterStress(
      scenarios.stress.map((s) => s.storage)
    );

    const logisticPressure = evaluator.evaluateLogisticPressure(
      populationData.ruralPopulation,
      50, // litros por persona por día
      variables.capacidad_logistica
    );

    const climateVulnerability = evaluator.evaluateClimateVulnerability(ivc);

    const systemEvaluation = evaluator.generateSystemEvaluation({
      ivc,
      iva,
      isd,
      bas,
      storageSeries: scenarios.stress.map((s) => s.storage),
      population: populationData.ruralPopulation,
      logisticCapacity: variables.capacidad_logistica,
    });

    logger.logRiskEvaluation(waterStress.riskLevel, {
      decliningYears: waterStress.decliningYears,
      totalYears: waterStress.totalYears,
      decliningPercentage: waterStress.decliningPercentage,
    });

    logger.logLogisticStatus(logisticPressure.status, {
      dailyNeedM3: logisticPressure.dailyNeedM3,
      dailyCapacityM3: logisticPressure.dailyCapacityM3,
      deficit: logisticPressure.deficit,
    });

    // Métricas ingenieriles
    const margin = 1 - isd;
    const engineeringEvaluation = evaluator.generateEngineeringEvaluation({
      isd,
      margin,
      hasLogisticCapacity: logisticPressure.status === "CAPACIDAD SUFICIENTE",
      hasCompleteData: precipitationValidation.warnings.length === 0 && presaValidation.warnings.length === 0,
      hasContingencyPlan: false, // TODO: Obtener de datos oficiales
    });

    logger.log("Métricas ingenieriles calculadas", "SUCCESS", "PROBLEM_EVALUATOR", {
      operationalZone: engineeringEvaluation.operationalZone.zone,
      legitimacy: engineeringEvaluation.legitimacy.isLegitimate,
    });

    // 5. Generación de reporte
    const reportGenerator = new ReportGenerator();
    const report = reportGenerator.generate({
      riskLevel: waterStress.riskLevel,
      logisticStatus: logisticPressure.status,
      metrics: {
        ivc,
        iva,
        isd,
        bas,
      },
      timestamp: new Date().toISOString(),
      operationId,
    });

    logger.logOperationSuccess("modeloHidrico", {
      operationId,
      riskLevel: waterStress.riskLevel,
      logisticStatus: logisticPressure.status,
      overallRisk: systemEvaluation.overallRisk,
    });

    return {
      operationId,
      metrics: {
        ivc,
        iva,
        isd,
        bas,
      },
      waterStress,
      logisticPressure,
      climateVulnerability,
      systemEvaluation,
      scenarios,
      report,
      engineeringEvaluation,
    };
  } catch (error) {
    logger.logOperationError("modeloHidrico", error as Error);
    throw error;
  }
}

/**
 * Modelo Financiero (placeholder)
 */
async function modeloFinanciero(variables: Record<string, any>) {
  return {
    operationId: nanoid(),
    dominio: "finanzas",
    variables,
    resultado: "Modelo financiero en desarrollo",
    mensaje: "Este dominio requiere implementación de modelo específico",
  };
}

/**
 * Modelo Agrícola (placeholder)
 */
async function modeloAgricola(variables: Record<string, any>) {
  return {
    operationId: nanoid(),
    dominio: "agricultura",
    variables,
    resultado: "Modelo agrícola en desarrollo",
    mensaje: "Este dominio requiere implementación de modelo específico",
  };
}

/**
 * Modelo Ganadero (placeholder)
 */
async function modeloGanadero(variables: Record<string, any>) {
  return {
    operationId: nanoid(),
    dominio: "ganaderia",
    variables,
    resultado: "Modelo ganadero en desarrollo",
    mensaje: "Este dominio requiere implementación de modelo específico",
  };
}

/**
 * Modelo Educativo (placeholder)
 */
async function modeloEducativo(variables: Record<string, any>) {
  return {
    operationId: nanoid(),
    dominio: "educacion",
    variables,
    resultado: "Modelo educativo en desarrollo",
    mensaje: "Este dominio requiere implementación de modelo específico",
  };
}

/**
 * Modelo de Salud (placeholder)
 */
async function modeloSalud(variables: Record<string, any>) {
  return {
    operationId: nanoid(),
    dominio: "salud",
    variables,
    resultado: "Modelo de salud en desarrollo",
    mensaje: "Este dominio requiere implementación de modelo específico",
  };
}

/**
 * Router tRPC
 */
export const agentRouter = router({
  /**
   * Obtiene configuración de dominio
   */
  getConfig: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      return getDomainConfig(input.slug);
    }),

  /**
   * Ejecuta evaluación dinámica según dominio
   */
  runEvaluation: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        variables: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      return await ejecutarEscenario(input.slug, input.variables);
    }),

  /**
   * Analiza todas las investigaciones de un dominio y genera síntesis estructural
   */
  analizarDominio: publicProcedure
    .input(z.object({ dominioId: z.number() }))
    .mutation(async ({ input }) => {
      // Consultar investigaciones del dominio
      const investigaciones = await dbQueries.getInvestigacionesByDominio(input.dominioId);

      if (investigaciones.length === 0) {
        return {
          reporte: "No hay investigaciones publicadas en este dominio.",
        };
      }

      // Calcular métricas agregadas
      const irmPromedio =
        investigaciones.reduce((sum: number, inv: any) => sum + (inv.indiceRobustez || 0), 0) / investigaciones.length;

      const totalBrechas = investigaciones.reduce((sum: number, inv: any) => {
        const brechas = inv.brechas ? JSON.parse(inv.brechas) : [];
        return sum + (Array.isArray(brechas) ? brechas.length : 0);
      }, 0);

      // Generar reporte estructural
      const reporte = `SÍNTESIS ESTRUCTURAL - DOMINIO ${input.dominioId}

INVESTIGACIONES ANALIZADAS: ${investigaciones.length}

IRM PROMEDIO: ${irmPromedio.toFixed(2)}
NIVEL DE ROBUSTEZ: ${irmPromedio >= 0.7 ? "Alto" : irmPromedio >= 0.5 ? "Moderado" : "Bajo"}

BRECHAS DETECTADAS: ${totalBrechas}

RESUMEN POR INVESTIGACIÓN:
${investigaciones
  .map(
    (inv: any, idx: number) =>
      `\n${idx + 1}. ${inv.titulo}\n   IRM: ${typeof inv.indiceRobustez === 'number' ? inv.indiceRobustez.toFixed(2) : "N/A"}\n   Estado: ${typeof inv.indiceRobustez === 'number' && inv.indiceRobustez >= 0.7 ? "Robusto" : "Requiere fortalecimiento"}`
  )
  .join("")}

CONCLUSIÓN ESTRUCTURAL:
${irmPromedio >= 0.7 ? "El dominio cuenta con investigaciones robustas y datos verificables." : irmPromedio >= 0.5 ? "El dominio requiere fortalecer fuentes y verificar supuestos críticos." : "El dominio presenta brechas significativas y requiere actualización de datos."}
`;

      return { reporte };
    }),

  /**
   * Obtiene datos recolectados sin ejecutar evaluación completa
   * (solo para dominio agua por ahora)
   */
  getCollectedData: publicProcedure.query(async () => {
    const collector = new DataCollector();

    const [precipitation, presaLevels, population, aquifer] = await Promise.all([
      collector.fetchPrecipitation(26.7, -108.3),
      collector.fetchPresaLevels(),
      collector.fetchPopulationData(),
      collector.fetchAquiferData(),
    ]);

    return {
      precipitation,
      presaLevels,
      population,
      aquifer,
    };
  }),
});
