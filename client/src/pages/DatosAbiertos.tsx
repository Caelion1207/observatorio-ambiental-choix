import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ExternalLink, Loader2, Database, FileText } from "lucide-react";
import { useState } from "react";

export default function DatosAbiertos() {
  const [investigacionSeleccionada, setInvestigacionSeleccionada] = useState<string | null>(null);

  const { data: investigaciones, isLoading: investigacionesLoading } = trpc.investigaciones.list.useQuery();
  const { data: datosAbiertos, isLoading: datosLoading } = trpc.datosAbiertos.list.useQuery();

  // Obtener investigación seleccionada completa
  const { data: investigacionDetalle, isLoading: detalleLoading } = trpc.investigaciones.getBySlug.useQuery(
    { slug: investigacionSeleccionada || "" },
    { enabled: !!investigacionSeleccionada }
  );

  // Obtener fuentes de investigación seleccionada
  const { data: fuentes, isLoading: fuentesLoading } = trpc.fuentes.getByInvestigacionId.useQuery(
    { investigacionId: investigacionDetalle?.id || 0 },
    { enabled: !!investigacionDetalle?.id }
  );

  const isLoading = investigacionesLoading || datosLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filtrar datos abiertos por investigación seleccionada
  const datosCSV = investigacionSeleccionada
    ? datosAbiertos?.filter(
        (d) => d.tipo === "csv" && d.investigacionId === investigacionDetalle?.id
      ) || []
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Datos Abiertos</h1>
            <p className="text-lg text-muted-foreground">
              Tablas descargables en formato CSV, fuentes oficiales y metadatos utilizados en las 
              investigaciones. Todos los datos son de acceso público y verificables.
            </p>
          </div>

          {/* Selector de Investigación */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Investigación</CardTitle>
              <CardDescription>
                Elige una investigación para ver sus datos abiertos, fuentes y metadatos asociados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={investigacionSeleccionada || ""}
                onValueChange={(value) => setInvestigacionSeleccionada(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una investigación" />
                </SelectTrigger>
                <SelectContent>
                  {investigaciones?.map((inv) => (
                    <SelectItem key={`select-inv-${inv.id}`} value={inv.slug || `inv-${inv.id}`}>
                      {inv.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Contenido Dinámico por Investigación */}
          {investigacionSeleccionada && (
            <>
              {/* Metadatos de Investigación */}
              {detalleLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : investigacionDetalle ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Información de la Investigación</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Título</h3>
                      <p className="text-base">{investigacionDetalle.titulo}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">Resumen Ejecutivo</h3>
                      <p className="text-sm">{investigacionDetalle.resumenEjecutivo}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Índice de Verificación Estructural (IVE)</h3>
                        <Badge variant={
                          parseFloat(investigacionDetalle.indiceRobustez || "0") >= 0.8 ? "default" :
                          parseFloat(investigacionDetalle.indiceRobustez || "0") >= 0.6 ? "secondary" :
                          "destructive"
                        }>
                          {parseFloat(investigacionDetalle.indiceRobustez || "0").toFixed(2)}
                        </Badge>
                      </div>
                      {investigacionDetalle.fechaCierreSemantico && typeof investigacionDetalle.fechaCierreSemantico === 'string' && (
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground">Cierre Semántico</h3>
                          <p className="text-sm">
                            {new Date(investigacionDetalle.fechaCierreSemantico).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Fuentes Oficiales */}
              {fuentesLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : fuentes && fuentes.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Fuentes Oficiales</h2>
                  <div className="grid gap-4">
                    {fuentes.map((fuente) => (
                      <Card key={fuente.id} className="border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <CardTitle className="text-lg">{fuente.titulo}</CardTitle>
                              </div>
                              {fuente.autor && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Autor:</strong> {fuente.autor}
                                </p>
                              )}
                              {fuente.institucion && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Institución:</strong> {fuente.institucion}
                                </p>
                              )}
                              {fuente.notas && (
                                <p className="text-sm text-muted-foreground">{fuente.notas}</p>
                              )}
                              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                                <Badge variant="outline">{fuente.tipo}</Badge>
                                {fuente.fechaConsulta && typeof fuente.fechaConsulta === 'string' && (
                                  <span>
                                    Consultado: {new Date(fuente.fechaConsulta).toLocaleDateString('es-MX')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {fuente.url && (
                          <CardContent>
                            <a href={fuente.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="secondary" className="w-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Ver Fuente
                              </Button>
                            </a>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Archivos CSV */}
              {datosCSV.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Archivos CSV</h2>
                  <div className="grid gap-4">
                    {datosCSV.map((dato) => (
                      <Card key={dato.id} className="border-border hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                <CardTitle className="text-lg">{dato.titulo}</CardTitle>
                              </div>
                              <CardDescription>{dato.descripcion}</CardDescription>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                                <Badge variant="secondary">{dato.formato || 'text/csv'}</Badge>
                                {dato.tamano && (
                                  <span>
                                    {(dato.tamano / 1024).toFixed(2)} KB
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
              ) : (
                <Card className="border-border">
                  <CardContent className="py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay archivos CSV disponibles</h3>
                    <p className="text-muted-foreground">
                      Esta investigación no tiene archivos CSV publicados aún.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Estado inicial: sin investigación seleccionada */}
          {!investigacionSeleccionada && (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Selecciona una investigación</h3>
                <p className="text-muted-foreground">
                  Elige una investigación del selector superior para ver sus datos abiertos, fuentes 
                  oficiales y metadatos asociados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
