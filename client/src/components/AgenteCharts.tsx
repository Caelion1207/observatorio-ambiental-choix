import ScientificChart from "./ScientificChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AgenteChartsProps {
  scenarios: {
    base: Array<{ year: number; storage: number }>;
    stress: Array<{ year: number; storage: number }>;
    extreme: Array<{ year: number; storage: number }>;
  };
  metrics: {
    ivc: number;
    iva: number;
    isd: number;
    bas: number;
  };
}

export default function AgenteCharts({ scenarios, metrics }: AgenteChartsProps) {
  // Preparar datos para gráfica de escenarios
  const scenariosData = scenarios.base.map((basePoint, index) => ({
    year: basePoint.year,
    base: basePoint.storage / 1_000_000, // Convertir a millones m³
    stress: scenarios.stress[index]?.storage / 1_000_000 || 0,
    extreme: scenarios.extreme[index]?.storage / 1_000_000 || 0,
  }));

  // Preparar datos para gráfica de indicadores
  const metricsData = [
    { indicator: "IVC", value: metrics.ivc, label: "Índice de Volatilidad Climática" },
    { indicator: "IVA", value: metrics.iva * 100, label: "Índice de Volatilidad de Almacenamiento (%)" },
    { indicator: "ISD", value: metrics.isd, label: "Índice de Saturación de Demanda (%)" },
  ];

  return (
    <div className="space-y-6">
      {/* Gráfica de escenarios proyectados */}
      <Card>
        <CardHeader>
          <CardTitle>Proyección de Escenarios</CardTitle>
          <CardDescription>
            Simulación de almacenamiento del acuífero bajo tres escenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScientificChart
            data={scenariosData}
            type="line"
            xKey="year"
            yKeys={[
              { key: "base", label: "Escenario Base", color: "hsl(var(--chart-1))" },
              { key: "stress", label: "Escenario de Estrés", color: "hsl(var(--chart-4))" },
              { key: "extreme", label: "Escenario Extremo", color: "hsl(var(--chart-5))" },
            ]}
            title=""
            xLabel="Año"
            yLabel="Almacenamiento (millones m³)"
            height={400}
          />
        </CardContent>
      </Card>

      {/* Gráfica de indicadores estructurales */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Estructurales</CardTitle>
          <CardDescription>
            Métricas clave del sistema hídrico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScientificChart
            data={metricsData}
            type="bar"
            xKey="indicator"
            yKeys={[
              { key: "value", label: "Valor", color: "hsl(var(--chart-2))" },
            ]}
            title=""
            xLabel="Indicador"
            yLabel="Valor"
            height={300}
          />
        </CardContent>
      </Card>

      {/* Tabla de métricas detalladas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metricsData.map((metric) => (
              <div key={metric.indicator} className="flex justify-between items-center border-b border-border pb-2">
                <div>
                  <p className="text-sm font-medium">{metric.indicator}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
                <p className="text-lg font-mono font-semibold">{metric.value.toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center border-b border-border pb-2">
              <div>
                <p className="text-sm font-medium">BAS</p>
                <p className="text-xs text-muted-foreground">Balance Acumulativo Simple (millones m³)</p>
              </div>
              <p className="text-lg font-mono font-semibold">
                {(metrics.bas / 1_000_000).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
