import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

interface RelatedInvestigacionesProps {
  categoria: string;
  currentSlug: string;
}

const categoriaLabels: Record<string, string> = {
  hidrologia: "Hidrología",
  medio_ambiente: "Medio Ambiente",
  infraestructura: "Infraestructura",
  salud: "Salud",
  educacion: "Educación",
  transporte: "Transporte",
};

/**
 * Componente de investigaciones relacionadas por categoría
 * Muestra 2-3 investigaciones de la misma categoría
 */
export default function RelatedInvestigaciones({
  categoria,
  currentSlug,
}: RelatedInvestigacionesProps) {
  const { data: related, isLoading } = trpc.investigaciones.getRelated.useQuery({
    categoria,
    currentSlug,
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!related || related.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Investigaciones Relacionadas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Otros análisis en {categoriaLabels[categoria] || categoria}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((inv) => (
          <Link key={inv.id} href={`/investigaciones/${inv.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    #{inv.numero}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {categoriaLabels[inv.categoria] || inv.categoria}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {inv.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {inv.resumenEjecutivo}
                </p>
                <div className="flex items-center text-sm text-primary font-medium">
                  Leer análisis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
