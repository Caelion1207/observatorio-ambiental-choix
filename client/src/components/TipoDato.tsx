import { cn } from "@/lib/utils";
import { Database, MapPin, Lightbulb, TrendingUp } from "lucide-react";

type TipoDatoVariant = "observado" | "observado_nacional" | "estimado_municipal" | "supuesto" | "supuesto_declarado" | "escenario";

interface TipoDatoProps {
  tipo: TipoDatoVariant;
  children: React.ReactNode;
  className?: string;
}

const tipoConfig: Record<TipoDatoVariant, {
  icon: React.ElementType;
  label: string;
  emoji: string;
  description: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  observado: {
    icon: Database,
    label: "Observado (fuente nacional)",
    emoji: "📊",
    description: "Dato registrado con fuente oficial nacional citada",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
  },
  observado_nacional: {
    icon: Database,
    label: "Observado (fuente nacional)",
    emoji: "📊",
    description: "Dato registrado con fuente oficial nacional citada",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
  },
  estimado_municipal: {
    icon: MapPin,
    label: "Estimado municipal",
    emoji: "📍",
    description: "Cifra derivada de desagregación de datos estatales ante ausencia de inventario local",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-900",
  },
  supuesto: {
    icon: Lightbulb,
    label: "Supuesto declarado",
    emoji: "🧩",
    description: "Explícito, auditable y sujeto a revisión",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-900",
  },
  supuesto_declarado: {
    icon: Lightbulb,
    label: "Supuesto declarado",
    emoji: "🧩",
    description: "Explícito, auditable y sujeto a revisión",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-900",
  },
  escenario: {
    icon: TrendingUp,
    label: "Escenario hipotético",
    emoji: "📈",
    description: "Simulación estructural — no representa resultado empírico",
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
          <div className="flex items-center gap-2 flex-wrap">
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
