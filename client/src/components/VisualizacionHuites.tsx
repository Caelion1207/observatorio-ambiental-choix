import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScientificChart from "@/components/ScientificChart";

export default function VisualizacionHuites() {
  // Datos verificados de la tabla maestra
  const datosAlmacenamiento = [
    { fecha: "Ene 2025", almacenamiento: 59, porcentaje: 1.9 },
    { fecha: "Mar 2025", almacenamiento: null, porcentaje: 3.6 },
    { fecha: "Jun 2025", almacenamiento: null, porcentaje: 15.6 },
    { fecha: "Jul 2025", almacenamiento: 184.3, porcentaje: 5.8 },
    { fecha: "Ago 2025", almacenamiento: 793.1, porcentaje: 24.8 },
    { fecha: "Sep 2025", almacenamiento: 1925, porcentaje: 44.9 },
    { fecha: "Oct 2025", almacenamiento: 2097.3, porcentaje: 65.5 },
    { fecha: "Ene 8, 2026", almacenamiento: 556.3, porcentaje: 17.4 },
    { fecha: "Ene 9, 2026", almacenamiento: 552.8, porcentaje: 17.3 },
    { fecha: "Ene 12, 2026", almacenamiento: 552.8, porcentaje: 17.3 },
    { fecha: "Ene 26, 2026", almacenamiento: 573.9, porcentaje: 17.9 },
  ];

  // Calcular volatilidad entre puntos consecutivos
  const calcularVolatilidad = () => {
    const puntosConDatos = datosAlmacenamiento.filter(d => d.almacenamiento !== null);
    if (puntosConDatos.length < 2) return 0;
    
    const max = Math.max(...puntosConDatos.map(d => d.porcentaje));
    const min = Math.min(...puntosConDatos.map(d => d.porcentaje));
    return ((max - min) / 100 * 100).toFixed(1);
  };

  const volatilidad = calcularVolatilidad();

  return (
    <div className="space-y-6">
      {/* Tarjeta de métricas clave */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Capacidad Total</CardDescription>
            <CardTitle className="text-3xl">~3,200 Mm³</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Presa Luis Donaldo Colosio (Huites)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Almacenamiento Actual</CardDescription>
            <CardTitle className="text-3xl">573.9 Mm³</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">17.9% de capacidad (Ene 26, 2026)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Volatilidad del Sistema</CardDescription>
            <CardTitle className="text-3xl">{volatilidad}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Variación máxima Ene-Oct 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de serie temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Serie Temporal de Almacenamiento (2025-2026)</CardTitle>
          <CardDescription>
            Datos verificados de CONAGUA. Los puntos sin volumen absoluto muestran solo el porcentaje reportado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScientificChart
            data={datosAlmacenamiento}
            type="line"
            xKey="fecha"
            yKeys={[
              { key: "porcentaje", label: "Porcentaje de Capacidad (%)", color: "hsl(var(--chart-1))" },
            ]}
            title=""
            xLabel="Fecha"
            yLabel="Porcentaje de Capacidad (%)"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Interpretación estructural */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Interpretación Estructural</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Alta volatilidad:</strong> El sistema presenta variaciones superiores al 60% de capacidad 
            en periodos de 3-4 meses, operando en régimen boom-bust dependiente de eventos extremos de lluvia.
          </p>
          <p>
            <strong>Patrón observado:</strong> De enero 2025 (~1.9%) a octubre 2025 (~65.5%) se registró un 
            incremento de 63.6 puntos porcentuales en 9 meses. De octubre 2025 a enero 2026 se observó un 
            descenso de 47.6 puntos porcentuales en 3 meses.
          </p>
          <p>
            <strong>Limitación de datos:</strong> No se cuenta con serie histórica completa mensual 2015-2026. 
            Los datos presentados son puntos verificados de fuentes oficiales, no una serie temporal continua.
          </p>
        </CardContent>
      </Card>

      {/* Nota sobre disponibilidad de datos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nota sobre Disponibilidad de Datos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Los datos posteriores a septiembre 2025 son limitados. La serie histórica completa mensual 
            2015-2026 solicitada en el análisis estructural <strong>no está disponible públicamente</strong> 
            a través de los portales oficiales de CONAGUA.
          </p>
          <p>
            Esta brecha en datos públicos limita la capacidad de modelación robusta de tendencias, 
            estacionalidad y proyecciones bajo escenarios de estrés hídrico.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
