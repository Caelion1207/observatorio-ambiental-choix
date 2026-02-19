import { cn } from "@/lib/utils";
import { Database, Lightbulb, TrendingUp } from "lucide-react";

type TipoDatoVariant = "observado" | "supuesto" | "escenario";

interface TipoDatoProps {
  tipo: TipoDatoVariant;
  children: React.ReactNode;
  className?: string;
}

const tipoConfig = {
  observado: {
    icon: Database,
    label: "Dato Observado",
    emoji: "📊",
    description: "Fuente citada obligatoria",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
  },
  supuesto: {
    icon: Lightbulb,
    label: "Supuesto Declarado",
    emoji: "🧩",
    description: "Explícito y auditable",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-900",
  },
  escenario: {
    icon: TrendingUp,
    label: "Escenario Hipotético",
    emoji: "📈",
    description: "Marcado como simulación",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-900",
  },
};

export default function TipoDato({ tipo, children, className }: TipoDatoProps) {
  const config = tipoConfig[tipo];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          <Icon className={cn("h-5 w-5", config.textColor)} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{config.emoji}</span>
            <span className={cn("text-sm font-semibold", config.textColor)}>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">
              • {config.description}
            </span>
          </div>
          <div className="text-sm text-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
