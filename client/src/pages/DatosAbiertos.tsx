import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Image, Loader2, Database } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DatosAbiertos() {
  const { data: datosAbiertos, isLoading } = trpc.datosAbiertos.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "csv":
        return <Database className="h-5 w-5" />;
      case "imagen_satelital":
        return <Image className="h-5 w-5" />;
      case "enlace":
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "csv":
        return "Archivo CSV";
      case "imagen_satelital":
        return "Imagen Satelital";
      case "enlace":
        return "Enlace Externo";
      default:
        return tipo;
    }
  };

  const datosPorTipo = {
    csv: datosAbiertos?.filter((d) => d.tipo === "csv") || [],
    imagen_satelital: datosAbiertos?.filter((d) => d.tipo === "imagen_satelital") || [],
    enlace: datosAbiertos?.filter((d) => d.tipo === "enlace") || [],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Datos Abiertos</h1>
            <p className="text-lg text-muted-foreground">
              Tablas descargables en formato CSV, enlaces directos a fuentes oficiales e imágenes
              satelitales utilizadas en las investigaciones. Todos los datos son de acceso público
              y verificables.
            </p>
          </div>

          {/* Archivos CSV */}
          {datosPorTipo.csv.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Archivos CSV</h2>
              <div className="grid gap-4">
                {datosPorTipo.csv.map((dato) => (
                  <Card key={dato.id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(dato.tipo)}
                            <CardTitle className="text-lg">{dato.titulo}</CardTitle>
                          </div>
                          <CardDescription>{dato.descripcion}</CardDescription>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                            <Badge variant="secondary">{dato.fuenteOficial}</Badge>
                            {dato.fechaDatos && (
                              <span>
                                Datos de{" "}
                                {format(new Date(dato.fechaDatos), "MMMM yyyy", { locale: es })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dato.archivoUrl && (
                        <a href={dato.archivoUrl} download>
                          <Button variant="secondary" className="w-full gap-2">
                            <Download className="h-4 w-4" />
                            Descargar CSV
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes Satelitales */}
          {datosPorTipo.imagen_satelital.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Imágenes Satelitales</h2>
              <div className="grid gap-4">
                {datosPorTipo.imagen_satelital.map((dato) => (
                  <Card key={dato.id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(dato.tipo)}
                            <CardTitle className="text-lg">{dato.titulo}</CardTitle>
                          </div>
                          <CardDescription>{dato.descripcion}</CardDescription>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                            <Badge variant="secondary">{dato.fuenteOficial}</Badge>
                            {dato.fechaDatos && (
                              <span>
                                Captura de{" "}
                                {format(new Date(dato.fechaDatos), "MMMM yyyy", { locale: es })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dato.archivoUrl && (
                        <a href={dato.archivoUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" className="w-full gap-2">
                            <Image className="h-4 w-4" />
                            Ver Imagen
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Enlaces Externos */}
          {datosPorTipo.enlace.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Enlaces a Fuentes Oficiales</h2>
              <div className="grid gap-4">
                {datosPorTipo.enlace.map((dato) => (
                  <Card key={dato.id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(dato.tipo)}
                            <CardTitle className="text-lg">{dato.titulo}</CardTitle>
                          </div>
                          <CardDescription>{dato.descripcion}</CardDescription>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                            <Badge variant="secondary">{dato.fuenteOficial}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dato.enlaceExterno && (
                        <a href={dato.enlaceExterno} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" className="w-full gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Visitar Fuente Oficial
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {datosAbiertos && datosAbiertos.length === 0 && (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay datos abiertos disponibles aún</h3>
                <p className="text-muted-foreground">
                  Los datos abiertos aparecerán aquí una vez que sean publicados por los
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
