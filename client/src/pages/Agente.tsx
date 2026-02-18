import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Streamdown } from "streamdown";
import AgenteCharts from "@/components/AgenteCharts";
import OperationalZonesChart from "@/components/OperationalZonesChart";

export default function Agente() {
  // Estado dinámico por dominio
  const [dominioSlug, setDominioSlug] = useState<string>("agua");
  const [variables, setVariables] = useState<Record<string, any>>({});

  // Obtener dominios disponibles
  const { data: dominios } = trpc.dominios.list.useQuery();

  // Obtener configuración del dominio seleccionado
  const { data: config, isLoading: configLoading } = trpc.agent.getConfig.useQuery(
    { slug: dominioSlug },
    { enabled: !!dominioSlug }
  );

  // Ejecutar evaluación
  const runEvaluation = trpc.agent.runEvaluation.useMutation();

  // Datos recolectados (solo para agua)
  const collectedData = trpc.agent.getCollectedData.useQuery(undefined, {
    enabled: dominioSlug === "agua",
  });

  // Inicializar variables con valores por defecto cuando cambia configuración
  useEffect(() => {
    if (config) {
      const defaultVariables: Record<string, any> = {};
      config.variables.forEach((v: any) => {
        defaultVariables[v.key] = v.default;
      });
      setVariables(defaultVariables);
    }
  }, [config]);

  const handleRunEvaluation = () => {
    runEvaluation.mutate({
      slug: dominioSlug,
      variables,
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
                  Selecciona dominio y ajusta parámetros de simulación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selector de Dominio */}
                <div className="space-y-2">
                  <Label htmlFor="dominio">Dominio de Análisis</Label>
                  <Select
                    value={dominioSlug}
                    onValueChange={(value) => setDominioSlug(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un dominio" />
                    </SelectTrigger>
                    <SelectContent>
                      {dominios
                        ?.filter((d) => d.activo)
                        .map((dominio) => (
                          <SelectItem key={dominio.id} value={dominio.slug}>
                            {dominio.icono} {dominio.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Variables Dinámicas */}
                {configLoading ? (
                  <div className="text-center text-muted-foreground py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </div>
                ) : config ? (
                  <>
                    {config.variables.map((variable: any) => (
                      <div key={variable.key} className="space-y-2">
                        <Label htmlFor={variable.key}>{variable.label}</Label>
                        <Input
                          id={variable.key}
                          type={variable.type}
                          value={variables[variable.key] || variable.default}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              [variable.key]:
                                variable.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            })
                          }
                          min={variable.min}
                          max={variable.max}
                          step={variable.step}
                        />
                        <p className="text-xs text-gray-500">
                          Valor por defecto: {variable.default}
                        </p>
                      </div>
                    ))}
                  </>
                ) : null}

                <Button
                  onClick={handleRunEvaluation}
                  disabled={runEvaluation.isPending || !config}
                  className="w-full"
                >
                  {runEvaluation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Ejecutar Evaluación
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-2 space-y-6">
            {runEvaluation.data && (
              <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="metricas">Métricas</TabsTrigger>
                  <TabsTrigger value="reporte">Reporte</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="space-y-4">
                  {/* Resultado Genérico */}
                  {runEvaluation.data && 'dominio' in runEvaluation.data ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resultado de Evaluación</CardTitle>
                        <CardDescription>
                          Dominio: {runEvaluation.data.dominio}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                            Variables Evaluadas
                          </h3>
                          <pre className="text-xs bg-gray-100 p-3 rounded">
                            {JSON.stringify(runEvaluation.data.variables, null, 2)}
                          </pre>
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Estado del Modelo</AlertTitle>
                          <AlertDescription>
                            {runEvaluation.data.mensaje}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Resultado Hídrico (legacy) */}
                      {runEvaluation.data && 'waterStress' in runEvaluation.data && (
                        <>
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                {getRiskIcon(runEvaluation.data.waterStress.riskLevel)}
                                Nivel de Riesgo Hídrico
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div
                                  className={`text-2xl font-bold ${getRiskColor(
                                    runEvaluation.data.waterStress.riskLevel
                                  )}`}
                                >
                                  {runEvaluation.data.waterStress.riskLevel}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {runEvaluation.data.waterStress.decliningYears} de{" "}
                                  {runEvaluation.data.waterStress.totalYears} años con
                                  tendencia decreciente (
                                  {runEvaluation.data.waterStress.decliningPercentage.toFixed(
                                    1
                                  )}
                                  %)
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Estado Logístico</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div
                                  className={`text-xl font-semibold ${
                                    runEvaluation.data.logisticPressure.status ===
                                    "CAPACIDAD SUFICIENTE"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {runEvaluation.data.logisticPressure.status}
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    Necesidad diaria:{" "}
                                    {runEvaluation.data.logisticPressure.dailyNeedM3.toFixed(
                                      2
                                    )}{" "}
                                    m³/día
                                  </p>
                                  <p>
                                    Capacidad:{" "}
                                    {runEvaluation.data.logisticPressure.dailyCapacityM3}{" "}
                                    m³/día
                                  </p>
                                  {runEvaluation.data.logisticPressure.deficit > 0 && (
                                    <p className="text-red-600 font-medium">
                                      Déficit:{" "}
                                      {runEvaluation.data.logisticPressure.deficit.toFixed(
                                        2
                                      )}{" "}
                                      m³/día
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="metricas" className="space-y-4">
                  {runEvaluation.data && 'metrics' in runEvaluation.data ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Métricas Calculadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">IVC</div>
                              <div className="text-2xl font-bold">
                                {runEvaluation.data.metrics.ivc.toFixed(3)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">IVA</div>
                              <div className="text-2xl font-bold">
                                {runEvaluation.data.metrics.iva.toFixed(3)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">ISD</div>
                              <div className="text-2xl font-bold">
                                {runEvaluation.data.metrics.isd.toFixed(3)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">
                                BAS (millones m³)
                              </div>
                              <div className="text-2xl font-bold">
                                {(runEvaluation.data.metrics.bas / 1_000_000).toFixed(
                                  2
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {runEvaluation.data && 'scenarios' in runEvaluation.data && 'metrics' in runEvaluation.data && (
                        <AgenteCharts 
                          scenarios={runEvaluation.data.scenarios}
                          metrics={runEvaluation.data.metrics}
                        />
                      )}

                      {runEvaluation.data && 'engineeringEvaluation' in runEvaluation.data && 'metrics' in runEvaluation.data && (
                        <OperationalZonesChart
                          isd={runEvaluation.data.metrics.isd}
                          legitimacy={runEvaluation.data.engineeringEvaluation.legitimacy}
                          operationalZone={runEvaluation.data.engineeringEvaluation.operationalZone}
                        />
                      )}
                    </>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Métricas no disponibles
                        </h3>
                        <p className="text-muted-foreground">
                          Este dominio aún no tiene métricas implementadas.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="reporte">
                  {runEvaluation.data && 'report' in runEvaluation.data ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Reporte de Evaluación</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <Streamdown>{runEvaluation.data.report}</Streamdown>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Reporte no disponible
                        </h3>
                        <p className="text-muted-foreground">
                          Este dominio aún no genera reportes automáticos.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {!runEvaluation.data && !runEvaluation.isPending && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Ejecuta una evaluación
                  </h3>
                  <p className="text-gray-600">
                    Selecciona un dominio, ajusta los parámetros y presiona
                    "Ejecutar Evaluación" para comenzar.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Datos recolectados (solo agua) */}
            {dominioSlug === "agua" && collectedData.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Datos Recolectados</CardTitle>
                  <CardDescription>
                    Información extraída de fuentes oficiales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="precipitacion">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="precipitacion">Precipitación</TabsTrigger>
                      <TabsTrigger value="presa">Presa</TabsTrigger>
                      <TabsTrigger value="poblacion">Población</TabsTrigger>
                      <TabsTrigger value="acuifero">Acuífero</TabsTrigger>
                    </TabsList>

                    <TabsContent value="precipitacion">
                      <div className="text-sm">
                        <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(collectedData.data.precipitation, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="presa">
                      <div className="text-sm">
                        <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(collectedData.data.presaLevels, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="poblacion">
                      <div className="text-sm">
                        <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(collectedData.data.population, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="acuifero">
                      <div className="text-sm">
                        <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(collectedData.data.aquifer, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
