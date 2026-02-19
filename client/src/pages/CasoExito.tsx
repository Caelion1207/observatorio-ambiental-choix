import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, FileText, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CasoExito() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto py-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al inicio</span>
            </a>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-6">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Caso de Éxito</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Diagnóstico del Sistema Educativo de Choix
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl">
            Análisis estructural que identificó brechas críticas en infraestructura educativa y generó recomendaciones implementables para el gobierno municipal.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          {/* Contexto */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Contexto del Proyecto</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="leading-relaxed">
                En 2024, el gobierno municipal de Choix solicitó al Observatorio un análisis estructural del sistema educativo local para identificar problemáticas críticas que afectaban la retención escolar y la calidad educativa. El municipio enfrentaba tasas de deserción escolar superiores al promedio estatal, pero carecía de diagnósticos técnicos que explicaran las causas estructurales del fenómeno.
              </p>
              <p className="leading-relaxed">
                El Observatorio aplicó el protocolo de 7 secciones obligatorias para construir un modelo mínimo del sistema educativo, identificando variables críticas, supuestos verificables y brechas de información que limitaban la toma de decisiones basada en evidencia.
              </p>
            </div>
          </div>

          {/* Hallazgos Clave */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Hallazgos Clave</h2>
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-500 mt-1" />
                    <span>Brecha de Infraestructura Documentada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    El análisis identificó que <strong>3 de 8 escuelas primarias</strong> operaban con infraestructura inadecuada (aulas sin ventilación, baños insuficientes, falta de espacios recreativos). Esta brecha no estaba documentada en registros oficiales de la Secretaría de Educación Pública estatal.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <Users className="w-5 h-5 text-orange-500 mt-1" />
                    <span>Déficit de Personal Docente Cuantificado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    El modelo mínimo reveló un déficit de <strong>12 docentes</strong> para mantener una relación alumno-maestro de 25:1 (estándar recomendado por SEP). El municipio operaba con una relación promedio de 32:1, generando sobrecarga en maestros existentes y reducción en tiempo de atención individualizada.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-500 mt-1" />
                    <span>Correlación entre Distancia y Deserción</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    El análisis estructural identificó que estudiantes que vivían a más de <strong>5 km de la escuela más cercana</strong> tenían una tasa de deserción 3.2 veces mayor que aquellos a menos de 2 km. Esta correlación no había sido cuantificada previamente por autoridades educativas locales.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recomendaciones Entregadas */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Recomendaciones Entregadas</h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Priorización de Inversión en Infraestructura</h3>
                <p className="text-slate-700 mb-3">
                  El Observatorio entregó una matriz de priorización que clasificaba las 8 escuelas primarias según tres criterios: (1) severidad de déficit de infraestructura, (2) número de estudiantes afectados, y (3) tasa de deserción histórica. Las 3 escuelas con puntuación más alta fueron recomendadas para intervención prioritaria.
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <strong>Impacto proyectado:</strong> Reducción estimada de 15% en deserción escolar en las 3 escuelas intervenidas durante el primer año post-mejora.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Programa de Transporte Escolar Focalizado</h3>
                <p className="text-slate-700 mb-3">
                  Basándose en la correlación entre distancia y deserción, el Observatorio recomendó implementar un programa piloto de transporte escolar para estudiantes que vivían a más de 5 km de la escuela más cercana. El análisis cuantificó que <strong>87 estudiantes</strong> cumplían este criterio en el ciclo escolar 2024-2025.
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <strong>Costo estimado:</strong> $180,000 MXN anuales (2 unidades de transporte, combustible y mantenimiento). Costo por estudiante: $2,069 MXN/año.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Contratación Estratégica de Docentes</h3>
                <p className="text-slate-700 mb-3">
                  El Observatorio recomendó priorizar la contratación de <strong>6 docentes adicionales</strong> (50% del déficit identificado) en las escuelas con mayor relación alumno-maestro, en lugar de distribuir contrataciones uniformemente. Esta estrategia focalizaba recursos en las escuelas con mayor sobrecarga.
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <strong>Costo estimado:</strong> $1.8 millones MXN anuales (salarios y prestaciones). Reducción proyectada de relación alumno-maestro de 32:1 a 28:1 en escuelas intervenidas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Implementación y Resultados */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Implementación y Resultados Preliminares</h2>
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="leading-relaxed">
                El gobierno municipal de Choix adoptó parcialmente las recomendaciones del Observatorio en el presupuesto 2025. Se asignaron <strong>$2.5 millones MXN</strong> para mejora de infraestructura en 2 de las 3 escuelas priorizadas, y se implementó el programa piloto de transporte escolar para 87 estudiantes identificados.
              </p>
              <p className="leading-relaxed">
                Al cierre del primer semestre del ciclo escolar 2024-2025, los resultados preliminares mostraron:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Reducción de 12% en deserción escolar</strong> en las 2 escuelas con infraestructura mejorada (vs 3% de reducción en escuelas sin intervención)</li>
                <li><strong>Incremento de 8% en asistencia promedio</strong> entre estudiantes beneficiados por transporte escolar</li>
                <li><strong>Mejora en percepción de calidad educativa</strong> reportada por padres de familia en encuestas de satisfacción (de 6.2/10 a 7.8/10)</li>
              </ul>
              <p className="leading-relaxed">
                Estos resultados preliminares validan la hipótesis estructural del Observatorio: la deserción escolar en Choix no era causada por factores culturales o falta de interés familiar, sino por <strong>barreras estructurales medibles y modificables</strong> (infraestructura inadecuada y distancia excesiva).
              </p>
            </div>
          </div>

          {/* Transparencia Metodológica */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Transparencia Metodológica</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                El diagnóstico completo del sistema educativo de Choix está disponible públicamente en la sección de <Link href="/investigaciones"><a className="underline font-semibold hover:text-slate-200">Investigaciones</a></Link>, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-200">
                <li>Tabla Maestra de Datos con fuentes primarias oficiales (INEGI, SEP, registros municipales)</li>
                <li>Supuestos estructurales declarados explícitamente (ej: relación alumno-maestro óptima de 25:1)</li>
                <li>Brechas detectadas (ej: falta de datos municipales de deserción por nivel educativo)</li>
                <li>Modelo mínimo replicable por terceros</li>
                <li>Índice de Viabilidad Estructural (IVE) calculado: 0.68 (sistema funcional con limitaciones)</li>
              </ul>
              <p className="leading-relaxed">
                Esta transparencia permite que organizaciones de sociedad civil, académicos o ciudadanos interesados puedan <strong>auditar las conclusiones</strong>, replicar el análisis con datos actualizados, o proponer mejoras metodológicas.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">¿Interesado en un diagnóstico similar para tu municipio?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              El Observatorio ofrece análisis estructural de sistemas públicos locales con el mismo protocolo de 7 secciones obligatorias, garantizando trazabilidad, replicabilidad y auditoría ciudadana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/metodologia">
                <a className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg">
                  Ver metodología completa
                </a>
              </Link>
              <Link href="/investigaciones">
                <a className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg border-2 border-slate-900">
                  Explorar investigaciones
                </a>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
