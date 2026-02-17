import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Calendar, Loader2, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const categorias = {
  hidrologia: "Hidrología",
  medio_ambiente: "Medio Ambiente",
  infraestructura: "Infraestructura",
  salud: "Salud",
  educacion: "Educación",
  transporte: "Transporte",
};

export default function Investigaciones() {
  const { data: investigaciones, isLoading } = trpc.investigaciones.list.useQuery();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null);

  const investigacionesFiltradas = investigaciones?.filter(
    (inv) => !categoriaFiltro || inv.categoria === categoriaFiltro
  );

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
              Estudios técnicos con estructura fija de 7 secciones obligatorias. Cada investigación
              se basa en datos oficiales, modelación básica y fuentes verificables.
            </p>
          </div>

          {/* Filtro por categoría */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={categoriaFiltro === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategoriaFiltro(null)}
            >
              Todas
            </Button>
            {Object.entries(categorias).map(([key, label]) => (
              <Button
                key={key}
                variant={categoriaFiltro === key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCategoriaFiltro(key)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Listado de Investigaciones */}
          {investigacionesFiltradas && investigacionesFiltradas.length > 0 ? (
            <div className="grid gap-6">
              {investigacionesFiltradas.map((investigacion) => (
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-mono text-xs">
                            #{investigacion.numero.toString().padStart(2, "0")}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {categorias[investigacion.categoria as keyof typeof categorias]}
                          </Badge>
                        </div>
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
