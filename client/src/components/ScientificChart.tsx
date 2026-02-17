import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface ScientificChartProps {
  data: Array<Record<string, any>>;
  type?: "line" | "bar";
  xKey: string;
  yKeys: Array<{
    key: string;
    label: string;
    color?: string;
  }>;
  title: string;
  xLabel: string;
  yLabel: string;
  height?: number;
}

/**
 * Componente de gráfica científica estándar
 * Diseño técnico con ejes claros, leyendas precisas y colores sobrios
 */
export default function ScientificChart({
  data,
  type = "line",
  xKey,
  yKeys,
  title,
  xLabel,
  yLabel,
  height = 300,
}: ScientificChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colores ajustados para modo oscuro
  const textColor = isDark ? "#e5e7eb" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#4b5563" : "#d1d5db";

  const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-mono font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === "line" ? LineChart : BarChart;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
          <XAxis
            dataKey={xKey}
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -10,
              style: { fontSize: "12px", fill: textColor },
            }}
            tick={{ fontSize: 11, fill: textColor }}
            stroke={axisColor}
          />
          <YAxis
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: "12px", fill: textColor },
            }}
            tick={{ fontSize: 11, fill: textColor }}
            stroke={axisColor}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "10px",
            }}
          />
          {yKeys.map((yKey, index) => {
            const color = yKey.color || defaultColors[index % defaultColors.length];
            if (type === "line") {
              return (
                <Line
                  key={yKey.key}
                  type="monotone"
                  dataKey={yKey.key}
                  name={yKey.label}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: color }}
                  activeDot={{ r: 5 }}
                />
              );
            } else {
              return (
                <Bar
                  key={yKey.key}
                  dataKey={yKey.key}
                  name={yKey.label}
                  fill={color}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
