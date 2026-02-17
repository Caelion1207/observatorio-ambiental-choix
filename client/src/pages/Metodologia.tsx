import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Metodologia() {
  const fuentesOficiales = [
    {
      nombre: "Comisión Nacional del Agua",
      siglas: "CONAGUA",
      descripcion:
        "Datos hidrológicos, disponibilidad de acuíferos, almacenamiento de presas, precipitación y caudales.",
      sitioWeb: "https://www.gob.mx/conagua",
    },
    {
      nombre: "Secretaría de Medio Ambiente y Recursos Naturales",
      siglas: "SEMARNAT",
      descripcion:
        "Manifestaciones de Impacto Ambiental, autorizaciones ambientales, estudios de riesgo y normativa aplicable.",
      sitioWeb: "https://www.gob.mx/semarnat",
    },
    {
      nombre: "Comisión Nacional Forestal",
      siglas: "CONAFOR",
      descripcion:
        "Cobertura forestal, deforestación, incendios forestales, inventarios nacionales forestales y de suelos.",
      sitioWeb: "https://www.gob.mx/conafor",
    },
    {
      nombre: "Instituto Nacional de Estadística y Geografía",
      siglas: "INEGI",
      descripcion:
        "Datos demográficos, socioeconómicos, cartografía, uso de suelo y vegetación, censos de población.",
      sitioWeb: "https://www.inegi.org.mx",
    },
  ];

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

          {/* Replicabilidad a Otros Dominios */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Replicabilidad a Otros Dominios</h2>
            <p className="text-muted-foreground">
              Este protocolo no sirve solo para análisis hídrico. Se puede aplicar a cualquier 
              problemática local con impacto sistémico:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Educación</CardTitle>
                  <CardDescription>
                    Tasa de abandono, capacidad docente, infraestructura, presupuesto ejecutado, 
                    resultado proyectado a 5 años.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Salud</CardTitle>
                  <CardDescription>
                    Camas hospitalarias, personal médico, demanda demográfica, cobertura real, 
                    vulnerabilidad sistémica.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Agua</CardTitle>
                  <CardDescription>
                    Balance hídrico, capacidad logística, demanda proyectada, escenarios de estrés, 
                    brechas en datos públicos.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transporte</CardTitle>
                  <CardDescription>
                    Capacidad de infraestructura, flujo vehicular, cuellos de botella, saturación 
                    proyectada, escenarios de colapso.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Fuentes Oficiales */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Fuentes Oficiales Utilizadas</h2>
            <p className="text-muted-foreground">
              Solo se utilizan datos de instituciones gubernamentales con mandato oficial para la 
              recopilación y publicación de información.
            </p>
            <div className="grid gap-4">
              {fuentesOficiales.map((fuente) => (
                <Card key={fuente.siglas}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {fuente.nombre} ({fuente.siglas})
                        </CardTitle>
                        <CardDescription>{fuente.descripcion}</CardDescription>
                      </div>
                      <a
                        href={fuente.sitioWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
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
