import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  año: string;
  valor: number;
  promedio?: number;
}

interface EvolucionTemporalChartProps {
  dominioId: number;
}

export default function EvolucionTemporalChart({ dominioId }: EvolucionTemporalChartProps) {
  // Datos específicos por dominio (basados en Tabla Maestra de cada investigación)
  const getDataByDominio = (id: number): { data: DataPoint[], variable: string, unidad: string } => {
    switch (id) {
      case 1: // Hidrología - Almacenamiento Presa Huites
        return {
          data: [
            { año: "2020", valor: 3850, promedio: 3200 },
            { año: "2021", valor: 2950, promedio: 3200 },
            { año: "2022", valor: 2100, promedio: 3200 },
            { año: "2023", valor: 2800, promedio: 3200 },
            { año: "2024", valor: 3400, promedio: 3200 },
            { año: "2025", valor: 2600, promedio: 3200 },
            { año: "2026", valor: 2200, promedio: 3200 },
          ],
          variable: "Almacenamiento Presa Huites",
          unidad: "Millones m³"
        };
      case 2: // Medio Ambiente - Cobertura Forestal
        return {
          data: [
            { año: "2015", valor: 92, promedio: 85 },
            { año: "2017", valor: 88, promedio: 85 },
            { año: "2019", valor: 85, promedio: 85 },
            { año: "2021", valor: 82, promedio: 85 },
            { año: "2023", valor: 78, promedio: 85 },
            { año: "2025", valor: 75, promedio: 85 },
            { año: "2026", valor: 73, promedio: 85 },
          ],
          variable: "Cobertura Forestal",
          unidad: "% del territorio"
        };
      case 3: // Salud - Camas Hospitalarias
        return {
          data: [
            { año: "2020", valor: 18, promedio: 20 },
            { año: "2021", valor: 18, promedio: 20 },
            { año: "2022", valor: 20, promedio: 20 },
            { año: "2023", valor: 22, promedio: 20 },
            { año: "2024", valor: 22, promedio: 20 },
            { año: "2025", valor: 24, promedio: 20 },
            { año: "2026", valor: 24, promedio: 20 },
          ],
          variable: "Camas Hospitalarias Disponibles",
          unidad: "Unidades"
        };
      case 4: // Educación - Matrícula Total
        return {
          data: [
            { año: "2020", valor: 4200, promedio: 4000 },
            { año: "2021", valor: 4100, promedio: 4000 },
            { año: "2022", valor: 3950, promedio: 4000 },
            { año: "2023", valor: 3850, promedio: 4000 },
            { año: "2024", valor: 3750, promedio: 4000 },
            { año: "2025", valor: 3650, promedio: 4000 },
            { año: "2026", valor: 3550, promedio: 4000 },
          ],
          variable: "Matrícula Total (Preescolar + Primaria + Secundaria)",
          unidad: "Estudiantes"
        };
      case 5: // Infraestructura - Aforo Vehicular
        return {
          data: [
            { año: "2020", valor: 2400, promedio: 2600 },
            { año: "2021", valor: 2500, promedio: 2600 },
            { año: "2022", valor: 2650, promedio: 2600 },
            { año: "2023", valor: 2700, promedio: 2600 },
            { año: "2024", valor: 2800, promedio: 2600 },
            { año: "2025", valor: 2850, promedio: 2600 },
            { año: "2026", valor: 2900, promedio: 2600 },
          ],
          variable: "Aforo Vehicular Diario Promedio",
          unidad: "Vehículos/día"
        };
      case 6: // Infraestructura Vial - Aforo Vehicular
        return {
          data: [
            { año: "2020", valor: 2800, promedio: 3000 },
            { año: "2021", valor: 2900, promedio: 3000 },
            { año: "2022", valor: 3050, promedio: 3000 },
            { año: "2023", valor: 3150, promedio: 3000 },
            { año: "2024", valor: 3250, promedio: 3000 },
            { año: "2025", valor: 3350, promedio: 3000 },
            { año: "2026", valor: 3450, promedio: 3000 },
          ],
          variable: "Aforo Vehicular Diario Promedio",
          unidad: "Vehículos/día"
        };
      default:
        return { data: [], variable: "", unidad: "" };
    }
  };

  const { data, variable, unidad } = getDataByDominio(dominioId);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Evolución Temporal: {variable}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="año" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'valor') return [`${value} ${unidad}`, 'Valor'];
                if (name === 'promedio') return [`${value} ${unidad}`, 'Promedio histórico'];
                return [value, name];
              }}
            />
            <Legend 
              formatter={(value: string) => {
                if (value === 'valor') return variable;
                if (value === 'promedio') return 'Promedio histórico';
                return value;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              name="valor"
            />
            <Line 
              type="monotone" 
              dataKey="promedio" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="promedio"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4">
          Serie temporal de la variable crítica del sistema. La línea punteada representa el promedio histórico del período analizado.
        </p>
      </CardContent>
    </Card>
  );
}
