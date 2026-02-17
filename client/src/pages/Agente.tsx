import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Streamdown } from "streamdown";

export default function Agente() {
  const [miningWaterM3PerYear, setMiningWaterM3PerYear] = useState(19_300_000);
  const [projectYears, setProjectYears] = useState(22);
  const [logisticCapacityM3PerDay, setLogisticCapacityM3PerDay] = useState(150);

  const runEvaluation = trpc.agent.runEvaluation.useMutation();
  const collectedData = trpc.agent.getCollectedData.useQuery();

  const handleRunEvaluation = () => {
    runEvaluation.mutate({
      miningWaterM3PerYear,
      projectYears,
      logisticCapacityM3PerDay,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "ESTABLE":
        return "text-green-600";
      case "RIESGO MODERADO":
        return "text-yellow-600";
      case "RIESGO ALTO":
        return "text-orange-600";
      case "CRÍTICO":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "ESTABLE":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "RIESGO MODERADO":
        return <Info className="h-5 w-5 text-yellow-600" />;
      case "RIESGO ALTO":
      case "CRÍTICO":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agente de Recolección y Evaluación Dinámica
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Sistema automatizado de análisis estructural basado en extracción de datos públicos,
            modelado explícito, supuestos declarados, simulación transparente y variables auditables.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de configuración */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Agente</CardTitle>
                <CardDescription>
                  Ajusta los parámetros de simulación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mining-water">
                    Demanda Incremental Anual (m³/año)
                  </Label>
                  <Input
                    id="mining-water"
                    type="number"
                    value={miningWaterM3PerYear}
                    onChange={(e) => setMiningWaterM3PerYear(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    Valor por defecto: 19,300,000 m³/año
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-years">
                    Años de Proyección
                  </Label>
                  <Input
                    id="project-years"
                    type="number"
                    value={projectYears}
                    onChange={(e) => setProjectYears(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    Valor por defecto: 22 años
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logistic-capacity">
                    Capacidad Logística (m³/día)
                  </Label>
                  <Input
                    id="logistic-capacity"
                    type="number"
                    value={logisticCapacityM3PerDay}
                    onChange={(e) => setLogisticCapacityM3PerDay(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    Valor por defecto: 150 m³/día
                  </p>
                </div>

                <Button
                  onClick={handleRunEvaluation}
                  disabled={runEvaluation.isPending}
                  className="w-full"
                >
                  {runEvaluation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando Evaluación...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar Evaluación
                    </>
                  )}
                </Button>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Nota Metodológica</AlertTitle>
                  <AlertDescription className="text-xs">
                    Este agente no constituye acusación. Es modelado estructural basado en datos
                    públicos y supuestos declarados.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Datos recolectados */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Datos Recolectados</CardTitle>
              </CardHeader>
              <CardContent>
                {collectedData.isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
                {collectedData.data && (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Precipitación</p>
                      <p className="text-gray-600">
                        {collectedData.data.precipitation.length} años de datos
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Presa Huites</p>
                      <p className="text-gray-600">
                        {collectedData.data.presaLevels.length} registros
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Población</p>
                      <p className="text-gray-600">
                        {collectedData.data.population.totalPopulation.toLocaleString()} habitantes
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Acuífero</p>
                      <p className="text-gray-600">
                        Disponibilidad: {collectedData.data.aquifer.availabilityMeanAnnual} hm³/año
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-2">
            {runEvaluation.data && (
              <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="metricas">Métricas</TabsTrigger>
                  <TabsTrigger value="escenarios">Escenarios</TabsTrigger>
                  <TabsTrigger value="reporte">Reporte</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluación Estructural del Sistema</CardTitle>
                      <CardDescription>
                        ID de operación: {runEvaluation.data.operationId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Riesgo general */}
                      <Alert>
                        {getRiskIcon(runEvaluation.data.systemEvaluation.overallRisk)}
                        <AlertTitle>Riesgo General del Sistema</AlertTitle>
                        <AlertDescription className={getRiskColor(runEvaluation.data.systemEvaluation.overallRisk)}>
                          {runEvaluation.data.systemEvaluation.overallRisk}
                        </AlertDescription>
                      </Alert>

                      {/* Estrés hídrico */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {getRiskIcon(runEvaluation.data.waterStress.riskLevel)}
                          <h3 className="font-semibold">Estrés Hídrico</h3>
                        </div>
                        <p className={`text-lg font-bold ${getRiskColor(runEvaluation.data.waterStress.riskLevel)}`}>
                          {runEvaluation.data.waterStress.riskLevel}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {runEvaluation.data.waterStress.decliningYears} de {runEvaluation.data.waterStress.totalYears} años
                          con tendencia decreciente ({runEvaluation.data.waterStress.decliningPercentage.toFixed(1)}%)
                        </p>
                      </div>

                      {/* Presión logística */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Presión Logística</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {runEvaluation.data.logisticPressure.status}
                        </p>
                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <p>Demanda diaria: {runEvaluation.data.logisticPressure.dailyNeedM3.toFixed(1)} m³</p>
                          <p>Capacidad diaria: {runEvaluation.data.logisticPressure.dailyCapacityM3} m³</p>
                          <p>Déficit: {runEvaluation.data.logisticPressure.deficit.toFixed(1)} m³</p>
                        </div>
                      </div>

                      {/* Vulnerabilidad climática */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Vulnerabilidad Climática</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {runEvaluation.data.climateVulnerability.level}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {runEvaluation.data.climateVulnerability.interpretation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metricas" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Indicadores Estructurales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-600">IVC</p>
                          <p className="text-2xl font-bold">{runEvaluation.data.metrics.ivc.toFixed(3)}</p>
                          <p className="text-xs text-gray-500">Índice de Volatilidad Climática</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-600">IVA</p>
                          <p className="text-2xl font-bold">{(runEvaluation.data.metrics.iva * 100).toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Índice de Volatilidad de Almacenamiento</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-600">ISD</p>
                          <p className="text-2xl font-bold">{runEvaluation.data.metrics.isd.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Índice de Saturación de Demanda</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-gray-600">BAS</p>
                          <p className="text-2xl font-bold">
                            {(runEvaluation.data.metrics.bas / 1_000_000).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Balance Acumulativo Simple (millones m³)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="escenarios" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proyección de Escenarios</CardTitle>
                      <CardDescription>
                        Simulación a {projectYears} años
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Escenario Base</h3>
                          <p className="text-sm text-gray-600">Sin nueva demanda</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Almacenamiento final: {(runEvaluation.data.scenarios.base[runEvaluation.data.scenarios.base.length - 1].storage / 1_000_000).toFixed(2)} millones m³
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Escenario de Estrés</h3>
                          <p className="text-sm text-gray-600">Con nueva demanda + reducción de recarga 10%</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Almacenamiento final: {(runEvaluation.data.scenarios.stress[runEvaluation.data.scenarios.stress.length - 1].storage / 1_000_000).toFixed(2)} millones m³
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Escenario Extremo</h3>
                          <p className="text-sm text-gray-600">Con nueva demanda + reducción de recarga 20%</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Almacenamiento final: {(runEvaluation.data.scenarios.extreme[runEvaluation.data.scenarios.extreme.length - 1].storage / 1_000_000).toFixed(2)} millones m³
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reporte" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte Técnico Completo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <Streamdown>{runEvaluation.data.report}</Streamdown>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {!runEvaluation.data && !runEvaluation.isPending && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Play className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">
                    Configura los parámetros y ejecuta el agente para ver los resultados
                  </p>
                </CardContent>
              </Card>
            )}

            {runEvaluation.isError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error en la Evaluación</AlertTitle>
                <AlertDescription>
                  {runEvaluation.error.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
