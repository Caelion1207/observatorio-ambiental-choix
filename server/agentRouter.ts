/**
 * Agent Router
 * Endpoints tRPC para el agente de recolección y evaluación dinámica
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

export const agentRouter = router({
  /**
   * Ejecuta el agente completo y retorna evaluación estructural
   */
  runEvaluation: publicProcedure
    .input(
      z.object({
        miningWaterM3PerYear: z.number().default(19_300_000),
        projectYears: z.number().default(22),
        logisticCapacityM3PerDay: z.number().default(150),
      })
    )
    .mutation(async ({ input }) => {
      const operationId = nanoid();
      const logger = new RegimeLogger();

      logger.logOperationStart("runEvaluation", {
        operationId,
        miningWaterM3PerYear: input.miningWaterM3PerYear,
        projectYears: input.projectYears,
        logisticCapacityM3PerDay: input.logisticCapacityM3PerDay,
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
          logger.logOperationError("runEvaluation", `Validación fallida: ${errors.join(", ")}`);
          throw new Error(`Validación de datos fallida: ${errors.join(", ")}`);
        }

        logger.log("Datos validados exitosamente", "SUCCESS", "DATA_VALIDATOR", {
          precipitationWarnings: precipitationValidation.warnings,
          presaWarnings: presaValidation.warnings,
        });

        // 3. Modelado hidrológico
        const hydro = new HydroModel(input.miningWaterM3PerYear);

        // Calcular IVC (Índice de Volatilidad Climática)
        const rainValues = precipitationData.map((d) => d.rainMm);
        const ivc = hydro.calculateIVC(rainValues);

        // Calcular IVA (Índice de Volatilidad de Almacenamiento)
        const storageValues = presaLevels.map((d) => d.storageMillionM3);
        const storageMin = Math.min(...storageValues);
        const storageMax = Math.max(...storageValues);
        const iva = hydro.calculateIVA(storageMin, storageMax, 3200);

        // Calcular ISD (Índice de Saturación de Demanda)
        const demandTotal = input.miningWaterM3PerYear / 1_000_000; // Convertir a hm³
        const isd = hydro.calculateISD(demandTotal, aquiferData.availabilityMeanAnnual);

        // Calcular BAS (Balance Acumulativo Simple)
        const bas = hydro.calculateBAS(
          aquiferData.availabilityMeanAnnual * 1_000_000, // Convertir a m³
          input.miningWaterM3PerYear,
          input.projectYears
        );

        // Simular escenarios
        const scenarios = hydro.simulateScenarios({
          storageInitial: presaLevels[presaLevels.length - 1].storageMillionM3 * 1_000_000,
          years: input.projectYears,
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
          input.logisticCapacityM3PerDay
        );

        const climateVulnerability = evaluator.evaluateClimateVulnerability(ivc);

        const systemEvaluation = evaluator.generateSystemEvaluation({
          ivc,
          iva,
          isd,
          bas,
          storageSeries: scenarios.stress.map((s) => s.storage),
          population: populationData.ruralPopulation,
          logisticCapacity: input.logisticCapacityM3PerDay,
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

        logger.logOperationSuccess("runEvaluation", {
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
        logger.logOperationError("runEvaluation", error as Error);
        throw error;
      }
    }),

  /**
   * Obtiene datos recolectados sin ejecutar evaluación completa
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
