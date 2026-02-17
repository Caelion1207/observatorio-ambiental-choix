/**
 * ReportGenerator Service
 * Generación automática de reportes técnicos del agente
 */

import type { RiskLevel, LogisticStatus } from "./problemEvaluator";

export interface ReportData {
  riskLevel: RiskLevel;
  logisticStatus: LogisticStatus;
  metrics: {
    ivc: number;
    iva: number;
    isd: number;
    bas: number;
    cal?: number;
    iaa?: number;
  };
  timestamp: string;
  operationId: string;
}

export class ReportGenerator {
  /**
   * Genera reporte técnico completo en formato Markdown
   */
  generate(data: ReportData): string {
    const report = `# Reporte Técnico Preliminar
## Agente de Recolección y Evaluación Dinámica

---

**Fecha de generación:** ${new Date(data.timestamp).toLocaleString("es-MX")}  
**ID de operación:** ${data.operationId}

---

## 1. Evaluación de Riesgo Hídrico

**Nivel de estrés hídrico proyectado:** ${data.riskLevel}

${this.getRiskInterpretation(data.riskLevel)}

---

## 2. Estado Logístico Municipal

**Estado:** ${data.logisticStatus}

${this.getLogisticInterpretation(data.logisticStatus)}

---

## 3. Indicadores Estructurales

### Índice de Volatilidad Climática (IVC)
- **Valor:** ${data.metrics.ivc.toFixed(3)}
- **Interpretación:** ${this.getIVCInterpretation(data.metrics.ivc)}

### Índice de Volatilidad de Almacenamiento (IVA)
- **Valor:** ${(data.metrics.iva * 100).toFixed(1)}%
- **Interpretación:** ${this.getIVAInterpretation(data.metrics.iva)}

### Índice de Saturación de Demanda (ISD)
- **Valor:** ${data.metrics.isd.toFixed(1)}%
- **Interpretación:** ${this.getISDInterpretation(data.metrics.isd)}

### Balance Acumulativo Simple (BAS)
- **Valor:** ${(data.metrics.bas / 1_000_000).toFixed(2)} millones m³
- **Interpretación:** ${this.getBASInterpretation(data.metrics.bas)}

${data.metrics.cal !== undefined ? `### Capacidad de Amortiguación Logística (CAL)
- **Valor:** ${data.metrics.cal.toFixed(1)}%
- **Interpretación:** ${this.getCALInterpretation(data.metrics.cal)}
` : ''}

${data.metrics.iaa !== undefined ? `### Índice de Amortiguación Acuífera (IAA)
- **Valor:** ${data.metrics.iaa.toFixed(1)}%
- **Interpretación:** ${this.getIAAInterpretation(data.metrics.iaa)}
` : ''}

---

## 4. Nota Metodológica

Este análisis corresponde a un **agente de prueba** diseñado para evaluar régimen operativo dinámico bajo condiciones de presión hídrica y demanda incremental.

### Características del análisis:
- **Extracción de datos públicos:** CONAGUA, DOF, INEGI
- **Modelado explícito:** Balance hídrico simple
- **Supuestos declarados:** Documentados en investigaciones del laboratorio
- **Simulación transparente:** Código auditable
- **Variables auditables:** Todas las métricas son verificables

### Limitaciones:
- No constituye predicción definitiva
- Depende de la calidad y completitud de datos públicos
- No considera eventos extremos no modelados
- Requiere validación continua con datos actualizados

---

## 5. Conclusión Estructural

${this.generateConclusion(data)}

---

**Generado por:** Laboratorio Público de Análisis Estructural  
**Versión del agente:** 1.0.0 (Prueba)  
**Protocolo:** 7 secciones de análisis estructural
`;

    return report;
  }

