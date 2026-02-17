import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface OperationalZonesChartProps {
  isd: number;
  legitimacy: {
    isLegitimate: boolean;
    score: number;
    maxScore: number;
    failedCriteria: string[];
  };
  operationalZone: {
    zone: "ESTABLE" | "TENSIÓN" | "RIESGO" | "DÉFICIT";
    description: string;
    actionRequired: string;
  };
}

/**
 * Componente de visualización de zonas operativas
 * Muestra clasificación del sistema según ISD y legitimidad operativa
 */
export default function OperationalZonesChart({
  isd,
  legitimacy,
  operationalZone,
}: OperationalZonesChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colores de zonas
  const zoneColors = {
    ESTABLE: isDark ? "#10b981" : "#059669",
    TENSIÓN: isDark ? "#f59e0b" : "#d97706",
    RIESGO: isDark ? "#f97316" : "#ea580c",
    DÉFICIT: isDark ? "#ef4444" : "#dc2626",
  };

  // Calcular posición del indicador en el gráfico (0-100%)
  const indicatorPosition = Math.min(isd * 100, 100);

  return (
    <div className="space-y-6">
      {/* Gráfica de Zonas Operativas */}
      <Card>
        <CardHeader>
          <CardTitle>Clasificación de Zonas Operativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Barra de zonas */}
          <div className="relative h-16 rounded-lg overflow-hidden border border-border">
            {/* Zona Estable (0-70%) */}
            <div
              className="absolute h-full"
              style={{
                left: "0%",
                width: "70%",
                backgroundColor: zoneColors.ESTABLE,
                opacity: 0.3,
              }}
            />
            {/* Zona Tensión (70-90%) */}
            <div
              className="absolute h-full"
              style={{
                left: "70%",
                width: "20%",
                backgroundColor: zoneColors.TENSIÓN,
                opacity: 0.3,
              }}
            />
            {/* Zona Riesgo (90-100%) */}
            <div
              className="absolute h-full"
              style={{
                left: "90%",
                width: "10%",
                backgroundColor: zoneColors.RIESGO,
                opacity: 0.3,
              }}
            />

            {/* Indicador de posición actual */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-foreground"
              style={{
                left: `${indicatorPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-foreground" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-foreground" />
            </div>

            {/* Etiquetas de zonas */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              <span className="text-xs font-mono font-semibold" style={{ color: zoneColors.ESTABLE }}>
                ESTABLE
              </span>
              <span className="text-xs font-mono font-semibold" style={{ color: zoneColors.TENSIÓN }}>
                TENSIÓN
              </span>
              <span className="text-xs font-mono font-semibold" style={{ color: zoneColors.RIESGO }}>
                RIESGO
              </span>
            </div>
          </div>

          {/* Valores de umbral */}
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>ISD = 0.0</span>
            <span>0.7</span>
            <span>0.9</span>
            <span>1.0</span>
          </div>

          {/* Estado actual */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: zoneColors[operationalZone.zone] }}
              />
              <span className="font-mono font-semibold text-lg">
                {operationalZone.zone}
              </span>
              <span className="text-muted-foreground">
                (ISD = {isd.toFixed(3)})
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {operationalZone.description}
            </p>
            <p className="text-sm font-medium">
              Acción requerida: {operationalZone.actionRequired}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Evaluación de Legitimidad Operativa */}
      <Card>
        <CardHeader>
          <CardTitle>Legitimidad Operativa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indicador de legitimidad */}
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${
                legitimacy.isLegitimate ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="font-semibold text-lg">
              {legitimacy.isLegitimate ? "LEGÍTIMO" : "NO LEGÍTIMO"}
            </span>
            <span className="text-muted-foreground">
              ({legitimacy.score}/{legitimacy.maxScore} criterios cumplidos)
            </span>
          </div>

          {/* Criterios no cumplidos */}
          {legitimacy.failedCriteria.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Criterios no cumplidos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {legitimacy.failedCriteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interpretación */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm">
              {legitimacy.isLegitimate
                ? "El sistema cumple con todos los criterios de legitimidad operativa: margen mínimo, capacidad logística, transparencia de datos y plan de contingencia verificable."
                : "El sistema no cumple con todos los criterios de legitimidad operativa. Esto no constituye ilegitimidad moral, sino vulnerabilidad estructural."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
