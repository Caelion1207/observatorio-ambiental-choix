import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, Users, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Declaración de Propósito */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Observatorio Ambiental de Choix
            </h1>
            <div className="prose prose-lg mx-auto text-muted-foreground max-w-3xl">
              <p className="text-lg leading-relaxed">
                El Observatorio Ambiental de Choix es una iniciativa independiente dedicada al
                análisis técnico de problemáticas ambientales con impacto sistémico en la región.
                Cada documento publicado se basa en datos oficiales, modelación básica y fuentes
                verificables. No es un blog, no es activismo emocional, no es periodismo rápido.
                Es documentación técnica de problemáticas ambientales con repercusiones sistémicas.
                Nada más.
              </p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/investigaciones">
                <Button size="lg">Ver Investigaciones</Button>
              </Link>
              <Link href="/metodologia">
                <Button variant="outline" size="lg">
                  Conocer Metodología
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones Principales */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Investigaciones</CardTitle>
                </div>
                <CardDescription>
                  Estudios técnicos con estructura fija de 9 secciones: contexto, datos oficiales,
                  metodología, análisis, proyección, escenarios, limitaciones, conclusiones y
                  fuentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/investigaciones">
                  <Button variant="secondary" className="w-full">
                    Explorar Investigaciones
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Datos Abiertos</CardTitle>
                </div>
                <CardDescription>
                  Tablas descargables en formato CSV, enlaces directos a fuentes oficiales e
                  imágenes satelitales utilizadas en las investigaciones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/datos-abiertos">
                  <Button variant="secondary" className="w-full">
                    Acceder a Datos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Metodología</CardTitle>
                </div>
                <CardDescription>
                  Fuentes oficiales utilizadas (CONAGUA, SEMARNAT, CONAFOR, INEGI), tipos de
                  modelación empleados, supuestos declarados y límites del análisis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/metodologia">
                  <Button variant="secondary" className="w-full">
                    Ver Metodología
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Participación Ciudadana</CardTitle>
                </div>
                <CardDescription>
                  Formulario estructurado para corrección de datos, nuevas fuentes oficiales,
                  aclaraciones técnicas y preguntas metodológicas. Sin comentarios abiertos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/participacion">
                  <Button variant="secondary" className="w-full">
                    Participar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 py-8">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>Observatorio Ambiental de Choix - Documentación técnica independiente</p>
            <p className="mt-2">
              Basado en datos oficiales y fuentes verificables • Sin fines de lucro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
