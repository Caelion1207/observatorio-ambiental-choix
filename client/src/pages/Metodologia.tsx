import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function Metodologia() {
  const protocoloSecciones = [
    {
      numero: 1,
      titulo: "Definición del Sistema",
      descripcion:
        "Identificación del nodo central, nodos periféricos, flujos entre componentes y variables críticas que determinan el comportamiento del sistema.",
    },
    {
      numero: 2,
      titulo: "Tabla Maestra de Datos",
      descripcion:
        "Registro estructurado de todos los datos utilizados con: fuente primaria oficial, unidad de medida, periodo temporal y estatus de disponibilidad.",
    },
    {
      numero: 3,
      titulo: "Supuestos Explícitos",
      descripcion:
        "Declaración completa de todos los supuestos del análisis. Nada implícito, todo declarado. Permite auditoría y evaluación de validez.",
    },
    {
      numero: 4,
      titulo: "Modelo Mínimo",
      descripcion:
        "Ecuación o modelo conceptual claro y reproducible. Nada ornamental. Solo lo necesario para representar el sistema y sus dinámicas.",
    },
    {
      numero: 5,
      titulo: "Escenarios",
      descripcion:
        "Simulación de tres escenarios: Base (condiciones actuales), Estrés (presión moderada) y Extremo (presión máxima o crisis).",
    },
    {
      numero: 6,
      titulo: "Brechas Detectadas",
      descripcion:
        "Identificación de qué datos no son públicos pero deberían serlo, y qué información falta para un análisis más robusto.",
    },
    {
      numero: 7,
      titulo: "Conclusión Estructural",
      descripcion:
        "Conclusión basada en la estructura del sistema y los datos, no en narrativa, moral o ideología. Solo lo que el análisis permite afirmar.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-12">
        <div className="space-y-12">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Protocolo de Análisis Estructural</h1>
            <p className="text-lg text-muted-foreground">
              Método constante, replicable y auditable para análisis de problemáticas locales.
            </p>
          </div>

          {/* Principio Rector */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Principio fundamental:</strong> Este laboratorio no es activismo, opinión ni 
              ideología. Es extracción de datos públicos, modelado explícito, supuestos declarados, 
              simulación transparente y variables auditables.
            </AlertDescription>
          </Alert>

          {/* Protocolo de 7 Secciones */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Protocolo de 7 Secciones</h2>
            <p className="text-muted-foreground">
              Cada investigación sigue este protocolo obligatorio. Sin excepciones.
            </p>
            <div className="grid gap-4">
              {protocoloSecciones.map((seccion) => (
                <Card key={seccion.numero} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {seccion.numero}. {seccion.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{seccion.descripcion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* IVE - Índice de Verificación Estructural */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Índice de Verificación Estructural (IVE)</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                El IVE mide qué proporción de los supuestos críticos de una investigación están 
                respaldados por fuentes verificables.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Un supuesto crítico es aquel que, si cambia, altera significativamente las conclusiones 
                del análisis. El IVE indica cuántos de esos supuestos están verificados con datos oficiales.
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Rangos de Interpretación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <strong className="text-foreground">0.80 – 1.00: Alta verificación</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    La mayoría de los supuestos críticos están respaldados por datos oficiales.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <strong className="text-foreground">0.50 – 0.79: Parcialmente verificado</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    Algunos supuestos críticos están verificados, pero otros dependen de estimaciones.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <strong className="text-foreground">0.30 – 0.49: Información limitada</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    La mayoría de los supuestos críticos no están verificados con fuentes oficiales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Brechas */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Brechas</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Una brecha es información necesaria que no está disponible públicamente o no ha sido verificada.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong>Brecha ≠ error.</strong> Una brecha es información faltante. No significa que el 
                análisis sea incorrecto, sino que está limitado por la disponibilidad de datos.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Identificar brechas es honesto. Permite saber qué información adicional mejoraría el análisis.
              </p>
            </div>
          </div>

          {/* Incertidumbre Analítica */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Incertidumbre Analítica</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                La incertidumbre analítica mide el nivel de dependencia de estimaciones o datos incompletos 
                dentro del modelo.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong>No mide peligro social ni ambiental.</strong> Mide el grado de respaldo documental 
                del análisis.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Un análisis con alta incertidumbre no es inválido, pero sus conclusiones deben interpretarse 
                con mayor cautela.
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Niveles de Incertidumbre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong className="text-foreground">Incertidumbre Baja (IVE ≥ 0.75)</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    La mayoría de los supuestos críticos están verificados.
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Incertidumbre Media (IVE 0.50–0.74)</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Algunos supuestos críticos dependen de estimaciones.
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Incertidumbre Alta (IVE &lt; 0.50)</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    La mayoría de los supuestos críticos no están verificados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
