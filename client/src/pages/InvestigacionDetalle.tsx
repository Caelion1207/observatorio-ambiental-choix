import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Streamdown } from "streamdown";

export default function InvestigacionDetalle() {
  const [, params] = useRoute("/investigaciones/:slug");
  const slug = params?.slug || "";

  const { data: investigacion, isLoading } = trpc.investigaciones.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!investigacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Investigación no encontrada</h2>
          <Link href="/investigaciones">
            <Button>Volver a Investigaciones</Button>
          </Link>
        </div>
      </div>
    );
  }

  const secciones = [
    { titulo: "1. Definición del Sistema", contenido: investigacion.contexto },
    { titulo: "2. Tabla Maestra de Datos", contenido: investigacion.datosOficiales },
    { titulo: "3. Supuestos Explícitos", contenido: investigacion.metodologia },
    { titulo: "4. Modelo Mínimo", contenido: investigacion.analisisTecnico },
    { titulo: "5. Escenarios", contenido: investigacion.proyeccion + "\n\n" + investigacion.escenariosAlternativos },
    { titulo: "6. Brechas Detectadas", contenido: investigacion.limitaciones },
    { titulo: "7. Conclusión Estructural", contenido: investigacion.conclusiones },
    { titulo: "Fuentes Primarias", contenido: investigacion.fuentes },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          {/* Navegación */}
          <Link href="/investigaciones">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Investigaciones
            </Button>
          </Link>

          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{investigacion.titulo}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Publicado el{" "}
                {investigacion.publishedAt
                  ? format(new Date(investigacion.publishedAt), "d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })
                  : "Fecha no disponible"}
              </span>
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <Streamdown>{investigacion.resumenEjecutivo}</Streamdown>
              </div>
            </CardContent>
          </Card>

          {/* 7 Secciones del Protocolo + Fuentes */}
          {secciones.map((seccion, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">{seccion.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-foreground">
                  <Streamdown>{seccion.contenido}</Streamdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
