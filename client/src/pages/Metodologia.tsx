import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Metodologia() {
  // Obtener dominios activos desde base de datos
  const { data: dominios, isLoading: dominiosLoading } = trpc.dominios.list.useQuery();

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
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Protocolo de Análisis Estructural</h1>
            <p className="text-lg text-muted-foreground">
              Método constante, replicable y auditable para análisis de problemáticas locales con 
              impacto sistémico.
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

          {/* Principios del Laboratorio */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Principios del Laboratorio</CardTitle>
              <CardDescription>
                Estos principios guían todas las investigaciones y garantizan la neutralidad técnica del análisis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">No emitimos juicios morales ni acusaciones.</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Evaluamos estructuras, no personas. El análisis se centra en sistemas, flujos y variables, 
                      no en culpabilidades individuales.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Si los datos cambian, las conclusiones cambian.</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      No hay conclusiones inmutables. Si aparecen nuevos datos oficiales o se corrigen los existentes, 
                      actualizamos el modelo y las conclusiones derivadas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Toda inferencia debe estar respaldada por variables cuantificadas.</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      No permitimos saltos narrativos. Cada afirmación debe derivarse de variables definidas en el Modelo Mínimo. 
                      Palabras como "probablemente", "es evidente" o "claramente" son rechazadas automáticamente.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Todo supuesto crítico debe ser verificable.</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Los supuestos con sensibilidad "Crítica" requieren verificación con fuentes primarias oficiales. 
                      El Índice de Robustez del Modelo (IRM) penaliza supuestos críticos no verificados.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Todo modelo debe ser auditable.</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      El protocolo de 7 secciones garantiza que cualquier persona con conocimientos técnicos pueda 
                      reproducir el análisis, verificar las fuentes y cuestionar los supuestos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocolo de 7 Secciones */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Estructura Replicable (7 Secciones)</h2>
            <p className="text-muted-foreground">
              Cada análisis sigue exactamente el mismo esquema. Esto permite auditoría porque el 
              método es constante. No depende de quién lo escriba, depende del protocolo.
            </p>
            <div className="grid gap-4">
              {protocoloSecciones.map((seccion) => (
                <Card key={seccion.numero} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {seccion.numero}
                      </span>
                      {seccion.titulo}
                    </CardTitle>
                    <CardDescription>{seccion.descripcion}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Dominios Activos - Render Dinámico */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Dominios de Análisis</h2>
            <p className="text-muted-foreground">
              Este protocolo se aplica a múltiples dominios de problemáticas locales con impacto sistémico. 
              Cada dominio mantiene la misma estructura metodológica pero con variables y modelos específicos.
            </p>
            
            {dominiosLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Cargando dominios...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {dominios
                  ?.filter(d => d.activo)
                  .sort((a, b) => a.orden - b.orden)
                  .map((dominio) => (
                    <Card key={dominio.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          {dominio.icono && (
                            <span className="text-2xl">{dominio.icono}</span>
                          )}
                          {dominio.nombre}
                        </CardTitle>
                        <CardDescription>
                          {dominio.descripcion}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          {/* Auditoría por Método Constante */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Auditoría:</strong> Si todos los estudios siguen el mismo marco, se vuelven 
              auditables. La estructura se mantiene estable, el método reduce ruido, el modelo evita 
              deriva narrativa y la arquitectura escala a distintos dominios. Esto es metagobernanza 
              aplicada.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