  private getRiskInterpretation(riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case "ESTABLE":
        return "El sistema muestra tendencia estable en almacenamiento. No se detectan señales de deterioro estructural.";
      case "RIESGO MODERADO":
        return "El sistema presenta volatilidad moderada. Se recomienda monitoreo continuo.";
      case "RIESGO ALTO":
        return "El sistema muestra tendencia decreciente sostenida. Se requiere evaluación de capacidad de amortiguación.";
      case "CRÍTICO":
        return "El sistema opera en límite estructural. Se requiere intervención inmediata para fortalecer capacidad de amortiguación.";
    }
  }

  private getLogisticInterpretation(status: LogisticStatus): string {
    switch (status) {
      case "CAPACIDAD SUFICIENTE":
        return "La capacidad logística municipal es suficiente para cubrir la demanda actual.";
      case "PRESIÓN LOGÍSTICA":
        return "La capacidad logística opera cerca de su límite. Se recomienda expansión de flota.";
      case "COLAPSO LOGÍSTICO":
        return "La capacidad logística es insuficiente. El cuello de botella es la distribución, no la disponibilidad de agua.";
    }
  }

  private getIVCInterpretation(ivc: number): string {
    if (ivc < 0.15) return "Baja volatilidad climática";
    if (ivc < 0.25) return "Volatilidad climática moderada";
    if (ivc < 0.35) return "Alta volatilidad climática";
    return "Volatilidad climática extrema";
  }

  private getIVAInterpretation(iva: number): string {
    if (iva < 0.3) return "Baja volatilidad de almacenamiento";
    if (iva < 0.5) return "Volatilidad moderada de almacenamiento";
    if (iva < 0.7) return "Alta volatilidad de almacenamiento";
    return "Volatilidad extrema de almacenamiento (régimen boom-bust)";
  }

  private getISDInterpretation(isd: number): string {
    if (isd < 50) return "Demanda sostenible";
    if (isd < 80) return "Demanda en límite de sostenibilidad";
    if (isd < 100) return "Demanda cercana a disponibilidad total";
    return "Demanda excede disponibilidad anual";
  }

  private getBASInterpretation(bas: number): string {
    if (bas > 0) return "Balance acumulativo positivo";
    if (bas > -100_000_000) return "Déficit acumulativo moderado";
    return "Déficit acumulativo significativo";
  }

  private getCALInterpretation(cal: number): string {
    if (cal > 80) return "Capacidad logística adecuada";
    if (cal > 50) return "Capacidad logística suficiente pero ajustada";
    if (cal > 20) return "Capacidad logística insuficiente";
    return "Capacidad logística crítica";
  }

  private getIAAInterpretation(iaa: number): string {
    if (iaa > 50) return "Alta capacidad de amortiguación del acuífero";
    if (iaa > 25) return "Capacidad moderada de amortiguación del acuífero";
    if (iaa > 10) return "Baja capacidad de amortiguación del acuífero";
    return "Capacidad de amortiguación del acuífero muy limitada";
  }

  private generateConclusion(data: ReportData): string {
    const conclusions: string[] = [];

    if (data.logisticStatus === "COLAPSO LOGÍSTICO") {
      conclusions.push(
        "**El cuello de botella del sistema es la capacidad logística de distribución, no la disponibilidad total de agua.**"
      );
    }

    if (data.metrics.iva > 0.5) {
      conclusions.push(
        "**El sistema opera en régimen boom-bust con alta dependencia de eventos extremos de lluvia.**"
      );
    }

    if (data.metrics.isd > 80) {
      conclusions.push(
        "**La demanda total opera cerca del límite de disponibilidad anual del acuífero.**"
      );
    }

    if (conclusions.length === 0) {
      conclusions.push(
        "**El sistema presenta condiciones estructurales estables bajo los parámetros actuales.**"
      );
    }

    conclusions.push(
      "\n**Nota:** Este análisis no constituye acusación. Es modelado estructural basado en datos públicos y supuestos declarados."
    );

    return conclusions.join("\n\n");
  }
}
