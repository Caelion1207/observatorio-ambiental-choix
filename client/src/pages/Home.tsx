import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container max-w-4xl">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Laboratorio Público de Análisis Estructural
            </h1>
            <p className="text-xl text-muted-foreground">Choix, Sinaloa</p>

            {/* Qué es */}
            <div className="prose prose-lg mx-auto text-left max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Qué es el Observatorio</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Un laboratorio que aplica un protocolo constante de análisis estructural a problemáticas 
                  locales. Cada estudio se basa en datos públicos, supuestos declarados y variables auditables.
                </p>
              </div>

              {/* Qué hace */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Qué hace</h2>
                <ul className="text-lg leading-relaxed text-muted-foreground space-y-2">
                  <li>Extrae datos de fuentes oficiales (INEGI, SEP, CONAGUA, etc.)</li>
                  <li>Declara explícitamente qué supuestos usa y cuáles ha verificado</li>
                  <li>Construye modelos mínimos para evaluar escenarios posibles</li>
                  <li>Identifica brechas de información que limitan el análisis</li>
                  <li>Publica todo el proceso para que sea auditable</li>
                </ul>
              </div>

              {/* Qué NO hace */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Qué NO hace</h2>
                <ul className="text-lg leading-relaxed text-muted-foreground space-y-2">
                  <li>No emite juicios morales ni acusaciones</li>
                  <li>No hace recomendaciones políticas</li>
                  <li>No inventa datos ni usa fuentes no verificables</li>
                  <li>No oculta limitaciones metodológicas</li>
                  <li>No sustituye la decisión de autoridades electas</li>
                </ul>
                
                {/* Regla estructural de integridad de datos */}
                <div className="mt-6 p-4 border-2 border-primary/30 bg-primary/5 rounded-lg">
                  <p className="text-base font-semibold text-foreground">
                    🚨 Principio de Integridad de Datos
                  </p>
                  <p className="text-base text-muted-foreground mt-2">
                    El Observatorio no genera resultados empíricos ni simula impacto real. 
                    Solo analiza estructuras con base en datos públicos verificables.
                  </p>
                </div>
              </div>
            </div>

            {/* Enlaces principales */}
            <div className="flex gap-4 justify-center pt-6">
              <Link href="/metodologia">
                <Button size="lg">Conocer Protocolo</Button>
              </Link>
              <Link href="/investigaciones">
                <Button variant="outline" size="lg">
                  Ver Investigaciones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 py-8">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>Laboratorio Público de Análisis Estructural - Choix, Sinaloa</p>
            <p className="mt-2">
              Protocolo replicable • Datos públicos • Variables auditables
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
