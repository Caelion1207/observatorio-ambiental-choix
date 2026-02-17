import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, Users, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Declaración de Propósito */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-20 overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/presa-huites-1.jpg"
            alt="Presa Huites, Choix, Sinaloa"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        </div>
        <div className="container max-w-4xl relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Laboratorio Público de Análisis Estructural
            </h1>
            <p className="text-xl text-muted-foreground">Choix, Sinaloa</p>
            <div className="prose prose-lg mx-auto text-muted-foreground max-w-3xl">
              <p className="text-lg leading-relaxed">
                Este laboratorio aplica un protocolo constante de análisis estructural a problemáticas 
                locales con impacto sistémico. Cada estudio se basa en extracción de datos públicos, 
                modelado explícito, supuestos declarados, simulación transparente y variables auditables.
              </p>
              <p className="text-lg leading-relaxed font-medium">
                No es activismo. No es opinión. No es ideología. Es un instrumento de análisis 
                estructural replicable y auditable.
              </p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/investigaciones">
                <Button size="lg">Ver Análisis</Button>
              </Link>
              <Link href="/metodologia">
                <Button variant="outline" size="lg">
                  Conocer Protocolo
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
                  <CardTitle>Análisis Estructurales</CardTitle>
                </div>
                <CardDescription>
                  Estudios con protocolo replicable de 7 secciones: definición del sistema, tabla 
                  maestra de datos, supuestos explícitos, modelo mínimo, escenarios, brechas 
                  detectadas y conclusión estructural.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/investigaciones">
                  <Button variant="secondary" className="w-full">
                    Explorar Análisis
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
                  <CardTitle>Protocolo Auditable</CardTitle>
                </div>
                <CardDescription>
                  Método constante que reduce ruido, evita deriva narrativa y permite auditoría. 
                  Replicable a distintos dominios: agua, educación, salud, transporte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/metodologia">
                  <Button variant="secondary" className="w-full">
                    Ver Protocolo
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
                  <CardTitle>Datos Abiertos</CardTitle>
                </div>
                <CardDescription>
                  Tablas maestras con fuente primaria, unidad, periodo y estatus. Descargables en 
                  formato CSV con enlaces directos a fuentes oficiales.
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
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Participación Técnica</CardTitle>
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

      {/* Galería Visual de Choix */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Choix, Sinaloa</h2>
            <p className="text-lg text-muted-foreground">
              Región de la Sierra Madre Occidental con infraestructura hídrica crítica
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <img
                src="/images/presa-huites-2.jpg"
                alt="Presa Luis Donaldo Colosio (Huites)"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">Presa Luis Donaldo Colosio (Huites)</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <img
                src="/images/choix-landscape-2.jpg"
                alt="Paisaje de Choix"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">Paisaje de Choix</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <img
                src="/images/choix-landscape-3.jpg"
                alt="Embalse de Huites"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">Embalse de Huites</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 py-8">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>Laboratorio Público de Análisis Estructural - Choix, Sinaloa</p>
            <p className="mt-2">
              Protocolo replicable • Datos públicos • Variables auditables • Sin fines de lucro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
