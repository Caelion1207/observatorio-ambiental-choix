import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, TrendingUp, FileText, Database } from "lucide-react";

export default function Agente() {
  const [selectedDominio, setSelectedDominio] = useState<string>("");
  const [analisisGenerado, setAnalisisGenerado] = useState(false);

  // Obtener dominios activos
  const { data: dominios } = trpc.dominios.list.useQuery();

  // Obtener investigaciones del dominio seleccionado
  const { data: investigaciones, isLoading: investigacionesLoading } = trpc.investigaciones.list.useQuery(
    { dominioId: selectedDominio ? parseInt(selectedDominio) : undefined },
    { enabled: !!selectedDominio }
  );

  // Generar análisis estructural
  const generarAnalisis = trpc.agent.analizarDominio.useMutation({
    onSuccess: () => {
      setAnalisisGenerado(true);
    },
  });

  const handleGenerarAnalisis = () => {
    if (!selectedDominio) return;
    generarAnalisis.mutate({ dominioId: parseInt(selectedDominio) });
  };

  // Calcular métricas agregadas
  const calcularMetricas = () => {
    if (!investigaciones || investigaciones.length === 0) return null;

    const irmPromedio =
      investigaciones.reduce((sum, inv) => {
        const irm = typeof inv.indiceRobustez === 'number' ? inv.indiceRobustez : parseFloat(inv.indiceRobustez as string) || 0;
        return sum + irm;
      }, 0) / investigaciones.length;

    const totalBrechas = investigaciones.reduce((sum, inv) => {
      let brechas = [];
      try {
        brechas = inv.brechas ? JSON.parse(inv.brechas) : [];
      } catch (e) {
        // Campo brechas contiene texto narrativo Markdown, contar ocurrencias de "**Brecha"
        const brechasText = inv.brechas || '';
        const matches = brechasText.match(/\*\*Brecha \d+:/g);
        return sum + (matches ? matches.length : 0);
      }
      return sum + (Array.isArray(brechas) ? brechas.length : 0);
    }, 0);

    const totalSupuestos = investigaciones.reduce((sum, inv) => {
      let supuestos = [];
      try {
        supuestos = inv.supuestosEstructurados ? JSON.parse(inv.supuestosEstructurados) : [];
      } catch (e) {
        // Campo supuestosEstructurados contiene JSON mal formado
        supuestos = [];
      }
      return sum + (Array.isArray(supuestos) ? supuestos.length : 0);
    }, 0);

    return {
      irmPromedio: irmPromedio.toFixed(2),
      totalInvestigaciones: investigaciones.length,
      totalBrechas,
      totalSupuestos,
      nivelRiesgo: irmPromedio >= 0.7 ? "Bajo" : irmPromedio >= 0.5 ? "Moderado" : "Alto",
    };
  };

  const metricas = calcularMetricas();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Agente de Síntesis Estructural</h1>
          <p className="text-muted-foreground">
            Lector ejecutivo automático que sintetiza investigaciones existentes por dominio. No simula, no calcula, solo
            extrae y resume estructura.
          </p>
        </div>

        {/* Selector de Dominio */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Dominio</CardTitle>
            <CardDescription>
              Elige un dominio para analizar todas las investigaciones asociadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Dominio de Análisis</label>
                <Select value={selectedDominio} onValueChange={setSelectedDominio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dominio" />
                  </SelectTrigger>
                  <SelectContent>
                    {dominios
                      ?.filter((d) => d.activo)
                      .map((dominio) => (
                        <SelectItem key={dominio.id} value={dominio.id.toString()}>
                          {dominio.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerarAnalisis}
                disabled={!selectedDominio || investigacionesLoading || generarAnalisis.isPending}
              >
                {generarAnalisis.isPending ? "Generando..." : "Generar Síntesis"}
              </Button>
            </div>

            {selectedDominio && !investigacionesLoading && investigaciones && investigaciones.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No hay investigaciones publicadas en este dominio. El agente requiere al menos una investigación para
                  generar síntesis.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Métricas Agregadas */}
        {metricas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Investigaciones</CardDescription>
                <CardTitle className="text-3xl">{metricas.totalInvestigaciones}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Publicadas en este dominio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>IRM Promedio</CardDescription>
                <CardTitle className="text-3xl">{metricas.irmPromedio}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    Number(metricas.irmPromedio) >= 0.7
                      ? "default"
                      : Number(metricas.irmPromedio) >= 0.5
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {Number(metricas.irmPromedio) >= 0.7
                    ? "Robusto"
                    : Number(metricas.irmPromedio) >= 0.5
                    ? "Moderado"
                    : "Débil"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Brechas Detectadas</CardDescription>
                <CardTitle className="text-3xl">{metricas.totalBrechas}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Datos faltantes o no públicos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Nivel de Riesgo</CardDescription>
                <CardTitle className="text-3xl">{metricas.nivelRiesgo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Basado en IRM promedio</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resumen Estructural */}
        {investigaciones && investigaciones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen Estructural
              </CardTitle>
              <CardDescription>Síntesis automática de investigaciones en el dominio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Qué evalúa el dominio</h3>
                <p className="text-sm text-muted-foreground">
                  {dominios?.find((d) => d.id === parseInt(selectedDominio))?.descripcion}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Estado General</h3>
                <ul className="space-y-2">
                  {investigaciones.map((inv) => (
                    <li key={inv.id} className="flex items-start gap-2 text-sm">
                      {typeof inv.indiceRobustez === 'number' && inv.indiceRobustez >= 0.7 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-medium">{inv.titulo}</span>
                        <span className="text-muted-foreground"> - IRM: {inv.indiceRobustez ? Number(inv.indiceRobustez).toFixed(2) : "N/A"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Brechas Comunes</h3>
                <div className="space-y-2">
                  {investigaciones.map((inv) => {
                    let brechas = [];
                    try {
                      brechas = inv.brechas ? JSON.parse(inv.brechas) : [];
                    } catch (e) {
                      // Campo brechas contiene texto narrativo, no JSON
                      brechas = [];
                    }
                    if (!Array.isArray(brechas) || brechas.length === 0) return null;
                    return (
                      <div key={inv.id} className="text-sm">
                        <p className="font-medium text-muted-foreground">{inv.titulo}:</p>
                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                          {brechas.slice(0, 2).map((brecha: string, idx: number) => (
                            <li key={idx}>{brecha}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reporte de Síntesis */}
        {analisisGenerado && generarAnalisis.data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reporte de Síntesis
              </CardTitle>
              <CardDescription>Análisis estructural sin narrativa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-wrap">{generarAnalisis.data.reporte}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nota Metodológica */}
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Nota:</strong> Este agente no simula ni calcula. Solo extrae y sintetiza información de
            investigaciones existentes. No requiere inputs manuales porque usa lo que ya está en la plataforma.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
