import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Resumenes() {
  const resumenes = [
    {
      id: 1,
      titulo: "Sistema Hídrico de Choix ante Demanda Incremental",
      slug: "sistema-hidrico-choix-demanda-incremental-resiliencia-capacidad-amortiguacion",
      sintesis:
        "El sistema hídrico de Choix depende de la Presa Luis Donaldo Colosio (Huites) como nodo central. El análisis evalúa la capacidad del sistema para absorber demanda incremental sin comprometer su resiliencia. Se identifican tres escenarios: base (condiciones actuales), estrés (aumento del 15% en demanda agrícola y urbana), y extremo (sequía prolongada con reducción del 30% en disponibilidad). Los resultados indican que el sistema tiene capacidad de amortiguación en condiciones normales, pero enfrenta vulnerabilidad crítica ante sequías prolongadas. Las brechas detectadas incluyen falta de datos desagregados de consumo por sector y ausencia de métricas de eficiencia hídrica a nivel municipal.",
      hallazgos: [
        "La Presa Huites tiene capacidad de almacenamiento de 3,000 millones de m³, pero no existen datos públicos de consumo desagregado por sector en Choix",
        "El escenario de estrés (15% de aumento en demanda) es absorbible con la infraestructura actual, pero sin margen de seguridad",
        "El escenario extremo (sequía prolongada) revela dependencia crítica de un solo nodo de almacenamiento sin alternativas de amortiguación",
      ],
      efectos: [
        "Agricultores: Riesgo de restricciones de riego en escenarios de estrés hídrico, afectando cultivos de ciclo largo",
        "Población urbana: Vulnerabilidad ante cortes de suministro en sequías prolongadas, sin sistemas de almacenamiento local",
        "Ganaderos: Dependencia de pozos y manantiales secundarios sin medición oficial, limitando planificación ante escasez",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Aumento del 15% en demanda agrícola y urbana. El sistema absorbe la presión pero sin margen de seguridad. Requiere monitoreo continuo de niveles de la presa.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Sequía prolongada con reducción del 30% en disponibilidad. El sistema entra en zona de déficit crítico. Requiere restricciones inmediatas de consumo y activación de fuentes alternativas.",
        },
      ],
      ejemplos: [
        {
          lugar: "Hermosillo, Sonora",
          medida:
            "Implementó sistema de medición inteligente de consumo por sector (agrícola, industrial, urbano) con alertas tempranas de escasez. Redujo consumo urbano en 18% sin afectar calidad de vida.",
        },
        {
          lugar: "Guasave, Sinaloa",
          medida:
            "Construyó red de pozos de respaldo con capacidad de 20% del consumo urbano para escenarios de sequía. Activó el sistema en 2021 durante estiaje prolongado, evitando cortes de suministro.",
        },
      ],
    },
    {
      id: 2,
      titulo: "Cobertura Forestal Histórica de Choix (2015-2026)",
      slug: "cobertura-forestal-historica-choix-2015-2026",
      sintesis:
        "El análisis de cobertura forestal de Choix entre 2015 y 2026 revela una tendencia de déficit acumulativo: la tasa de deforestación supera la capacidad de recuperación del ecosistema. Utilizando datos de CONAFOR e INEGI, se estima una pérdida neta de 1,200 hectáreas en el periodo. Los escenarios proyectados indican que, sin intervención estratégica, la cobertura forestal continuará disminuyendo. Las brechas detectadas incluyen falta de datos satelitales desagregados a nivel municipal y ausencia de métricas de restauración forestal verificables. La investigación subraya la necesidad de inversión en nodos periféricos (reforestación comunitaria) y flujos de restauración (programas de conservación).",
      hallazgos: [
        "Pérdida neta estimada de 1,200 hectáreas de cobertura forestal entre 2015 y 2026, equivalente a 3.2% del total municipal",
        "La tasa de deforestación (80 ha/año) supera la tasa de recuperación natural (20 ha/año) en una proporción de 4:1",
        "No existen datos públicos de programas de reforestación activos en Choix con métricas de supervivencia de árboles plantados",
      ],
      efectos: [
        "Agricultores: Mayor erosión de suelos en zonas de ladera, reduciendo productividad agrícola y aumentando costos de fertilización",
        "Población rural: Disminución de disponibilidad de leña y recursos forestales no maderables, afectando economía de subsistencia",
        "Comunidad general: Incremento de riesgo de inundaciones y deslaves en temporada de lluvias por pérdida de cobertura vegetal",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Continuación de la tendencia actual sin intervención. Pérdida adicional de 600 hectáreas en los próximos 5 años. Aumento del 15% en erosión de suelos.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Aceleración de deforestación por incendios forestales o expansión agrícola no regulada. Pérdida de 1,500 hectáreas adicionales. Riesgo crítico de deslaves en zonas habitadas.",
        },
      ],
      ejemplos: [
        {
          lugar: "Durango, Durango",
          medida:
            "Implementó programa de pago por servicios ambientales a ejidos forestales, compensando económicamente la conservación. Redujo deforestación en 40% en 5 años.",
        },
        {
          lugar: "Chihuahua, Chihuahua",
          medida:
            "Creó brigadas comunitarias de reforestación con seguimiento satelital de áreas restauradas. Logró tasa de supervivencia del 65% en árboles plantados, revirtiendo tendencia de pérdida.",
        },
      ],
    },
    {
      id: 3,
      titulo: "Infraestructura de Salud en Choix: Capacidad vs. Demanda",
      slug: "infraestructura-salud-choix-capacidad-vs-demanda",
      sintesis:
        "El sistema de salud de Choix se encuentra en zona de déficit estructural. El análisis cuantifica tasas de camas hospitalarias (0.36 por mil habitantes), personal médico (2.00 por mil habitantes) y consultorios (0.79 por mil habitantes), todas por debajo de estándares nacionales. Los escenarios proyectados revelan que un aumento del 20% en demanda (escenario de estrés) llevaría a saturación crítica de servicios. El escenario extremo (crecimiento y envejecimiento poblacional sostenido) anticipa presión permanente sin capacidad de respuesta. Las brechas detectadas incluyen desactualización de datos oficiales, ausencia de indicadores de ocupación de servicios, y falta de información sobre salud rural.",
      hallazgos: [
        "Tasa de camas hospitalarias (0.36 por mil hab.) está 55% por debajo del promedio nacional (0.80 por mil hab.)",
        "Personal médico (2.00 por mil hab.) es insuficiente para atención primaria, especialmente en comunidades rurales dispersas",
        "No existen datos públicos de ocupación hospitalaria ni tiempos de espera en consultorios, limitando planificación de recursos",
      ],
      efectos: [
        "Población rural: Tiempos de traslado superiores a 1 hora para atención hospitalaria, aumentando riesgo en emergencias médicas",
        "Adultos mayores: Falta de servicios geriátricos especializados, dependiendo de traslados a Los Mochis o Guasave",
        "Mujeres embarazadas: Limitaciones en atención prenatal y parto en comunidades alejadas, incrementando riesgo materno-infantil",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Aumento del 20% en demanda por epidemia estacional. Saturación de consultorios y camas hospitalarias. Tiempos de espera superiores a 4 horas en urgencias.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Crecimiento y envejecimiento poblacional sostenido. Demanda permanente supera capacidad instalada en 35%. Colapso de atención primaria y derivación forzada a hospitales regionales.",
        },
      ],
      ejemplos: [
        {
          lugar: "Badiraguato, Sinaloa",
          medida:
            "Implementó unidades móviles de salud con personal rotativo para comunidades rurales. Redujo traslados de emergencia en 30% y mejoró cobertura de atención primaria.",
        },
        {
          lugar: "Tamazula, Durango",
          medida:
            "Amplió infraestructura hospitalaria con financiamiento mixto (federal + estatal + municipal). Aumentó camas hospitalarias de 0.40 a 0.75 por mil habitantes en 3 años.",
        },
      ],
    },
    {
      id: 4,
      titulo: "Sistema Educativo de Choix: Capacidad vs. Demanda",
      slug: "sistema-educativo-choix-capacidad-vs-demanda",
      sintesis:
        "El análisis estructural del sistema educativo de Choix revela un superávit de capacidad en todos los niveles (Básica, Media Superior y Superior), sugiriendo subutilización de infraestructura y personal docente. Esta condición persiste en escenario de estrés (aumento del 10% en demanda). Sin embargo, el escenario extremo (reducción del 20% en capacidad + aumento del 15% en demanda) expone vulnerabilidad crítica en Educación Básica, con déficit superior a 1,000 alumnos. Las brechas detectadas incluyen dependencia de extrapolaciones estatales, falta de datos desagregados a nivel municipal, y ausencia de métricas de deserción escolar locales. La investigación subraya la necesidad de datos actualizados para planificación precisa.",
      hallazgos: [
        "Superávit de capacidad en Educación Básica (1,200 espacios disponibles), Media Superior (350 espacios) y Superior (180 espacios) en escenario base",
        "Datos de matrícula y docentes provienen de extrapolaciones estatales, no de censos municipales directos",
        "No existen métricas públicas de deserción escolar ni tasa de reprobación a nivel municipal, limitando diagnóstico de calidad educativa",
      ],
      efectos: [
        "Estudiantes: Infraestructura subutilizada en condiciones normales, pero vulnerable ante cambios demográficos o políticas educativas",
        "Docentes: Distribución de personal no optimizada, con posible concentración en zonas urbanas y déficit en comunidades rurales",
        "Familias: Falta de información sobre calidad educativa local, dependiendo de percepciones subjetivas para decisiones de inscripción",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Aumento del 10% en demanda por migración de retorno o políticas de inclusión. El sistema absorbe la presión sin déficit, pero reduce margen de holgura en Educación Básica.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Reducción del 20% en capacidad (cierre de escuelas rurales o recorte de personal) + aumento del 15% en demanda. Déficit crítico de 1,000 espacios en Educación Básica. Requiere inversión urgente.",
        },
      ],
      ejemplos: [
        {
          lugar: "Ahome, Sinaloa",
          medida:
            "Implementó sistema de información educativa municipal con datos en tiempo real de matrícula, deserción y reprobación. Permitió redistribución de docentes y reducción de deserción en 12%.",
        },
        {
          lugar: "Culiacán, Sinaloa",
          medida:
            "Creó programa de transporte escolar subsidiado para comunidades rurales, reduciendo deserción por distancia en 25%. Optimizó uso de infraestructura existente sin construir nuevas escuelas.",
        },
      ],
    },
    {
      id: 5,
      titulo: "Red de Transporte de Choix: Nivel de Servicio y Vulnerabilidad",
      slug: "red-transporte-choix-nivel-servicio-vulnerabilidad",
      sintesis:
        "La red de transporte de Choix muestra alta dependencia de la carretera Choix-El Fuerte, vulnerable a congestión e interrupciones por su estado físico y carencia de rutas alternas. El análisis utiliza el modelo de Nivel de Servicio (NS = Q / C) para evaluar capacidad vial. Los escenarios proyectados indican que un incremento del 20% en flujo vehicular (escenario de estrés) mantiene NS aceptable, pero una reducción del 50% en capacidad por bloqueo parcial (escenario extremo) genera congestión crítica. Las brechas detectadas incluyen falta de aforos vehiculares públicos, desactualización del Plan Municipal de Desarrollo Urbano (2012), y ausencia de estudios de origen-destino. La investigación subraya la necesidad de aforos periódicos y actualización de instrumentos de planificación.",
      hallazgos: [
        "La carretera Choix-El Fuerte concentra el 80% del flujo vehicular municipal, sin rutas alternas pavimentadas",
        "No existen aforos vehiculares públicos posteriores a 2012, limitando diagnóstico de congestión y planificación vial",
        "El Plan Municipal de Desarrollo Urbano (2012) está desactualizado, sin incorporar crecimiento vehicular de los últimos 14 años",
      ],
      efectos: [
        "Transportistas: Tiempos de traslado impredecibles ante bloqueos o mantenimiento vial, aumentando costos operativos",
        "Comerciantes: Dependencia de una sola ruta para abastecimiento, vulnerable a interrupciones por accidentes o manifestaciones",
        "Población general: Riesgo de aislamiento temporal en caso de bloqueo de carretera principal, afectando acceso a servicios de salud y educación",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Incremento del 20% en flujo vehicular por temporada agrícola o eventos locales. NS se mantiene aceptable (0.60-0.75), pero con mayor percepción de congestión en horas pico.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Bloqueo parcial de carretera principal por mantenimiento o accidente, reduciendo capacidad en 50%. NS crítico (>0.90), congestión severa y tiempos de traslado duplicados.",
        },
      ],
      ejemplos: [
        {
          lugar: "Navolato, Sinaloa",
          medida:
            "Construyó libramiento alterno de 12 km para desviar tráfico pesado de zona urbana. Redujo congestión en 35% y accidentes viales en 20%.",
        },
        {
          lugar: "Guamúchil, Sinaloa",
          medida:
            "Implementó sistema de aforos vehiculares automáticos en puntos estratégicos, con datos públicos en tiempo real. Permitió planificación de mantenimiento vial sin afectar flujo principal.",
        },
      ],
    },
    {
      id: 6,
      titulo: "Infraestructura Vial de Choix: Capacidad y Resiliencia",
      slug: "infraestructura-vial-choix-capacidad-resiliencia",
      sintesis:
        "El análisis de infraestructura vial de Choix evalúa la capacidad de la red para absorber variaciones en flujo vehicular sin comprometer su funcionalidad. Utilizando el modelo de Nivel de Servicio (NS = Q / C), se identifican tres escenarios: base (condiciones actuales), estrés (incremento del 20% en flujo), y extremo (reducción del 50% de capacidad por bloqueo parcial). Los resultados indican que la red tiene resiliencia limitada ante interrupciones, con alta dependencia de la carretera Choix-El Fuerte. Las brechas detectadas incluyen falta de aforos vehiculares actualizados, desactualización del Plan Municipal de Desarrollo Urbano, y ausencia de estudios de origen-destino. La investigación subraya la necesidad de rutas alternas y actualización de instrumentos de planificación.",
      hallazgos: [
        "La red vial de Choix tiene 85 km de carreteras pavimentadas, de las cuales 60 km corresponden a la ruta principal Choix-El Fuerte",
        "No existen rutas alternas pavimentadas para desviar tráfico en caso de bloqueo de carretera principal",
        "El estado físico de la infraestructura vial no está documentado públicamente, limitando diagnóstico de necesidades de mantenimiento",
      ],
      efectos: [
        "Transportistas: Dependencia de una sola ruta principal aumenta riesgo operativo y costos por tiempos de traslado impredecibles",
        "Agricultores: Limitaciones en transporte de productos perecederos ante interrupciones viales, afectando ingresos por pérdida de mercancía",
        "Población general: Vulnerabilidad ante aislamiento temporal por bloqueos, afectando acceso a servicios básicos y emergencias médicas",
      ],
      escenarios: [
        {
          nombre: "Estrés",
          descripcion:
            "Incremento del 20% en flujo vehicular por temporada agrícola. NS se mantiene aceptable, pero con mayor percepción de congestión en horas pico.",
        },
        {
          nombre: "Extremo",
          descripcion:
            "Bloqueo parcial de carretera principal, reduciendo capacidad en 50%. NS crítico, congestión severa y tiempos de traslado duplicados. Requiere activación de rutas alternas no pavimentadas.",
        },
      ],
      ejemplos: [
        {
          lugar: "Mazatlán, Sinaloa",
          medida:
            "Construyó libramiento de 18 km para desviar tráfico de carga del centro urbano. Redujo congestión en 40% y mejoró conectividad con puerto marítimo.",
        },
        {
          lugar: "Los Mochis, Sinaloa",
          medida:
            "Implementó programa de mantenimiento preventivo de infraestructura vial con priorización basada en aforos vehiculares. Redujo cierres de carriles por mantenimiento correctivo en 50%.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-6xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Resúmenes de Investigaciones</h1>
            <p className="text-lg text-muted-foreground">
              Síntesis ejecutivas con hallazgos clave, efectos comunitarios, escenarios proyectados y 
              ejemplos de soluciones implementadas en otros municipios.
            </p>
          </div>

          {/* Resúmenes */}
          <div className="space-y-12">
            {resumenes.map((resumen) => (
              <Card key={resumen.id} className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-2xl">
                        <Link href={`/investigaciones/${resumen.slug}`} className="hover:text-primary transition-colors">
                          {resumen.titulo}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {resumen.sintesis}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      #{resumen.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hallazgos Clave */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Hallazgos Clave</h3>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {resumen.hallazgos.map((hallazgo, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
                          • {hallazgo}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Efectos en la Comunidad */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <h3 className="font-semibold text-lg">Efectos en la Comunidad</h3>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {resumen.efectos.map((efecto, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
                          • {efecto}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Escenarios Proyectados */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">Escenarios Proyectados</h3>
                    </div>
                    <div className="grid gap-3 ml-7">
                      {resumen.escenarios.map((escenario, idx) => (
                        <div key={idx} className="space-y-1">
                          <strong className="text-sm text-foreground">{escenario.nombre}:</strong>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {escenario.descripcion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ejemplos de Otros Municipios */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Ejemplos de Otros Municipios</h3>
                    <div className="grid gap-3">
                      {resumen.ejemplos.map((ejemplo, idx) => (
                        <Alert key={idx} className="border-primary/20 bg-primary/5">
                          <AlertDescription>
                            <strong className="text-foreground">{ejemplo.lugar}:</strong>{" "}
                            <span className="text-muted-foreground">{ejemplo.medida}</span>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>

                  {/* Enlace a investigación completa */}
                  <div className="pt-4 border-t">
                    <Link href={`/investigaciones/${resumen.slug}`} className="text-sm text-primary hover:underline">
                      Ver investigación completa →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
