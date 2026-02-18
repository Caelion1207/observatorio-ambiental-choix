import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, Loader2, FileDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Streamdown } from "streamdown";
import TableOfContents from "@/components/TableOfContents";
import RelatedInvestigaciones from "@/components/RelatedInvestigaciones";
import InvestigacionImages from "@/components/InvestigacionImages";
import ProtocoloVersion from "@/components/ProtocoloVersion";
import RegistroSupuestos, { type Supuesto } from "@/components/RegistroSupuestos";
import { PanelValidacion } from "@/components/PanelValidacion";

export default function InvestigacionDetalle() {
  const [, params] = useRoute("/investigaciones/:slug");
  const slug = params?.slug || "";

  const { data: investigacion, isLoading } = trpc.investigaciones.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );
  
  // Obtener fuentes de la investigación desde tabla separada (DEBE estar antes de cualquier return)
  const { data: fuentes } = trpc.fuentes.getByInvestigacionId.useQuery(
    { investigacionId: investigacion?.id || 0 },
    { enabled: !!investigacion?.id }
  );
  
  const exportPDF = trpc.investigaciones.exportPDF.useMutation({
    onSuccess: (data) => {
      let blob: Blob;
      
      if (data.format === 'pdf') {
        // Convertir base64 PDF a blob
        const byteCharacters = atob(data.pdfBase64!);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'application/pdf' });
      } else {
        // Fallback HTML: convertir base64 HTML a blob
        const byteCharacters = atob(data.htmlBase64!);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'text/html' });
        
        // Mostrar notificación de fallback
        console.warn('PDF no disponible, descargando HTML formateado:', data.fallbackReason);
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  });
  
  const handleExportPDF = () => {
    if (slug) {
      exportPDF.mutate({ slug });
    }
  };

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

  // Parsear supuestos estructurados si existen
  let supuestosEstructurados: Supuesto[] = [];
  if (investigacion.supuestosEstructurados) {
    try {
      supuestosEstructurados = JSON.parse(investigacion.supuestosEstructurados);
    } catch (e) {
      console.error("Error parsing supuestosEstructurados:", e);
    }
  }

  // Construir secciones con fuentes si existen
  const secciones = [
    { id: "definicion-sistema", titulo: "1. Definición del Sistema", contenido: investigacion.definicionSistema },
    { id: "tabla-maestra", titulo: "2. Tabla Maestra de Datos", contenido: investigacion.tablaMaestra },
    { id: "supuestos", titulo: "3. Supuestos Explícitos", contenido: investigacion.supuestos },
    { id: "modelo-minimo", titulo: "4. Modelo Mínimo", contenido: investigacion.modelo },
    { id: "escenarios", titulo: "5. Escenarios", contenido: investigacion.escenarios },
    { id: "brechas", titulo: "6. Brechas Detectadas", contenido: investigacion.brechas },
    { id: "conclusion", titulo: "7. Conclusión Estructural", contenido: investigacion.conclusion },
  ];
  
  // Agregar sección de fuentes si existen
  if (fuentes && fuentes.length > 0) {
    console.log('[DEBUG] Fuentes recibidas:', fuentes);
    console.log('[DEBUG] Número de fuentes:', fuentes.length);
    const fuentesContent = fuentes.map((f, i) => {
      const partes = [];
      partes.push(`**${i + 1}. ${f.titulo}**`);
      if (f.autor) partes.push(`\n   - **Autor:** ${f.autor}`);
      if (f.institucion) partes.push(`\n   - **Institución:** ${f.institucion}`);
      if (f.tipo) partes.push(`\n   - **Tipo:** ${f.tipo}`);
      if (f.url) partes.push(`\n   - **URL:** [${f.url}](${f.url})`);
      if (f.fechaPublicacion) {
        const fecha = new Date(f.fechaPublicacion);
        partes.push(`\n   - **Fecha de Publicación:** ${format(fecha, 'MMMM yyyy', { locale: es })}`);
      }
      return partes.join('');
    }).join('\n\n');
    secciones.push({ id: "fuentes", titulo: "Fuentes Primarias", contenido: fuentesContent });
  }

  const tocSections = secciones.map(s => ({ id: s.id, title: s.titulo }));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <div className="max-w-4xl">
        <div className="space-y-8">
          {/* Navegación */}
          <div className="flex items-center justify-between">
            <Link href="/investigaciones">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a Investigaciones
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleExportPDF}
              disabled={exportPDF.isPending}
            >
              {exportPDF.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </>
              )}
            </Button>
          </div>

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

          {/* Blindaje Metodológico */}
          <ProtocoloVersion 
            version={investigacion.versionProtocolo || "1.0"}
            fechaCierre={investigacion.fechaCierreSemantico}
            indiceRobustez={investigacion.indiceRobustez}
          />

          {/* Registro Público de Supuestos */}
          {supuestosEstructurados.length > 0 && (
            <RegistroSupuestos supuestos={supuestosEstructurados} />
          )}

          {/* Panel de Validación ARESK/ARGOS */}
          <PanelValidacion slug={slug} />

          {/* Imágenes de Contexto */}
          {investigacion.dominioId === 1 && ( // Dominio Hidrología
            <InvestigacionImages
              images={[
                {
                  src: "/images/presa-huites-1.jpg",
                  alt: "Presa Luis Donaldo Colosio (Huites)",
                  caption: "Presa Luis Donaldo Colosio (Huites), principal fuente de almacenamiento hídrico de la región.",
                },
                {
                  src: "/images/presa-huites-2.jpg",
                  alt: "Vista aérea de Presa Huites",
                  caption: "Vista aérea mostrando el muro de contención y el cauce del río aguas abajo de la presa.",
                },
              ]}
            />
          )}

          {/* 7 Secciones del Protocolo + Fuentes */}
          {secciones.map((seccion, index) => (
            <Card key={index} id={seccion.id} className="border-border scroll-mt-20">
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

          {/* Investigaciones Relacionadas */}
          <div className="mt-12 pt-8 border-t border-border">
            <RelatedInvestigaciones 
              dominioId={investigacion.dominioId} 
              currentSlug={investigacion.slug} 
            />
          </div>
        </div>
      </div>
      {/* Índice de Contenidos (solo desktop) */}
      <div className="hidden lg:block">
        <TableOfContents sections={tocSections} />
      </div>
    </div>
    </div>
    </div>
  );
}
