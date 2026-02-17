import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, AlertTriangle } from "lucide-react";

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

  const tiposModelacion = [
    {
      tipo: "Balance Hídrico Simple",
      descripcion:
        "Comparación entre recarga media anual del acuífero, volumen concesionado y demanda proyectada. No incluye modelación hidrológica compleja debido a limitaciones de datos.",
    },
    {
      tipo: "Proyección Lineal",
      descripcion:
        "Extrapolación de tendencias históricas bajo supuesto de continuidad de condiciones actuales. Se utiliza para proyecciones a 3-5 años.",
    },
    {
      tipo: "Análisis Comparativo NDVI",
      descripcion:
        "Comparación de índices de vegetación normalizados en series de tiempo para evaluar cambios en cobertura forestal. Basado en imágenes satelitales Landsat y Sentinel.",
    },
    {
      tipo: "Análisis de Escenarios",
      descripcion:
        "Evaluación de múltiples escenarios alternativos (con/sin intervención) para identificar rangos de resultados posibles bajo diferentes supuestos.",
    },
  ];

  const supuestos = [
    "Las series de datos oficiales son completas y representativas de las condiciones reales.",
    "Las condiciones climáticas futuras seguirán patrones históricos (sin considerar cambio climático acelerado).",
    "Las concesiones de agua registradas en REPDA reflejan el uso real del recurso.",
    "La capacidad logística municipal para distribución de agua permanece constante.",
    "No se consideran eventos extremos (sequías prolongadas, inundaciones catastróficas).",
  ];

  const limitaciones = [
    "Ausencia de series de tiempo históricas completas (2015-2026) para algunas variables hidrológicas.",
    "Falta de datos sobre capacidad logística real del municipio (número y capacidad de pipas).",
    "No se realiza modelación hidrológica compleja por limitaciones de datos y recursos computacionales.",
    "Las proyecciones asumen continuidad de condiciones actuales y no incorporan cambio climático.",
    "Los datos de uso de agua pueden estar subestimados si existen extracciones no registradas.",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Metodología</h1>
            <p className="text-lg text-muted-foreground">
              Transparencia metodológica: fuentes oficiales, tipos de modelación, supuestos
              declarados y límites del análisis.
            </p>
          </div>

          {/* Principio Rector */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Principio fundamental:</strong> Toda afirmación técnica debe estar respaldada
              por datos oficiales verificables. Cuando no existen datos suficientes, se declara
              explícitamente como limitación del análisis.
            </AlertDescription>
          </Alert>

          {/* Fuentes Oficiales */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Fuentes Oficiales Utilizadas</h2>
            <p className="text-muted-foreground">
              El observatorio utiliza exclusivamente datos de instituciones gubernamentales con
              mandato oficial para la recopilación y publicación de información ambiental.
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

          {/* Tipos de Modelación */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tipos de Modelación Empleados</h2>
            <p className="text-muted-foreground">
              Se utilizan métodos de modelación simples y transparentes, evitando complejidad
              innecesaria que pueda ocultar supuestos o limitar la reproducibilidad.
            </p>
            <div className="grid gap-4">
              {tiposModelacion.map((modelo) => (
                <Card key={modelo.tipo}>
                  <CardHeader>
                    <CardTitle className="text-lg">{modelo.tipo}</CardTitle>
                    <CardDescription>{modelo.descripcion}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Supuestos Declarados */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Supuestos Declarados</h2>
            <p className="text-muted-foreground">
              Todo análisis técnico parte de supuestos. La transparencia exige declararlos
              explícitamente para que el lector pueda evaluar su validez.
            </p>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {supuestos.map((supuesto, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-primary font-semibold">{index + 1}.</span>
                      <span className="text-muted-foreground">{supuesto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Límites del Análisis */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Límites del Análisis</h2>
            <p className="text-muted-foreground">
              Reconocer las limitaciones es tan importante como presentar los hallazgos. Estas
              limitaciones definen el alcance y confiabilidad de las conclusiones.
            </p>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {limitaciones.map((limitacion, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-destructive font-semibold">•</span>
                      <span className="text-muted-foreground">{limitacion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Nota Final */}
          <Alert>
            <AlertDescription>
              <strong>Nota importante:</strong> Esta metodología se actualiza conforme se
              incorporan nuevas fuentes de datos o técnicas de análisis. Cada investigación
              publicada especifica la metodología exacta utilizada en su sección correspondiente.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
