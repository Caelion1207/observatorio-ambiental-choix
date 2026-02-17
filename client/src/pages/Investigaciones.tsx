import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Investigaciones() {
  const { data: investigaciones, isLoading } = trpc.investigaciones.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Investigaciones</h1>
            <p className="text-lg text-muted-foreground">
              Estudios técnicos con estructura fija de 9 secciones obligatorias. Cada investigación
              se basa en datos oficiales, modelación básica y fuentes verificables.
            </p>
          </div>

          {/* Listado de Investigaciones */}
          {investigaciones && investigaciones.length > 0 ? (
            <div className="grid gap-6">
              {investigaciones.map((investigacion) => (
                <Card
                  key={investigacion.id}
                  className="border-border hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-xl">{investigacion.titulo}</CardTitle>
                        <CardDescription className="text-base">
                          {investigacion.resumenEjecutivo.substring(0, 250)}
                          {investigacion.resumenEjecutivo.length > 250 && "..."}
                        </CardDescription>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/investigaciones/${investigacion.slug}`}>
                      <Button variant="secondary" className="w-full">
                        Leer Investigación Completa
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay investigaciones publicadas aún
                </h3>
                <p className="text-muted-foreground">
                  Las investigaciones aparecerán aquí una vez que sean publicadas por los
                  administradores del observatorio.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
