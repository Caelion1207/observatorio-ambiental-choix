import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProtocoloVersionProps {
  version: string;
  fechaCierre?: Date | null;
  indiceRobustez?: string | null;
}

export default function ProtocoloVersion({ version, fechaCierre, indiceRobustez }: ProtocoloVersionProps) {
  const irm = indiceRobustez ? parseFloat(indiceRobustez) : 0;
  
  const getRobustezBadge = (irm: number) => {
    if (irm >= 0.8) {
      return { label: "Robusto", variant: "default" as const, color: "text-green-600 dark:text-green-400" };
    } else if (irm >= 0.6) {
      return { label: "Moderado", variant: "secondary" as const, color: "text-yellow-600 dark:text-yellow-400" };
    } else {
      return { label: "Débil", variant: "destructive" as const, color: "text-red-600 dark:text-red-400" };
    }
  };

  const robustezInfo = getRobustezBadge(irm);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Blindaje Metodológico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Versión del Protocolo */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Protocolo</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                v{version}
              </Badge>
            </div>
          </div>

          {/* Fecha de Cierre Semántico */}
          {fechaCierre && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Cierre Semántico
              </div>
              <div className="text-sm font-medium">
                {format(new Date(fechaCierre), "d 'de' MMMM 'de' yyyy", { locale: es })}
              </div>
            </div>
          )}

          {/* Índice de Robustez del Modelo */}
          {indiceRobustez && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Índice de Verificación Estructural (IVE)
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold font-mono ${robustezInfo.color}`}>
                  {irm.toFixed(2)}
                </span>
                <Badge variant={robustezInfo.variant}>{robustezInfo.label}</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Explicación del IRM */}
        {indiceRobustez && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>IVE (Índice de Verificación Estructural):</strong> Mide qué proporción de los supuestos críticos del análisis está respaldada por datos públicos verificables. 
              IVE = Supuestos Críticos Verificados / Total de Supuestos Críticos. 
              Valores cercanos a 1.00 indican mayor disponibilidad de datos oficiales.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
