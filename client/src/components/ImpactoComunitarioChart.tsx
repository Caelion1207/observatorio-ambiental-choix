import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ImpactoData {
  sector: string;
  severidad: number; // 1 = bajo, 2 = medio, 3 = alto
}

interface ImpactoComunitarioChartProps {
  dominioId: number;
}

export default function ImpactoComunitarioChart({ dominioId }: ImpactoComunitarioChartProps) {
  // Datos específicos por dominio (basados en sección Impacto Comunitario)
  const getDataByDominio = (id: number): ImpactoData[] => {
    switch (id) {
      case 1: // Hidrología
        return [
          { sector: "Agricultores", severidad: 3 },
          { sector: "Población urbana", severidad: 2 },
          { sector: "Ganaderos", severidad: 3 },
        ];
      case 2: // Medio Ambiente
        return [
          { sector: "Agricultores", severidad: 2 },
          { sector: "Población rural", severidad: 2 },
          { sector: "Comunidad general", severidad: 3 },
        ];
      case 3: // Salud
        return [
          { sector: "Población rural", severidad: 3 },
          { sector: "Adultos mayores", severidad: 3 },
          { sector: "Mujeres embarazadas", severidad: 3 },
        ];
      case 4: // Educación
        return [
          { sector: "Estudiantes", severidad: 2 },
          { sector: "Docentes", severidad: 2 },
          { sector: "Familias", severidad: 2 },
        ];
      case 5: // Infraestructura (Transporte)
        return [
          { sector: "Transportistas", severidad: 3 },
          { sector: "Comerciantes", severidad: 3 },
          { sector: "Población general", severidad: 2 },
        ];
      case 6: // Infraestructura (Vial)
        return [
          { sector: "Transportistas", severidad: 3 },
          { sector: "Agricultores", severidad: 2 },
          { sector: "Población general", severidad: 3 },
        ];
      default:
        return [];
    }
  };

  const data = getDataByDominio(dominioId);

  if (data.length === 0) {
    return null;
  }

  // Colores según severidad
  const getColor = (severidad: number) => {
    switch (severidad) {
      case 1: return "hsl(var(--chart-3))"; // Verde/bajo
      case 2: return "hsl(var(--chart-4))"; // Amarillo/medio
      case 3: return "hsl(var(--destructive))"; // Rojo/alto
      default: return "hsl(var(--muted))";
    }
  };

  const getSeveridadLabel = (severidad: number) => {
    switch (severidad) {
      case 1: return "Bajo";
      case 2: return "Medio";
      case 3: return "Alto";
      default: return "Desconocido";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Impacto por Sectores Comunitarios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              domain={[0, 3]} 
              ticks={[0, 1, 2, 3]}
              className="text-xs"
            />
            <YAxis 
              type="category" 
              dataKey="sector" 
              className="text-xs"
              width={110}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => [getSeveridadLabel(value), 'Nivel de impacto']}
            />
            <Bar dataKey="severidad" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.severidad)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
            <span className="text-muted-foreground">Bajo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--chart-4))" }} />
            <span className="text-muted-foreground">Medio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--destructive))" }} />
            <span className="text-muted-foreground">Alto</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Nivel de severidad del impacto en diferentes sectores de la comunidad bajo escenarios de estrés del sistema.
        </p>
      </CardContent>
    </Card>
  );
}
