import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface PanelValidacionProps {
  slug: string;
}

export function PanelValidacion({ slug }: PanelValidacionProps) {
  const { data: validacion, isLoading } = trpc.investigaciones.validarIntegridad.useQuery({ slug });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validación ARESK/ARGOS</CardTitle>
          <CardDescription>Cargando análisis de integridad...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!validacion) {
    return null;
  }

  const getPuntajeColor = (puntaje: number) => {
    if (puntaje >= 80) return 'text-green-600';
    if (puntaje >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPuntajeLabel = (puntaje: number) => {
    if (puntaje >= 80) return 'Robusto';
    if (puntaje >= 60) return 'Moderado';
    return 'Débil';
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return <AlertCircle className="h-4 w-4" />;
      case 'advertencia':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (tipo: string): "default" | "destructive" => {
    return tipo === 'critico' ? 'destructive' : 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Validación ARESK/ARGOS</span>
          <Badge variant={validacion.puntajeIntegridad >= 80 ? 'default' : validacion.puntajeIntegridad >= 60 ? 'secondary' : 'destructive'}>
            {getPuntajeLabel(validacion.puntajeIntegridad)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Análisis automático de integridad estructural
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Puntaje de Integridad */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Puntaje de Integridad</span>
            <span className={`text-2xl font-bold ${getPuntajeColor(validacion.puntajeIntegridad)}`}>
              {validacion.puntajeIntegridad}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                validacion.puntajeIntegridad >= 80
                  ? 'bg-green-600'
                  : validacion.puntajeIntegridad >= 60
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${validacion.puntajeIntegridad}%` }}
            />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Índice de Completitud</p>
            <p className="text-2xl font-semibold">{(validacion.indiceCompletitud * 100).toFixed(0)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Supuestos Sin Fuente</p>
            <p className="text-2xl font-semibold">{validacion.supuestosSinFuente}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Conteo "Estimado"</p>
            <p className="text-2xl font-semibold">{validacion.conteoEstimado}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Campos Vacíos</p>
            <p className="text-2xl font-semibold">{validacion.camposNull.length}</p>
          </div>
        </div>

        {/* Alertas */}
        {validacion.alertas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Alertas Detectadas</h4>
            {validacion.alertas.map((alerta, index) => (
              <Alert key={index} variant={getAlertVariant(alerta.tipo)}>
                <div className="flex items-start gap-2">
                  {getAlertIcon(alerta.tipo)}
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-medium">
                      {alerta.categoria}
                    </AlertTitle>
                    <AlertDescription className="text-sm mt-1">
                      <p>{alerta.mensaje}</p>
                      <p className="mt-1 text-xs italic">{alerta.sugerencia}</p>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Mensaje de éxito */}
        {validacion.alertas.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Validación Exitosa</AlertTitle>
            <AlertDescription>
              No se detectaron problemas de integridad en esta investigación.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
