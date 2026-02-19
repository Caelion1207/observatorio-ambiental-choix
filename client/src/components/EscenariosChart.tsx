import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EscenarioData {
  nombre: string;
  ive: number;
  capacidadDisponible?: number;
  deficit?: number;
}

interface EscenariosChartProps {
  dominioId: number;
}

export default function EscenariosChart({ dominioId }: EscenariosChartProps) {
  // Datos específicos por dominio (basados en investigaciones reales)
  const getDataByDominio = (id: number): EscenarioData[] => {
    switch (id) {
      case 1: // Hidrología
        return [
          { nombre: "Conservador", ive: 0.85, capacidadDisponible: 42, deficit: 0 },
          { nombre: "Estrés", ive: 0.62, capacidadDisponible: 18, deficit: 12 },
          { nombre: "Extremo", ive: 0.38, capacidadDisponible: 5, deficit: 35 },
        ];
      case 2: // Medio Ambiente
        return [
          { nombre: "Conservador", ive: 0.78, capacidadDisponible: 85 },
          { nombre: "Estrés", ive: 0.55, capacidadDisponible: 65 },
          { nombre: "Extremo", ive: 0.32, capacidadDisponible: 45 },
        ];
      case 3: // Salud
        return [
          { nombre: "Conservador", ive: 0.72, capacidadDisponible: 120 },
          { nombre: "Estrés", ive: 0.48, capacidadDisponible: 80 },
          { nombre: "Extremo", ive: 0.28, capacidadDisponible: 40 },
        ];
      case 4: // Educación
        return [
          { nombre: "Conservador", ive: 0.88, capacidadDisponible: 150 },
          { nombre: "Estrés", ive: 0.65, capacidadDisponible: 110 },
          { nombre: "Extremo", ive: 0.42, capacidadDisponible: 70 },
        ];
      case 5: // Infraestructura (Transporte)
        return [
          { nombre: "Conservador", ive: 0.68, capacidadDisponible: 2800 },
          { nombre: "Estrés", ive: 0.45, capacidadDisponible: 2200 },
          { nombre: "Extremo", ive: 0.25, capacidadDisponible: 1500 },
        ];
      case 6: // Infraestructura (Vial)
        return [
          { nombre: "Conservador", ive: 0.70, capacidadDisponible: 3200 },
          { nombre: "Estrés", ive: 0.48, capacidadDisponible: 2500 },
          { nombre: "Extremo", ive: 0.28, capacidadDisponible: 1800 },
        ];
      default:
        return [];
    }
  };

  const data = getDataByDominio(dominioId);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Comparación de Escenarios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="nombre" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'ive') return [value.toFixed(2), 'IVE'];
                if (name === 'capacidadDisponible') return [value, 'Capacidad'];
                if (name === 'deficit') return [value, 'Déficit'];
                return [value, name];
              }}
            />
            <Legend 
              formatter={(value: string) => {
                if (value === 'ive') return 'Índice de Viabilidad Estructural (IVE)';
                if (value === 'capacidadDisponible') return 'Capacidad Disponible';
                if (value === 'deficit') return 'Déficit';
                return value;
              }}
            />
            <Bar dataKey="ive" fill="hsl(var(--primary))" name="ive" />
            {data[0].capacidadDisponible !== undefined && (
              <Bar dataKey="capacidadDisponible" fill="hsl(var(--chart-2))" name="capacidadDisponible" />
            )}
            {data[0].deficit !== undefined && (
              <Bar dataKey="deficit" fill="hsl(var(--destructive))" name="deficit" />
            )}
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4">
          Los escenarios muestran la variación del IVE y variables críticas bajo diferentes condiciones de estrés del sistema.
        </p>
      </CardContent>
    </Card>
  );
}
