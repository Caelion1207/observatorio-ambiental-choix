import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface Supuesto {
  id: number;
  supuesto: string;
  impacto: "Alto" | "Medio" | "Bajo";
  sensibilidad: "Crítico" | "Moderado" | "Bajo";
  verificado: boolean;
}

interface RegistroSupuestosProps {
  supuestos: Supuesto[];
}

export default function RegistroSupuestos({ supuestos }: RegistroSupuestosProps) {
  if (!supuestos || supuestos.length === 0) {
    return null;
  }

  const getImpactoBadge = (impacto: string) => {
    switch (impacto) {
      case "Alto":
        return <Badge variant="destructive">Alto</Badge>;
      case "Medio":
        return <Badge variant="secondary">Medio</Badge>;
      case "Bajo":
        return <Badge variant="outline">Bajo</Badge>;
      default:
        return <Badge variant="outline">{impacto}</Badge>;
    }
  };

  const getSensibilidadBadge = (sensibilidad: string) => {
    switch (sensibilidad) {
      case "Crítico":
        return <Badge className="bg-red-600 hover:bg-red-700">Crítico</Badge>;
      case "Moderado":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Moderado</Badge>;
      case "Bajo":
        return <Badge className="bg-green-600 hover:bg-green-700">Bajo</Badge>;
      default:
        return <Badge>{sensibilidad}</Badge>;
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl">Registro Público de Supuestos</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Cada supuesto está clasificado por su impacto en el modelo y su nivel de sensibilidad. 
          Los supuestos verificados cuentan con fuentes primarias que respaldan su validez.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-semibold">#</th>
                <th className="text-left p-3 text-sm font-semibold">Supuesto</th>
                <th className="text-center p-3 text-sm font-semibold">Impacto</th>
                <th className="text-center p-3 text-sm font-semibold">Sensibilidad</th>
                <th className="text-center p-3 text-sm font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {supuestos.map((sup) => (
                <tr key={sup.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3 text-sm font-mono text-muted-foreground">{sup.id}</td>
                  <td className="p-3 text-sm">{sup.supuesto}</td>
                  <td className="p-3 text-center">{getImpactoBadge(sup.impacto)}</td>
                  <td className="p-3 text-center">{getSensibilidadBadge(sup.sensibilidad)}</td>
                  <td className="p-3 text-center">
                    {sup.verificado ? (
                      <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Verificado</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Pendiente</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leyenda */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <strong>Impacto:</strong> Magnitud del efecto del supuesto sobre las conclusiones del modelo. 
              Si el supuesto es falso, ¿qué tan drásticamente cambiarían los resultados?
            </div>
            <div>
              <strong>Sensibilidad:</strong> Nivel de dependencia del modelo respecto al supuesto. 
              Supuestos críticos requieren verificación rigurosa antes de publicación.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
