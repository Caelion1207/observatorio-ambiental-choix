/**
 * RegimeLogger Service
 * Registro de operaciones del agente de evaluación dinámica
 */

import { writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  component: string;
  message: string;
  metadata?: Record<string, any>;
}

export class RegimeLogger {
  private logFilePath: string;

  constructor(logFileName: string = "regime_log.txt") {
    this.logFilePath = join(process.cwd(), logFileName);
    
    // Crear archivo de log si no existe
    if (!existsSync(this.logFilePath)) {
      writeFileSync(
        this.logFilePath,
        `=== REGIME LOG - Agente de Recolección y Evaluación Dinámica ===\n` +
        `Inicio de registro: ${new Date().toISOString()}\n\n`,
        "utf-8"
      );
    }
  }

  /**
   * Registra un mensaje en el log
   */
  log(message: string, level: LogEntry["level"] = "INFO", component: string = "AGENT", metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      metadata,
    };

    const logLine = this.formatLogEntry(entry);
    
    // Escribir en archivo
    appendFileSync(this.logFilePath, logLine + "\n", "utf-8");
    
    // También imprimir en consola
    console.log(logLine);
  }

  /**
   * Formatea una entrada de log
   */
  private formatLogEntry(entry: LogEntry): string {
    let formatted = `[${entry.timestamp}] [${entry.level}] [${entry.component}] ${entry.message}`;
    
    if (entry.metadata) {
      formatted += ` | Metadata: ${JSON.stringify(entry.metadata)}`;
    }
    
    return formatted;
  }

  /**
   * Registra inicio de operación
   */
  logOperationStart(operationName: string, params?: Record<string, any>): void {
    this.log(`Iniciando operación: ${operationName}`, "INFO", "OPERATION", params);
  }

  /**
   * Registra finalización exitosa de operación
   */
  logOperationSuccess(operationName: string, result?: Record<string, any>): void {
    this.log(`Operación completada: ${operationName}`, "SUCCESS", "OPERATION", result);
  }

  /**
   * Registra error en operación
   */
  logOperationError(operationName: string, error: Error | string): void {
    const errorMessage = error instanceof Error ? error.message : error;
    this.log(`Error en operación: ${operationName} - ${errorMessage}`, "ERROR", "OPERATION");
  }

  /**
   * Registra advertencia
   */
  logWarning(message: string, component: string = "AGENT"): void {
    this.log(message, "WARNING", component);
  }

  /**
   * Registra métricas calculadas
   */
  logMetrics(metrics: Record<string, number | string>): void {
    this.log("Métricas calculadas", "INFO", "METRICS", metrics);
  }

  /**
   * Registra evaluación de riesgo
   */
  logRiskEvaluation(riskLevel: string, details?: Record<string, any>): void {
    this.log(`Evaluación de riesgo: ${riskLevel}`, "INFO", "EVALUATION", details);
  }

  /**
   * Registra estado logístico
   */
  logLogisticStatus(status: string, details?: Record<string, any>): void {
    this.log(`Estado logístico: ${status}`, "INFO", "LOGISTICS", details);
  }
}
