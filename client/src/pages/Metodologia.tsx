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
            <h2 className="text-3xl font-bold">Índice de Viabilidad Estructural (IVE)</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                El IVE evalúa la <strong>capacidad de un sistema para mantenerse funcional</strong> sin colapsar bajo su propia demanda. Un IVE alto indica que el sistema tiene margen de operación suficiente; un IVE bajo indica que el sistema está al límite de su capacidad y puede fallar ante cualquier perturbación.
              </p>
            </div>
            
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle>Ejemplo concreto: Sistema Hídrico de Choix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  El sistema hídrico de Choix tiene una capacidad de almacenamiento de <strong>10 Mm³</strong> (millones de metros cúbicos) en la presa Miguel Hidalgo. La demanda anual total (agricultura + población urbana + industria) es de <strong>8.2 Mm³</strong>.
                </p>
                <div className="bg-white p-4 rounded border border-blue-200">
                  <p className="font-mono text-sm mb-2">
                    IVE = (Capacidad Disponible) / (Demanda Total)
                  </p>
                  <p className="font-mono text-sm mb-2">
                    IVE = (10 - 8.2) / 10 = 0.18
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Interpretación:</strong> El sistema opera al <strong>82% de su capacidad</strong>, dejando solo un <strong>18% de margen</strong>. Esto significa que ante un incremento de demanda del 20% (por ejemplo, sequía prolongada o crecimiento poblacional acelerado), el sistema colapsaría.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Escala de Interpretación del IVE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <strong className="text-foreground">IVE {'>'} 0.4: Sistema robusto</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    El sistema tiene margen amplio para absorber perturbaciones sin colapsar.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <strong className="text-foreground">IVE 0.2-0.4: Sistema funcional con margen limitado</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    El sistema opera correctamente pero tiene poco margen ante incrementos de demanda.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <strong className="text-foreground">IVE {'<'} 0.2: Sistema en riesgo de colapso</strong>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">
                    El sistema opera al límite de su capacidad y puede fallar ante cualquier perturbación.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Brechas */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Brechas Detectadas</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Una brecha es la <strong>distancia entre un dato ideal y un dato real</strong>. Cuando construimos un modelo estructural, necesitamos ciertos datos para que las conclusiones sean sólidas. Si esos datos no existen, están desactualizados o son de baja calidad, documentamos esa brecha explícitamente.
              </p>
            </div>
            
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle>Ejemplo concreto: Sistema Educativo de Choix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Para evaluar la viabilidad del sistema educativo, necesitamos conocer el <strong>porcentaje de deserción escolar por nivel</strong> (primaria, secundaria, preparatoria). Sin embargo, INEGI solo publica datos estatales agregados, no datos municipales desagregados.
                </p>
                <div className="bg-white p-4 rounded border border-orange-200">
                  <p className="font-semibold text-sm mb-2">Brecha detectada:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>Dato necesario:</strong> Tasa de deserción escolar municipal por nivel educativo (2020-2025)</li>
                    <li><strong>Dato disponible:</strong> Tasa de deserción estatal agregada (Sinaloa completo, sin desagregación municipal)</li>
                    <li><strong>Impacto:</strong> Usamos proxy estatal, lo que introduce incertidumbre en las conclusiones específicas de Choix</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Documentar brechas es un acto de <strong>transparencia metodológica</strong>. En lugar de ocultar las limitaciones del análisis, las hacemos explícitas para que cualquier persona pueda evaluar qué tan sólidas son las conclusiones.
              </p>
            </div>
          </div>

          {/* Incertidumbre Analítica */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Incertidumbre Estructural</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                La incertidumbre mide <strong>cuánto cambian las conclusiones si los supuestos varían</strong>. Un modelo con baja incertidumbre produce conclusiones estables incluso si los datos tienen errores pequeños. Un modelo con alta incertidumbre produce conclusiones muy diferentes si los supuestos cambian levemente.
              </p>
            </div>
            
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle>Ejemplo concreto: Infraestructura de Salud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Proyectamos que el hospital de Choix necesitará <strong>15 camas adicionales</strong> para 2026 bajo el supuesto de que la población crece 2% anual. Pero, ¿qué pasa si el crecimiento real es 1.5% o 2.5%?
                </p>
                <div className="bg-white p-4 rounded border border-purple-200">
                  <p className="font-semibold text-sm mb-2">Análisis de sensibilidad:</p>
                  <ul className="list-none space-y-1 text-sm text-muted-foreground">
                    <li><strong>Escenario Conservador (1.5% crecimiento):</strong> 12 camas necesarias</li>
                    <li><strong>Escenario Base (2.0% crecimiento):</strong> 15 camas necesarias</li>
                    <li><strong>Escenario Extremo (2.5% crecimiento):</strong> 18 camas necesarias</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Interpretación:</strong> La conclusión varía entre 12 y 18 camas (diferencia de 6 camas, o ±40% del valor base). Esto indica <strong>incertidumbre moderada</strong>: la decisión de inversión debe considerar este rango, no solo el valor puntual de 15 camas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong>¿Cómo reducimos la incertidumbre?</strong> La incertidumbre se reduce mediante tres estrategias:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li><strong>Mejorar la calidad de datos:</strong> Usar fuentes primarias oficiales en lugar de estimaciones</li>
                <li><strong>Verificar supuestos:</strong> Contrastar supuestos con expertos locales o datos históricos</li>
                <li><strong>Construir escenarios múltiples:</strong> Evaluar qué pasa en escenarios conservador, base y extremo</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
