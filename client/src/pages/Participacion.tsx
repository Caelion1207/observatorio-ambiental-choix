import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function Participacion() {
  const [formData, setFormData] = useState({
    categoria: "",
    nombre: "",
    email: "",
    asunto: "",
    contenido: "",
  });

  const createParticipacion = trpc.participaciones.create.useMutation({
    onSuccess: () => {
      toast.success("Participación enviada correctamente");
      setFormData({
        categoria: "",
        nombre: "",
        email: "",
        asunto: "",
        contenido: "",
      });
    },
    onError: (error) => {
      toast.error("Error al enviar la participación: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoria || !formData.nombre || !formData.email || !formData.asunto || !formData.contenido) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    createParticipacion.mutate(formData as any);
  };

  const categorias = [
    {
      value: "correccion_datos",
      label: "Corrección de Datos",
      descripcion: "Señalar errores o imprecisiones en los datos presentados",
    },
    {
      value: "nueva_fuente",
      label: "Nueva Fuente Oficial",
      descripcion: "Sugerir fuentes oficiales adicionales no consideradas",
    },
    {
      value: "aclaracion_tecnica",
      label: "Aclaración Técnica",
      descripcion: "Solicitar aclaración sobre aspectos técnicos o metodológicos",
    },
    {
      value: "pregunta_metodologica",
      label: "Pregunta Metodológica",
      descripcion: "Consultar sobre la metodología empleada en el análisis",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          {/* Encabezado */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Participación Ciudadana</h1>
            <p className="text-lg text-muted-foreground">
              Formulario estructurado para corrección de datos, nuevas fuentes oficiales,
              aclaraciones técnicas y preguntas metodológicas. Sin comentarios abiertos.
            </p>
          </div>

          {/* Alertas Informativas */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Participación estructurada:</strong> Este formulario está diseñado para
              mantener un nivel técnico y evitar comentarios no constructivos. Todas las
              participaciones son revisadas por los administradores del observatorio.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Nota importante:</strong> Solo se aceptan participaciones que aporten datos
              verificables, fuentes oficiales o preguntas técnicas específicas. No se responderán
              opiniones personales o comentarios sin fundamento técnico.
            </AlertDescription>
          </Alert>

          {/* Formulario */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Formulario de Participación</CardTitle>
              <CardDescription>
                Complete todos los campos para enviar su participación. Recibirá una respuesta en
                caso de ser necesario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Categoría */}
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{cat.label}</span>
                            <span className="text-xs text-muted-foreground">{cat.descripcion}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Su nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Asunto */}
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto *</Label>
                  <Input
                    id="asunto"
                    type="text"
                    placeholder="Resuma su participación en una línea"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  />
                </div>

                {/* Contenido */}
                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido *</Label>
                  <Textarea
                    id="contenido"
                    placeholder="Describa su participación de forma clara y técnica. Incluya fuentes o referencias si es posible."
                    rows={8}
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  />
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createParticipacion.isPending}
                >
                  {createParticipacion.isPending ? "Enviando..." : "Enviar Participación"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
