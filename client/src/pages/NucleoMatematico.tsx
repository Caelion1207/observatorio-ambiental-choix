export default function NucleoMatematico() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">

        {/* Header */}
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Arquitectura de Gobernanza
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Núcleo Matemático Cerrado
          </h1>
          <div className="bg-muted/50 border border-border rounded-md p-4 text-sm text-muted-foreground space-y-1">
            <p>Este documento define el núcleo matemático cerrado del sistema.</p>
            <p>Incluye únicamente las estructuras necesarias para implementación.</p>
            <p>No contiene expansión conceptual adicional.</p>
          </div>
        </div>

        {/* Sección 1 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">1.</span>
            Espacio del Sistema
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Estado dinámico</p>
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                x_k ∈ ℝ<sup>m</sup>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Parámetros estructurales</p>
              <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-2">
                <p>θ_k = (θ_hard , θ_soft_k)</p>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-foreground pl-4">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><span className="font-mono">θ_hard</span> es constante.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><span className="font-mono">θ_soft_k</span> evoluciona lentamente y es auditado.</span></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Dominio viable paramétrico</p>
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                𝓥_k = {"{ x ∈ ℝ"}
                <sup>m</sup> | g(x, θ_k) ≤ 0 {"}"}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Radio del núcleo</p>
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                r(θ_k) definido como función geométrica del dominio.
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">2.</span>
            IRM — Índice de Robustez Metodológica
          </h2>

          <div className="bg-muted rounded-md p-4 font-mono text-sm mb-4">
            IRM_k = Σ ( w_i · V(s_i) · A(s_i) · M(s_i) )
          </div>

          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Condiciones</p>
          <ul className="space-y-2 text-sm text-foreground pl-4">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">Σ w_i = 1</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">V(s_i) ∈ {"{"} 0,1 {"}"}</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">A(s_i), M(s_i) ∈ [0,1]</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">IRM_k ∈ [0,1]</span></li>
          </ul>
        </section>

        {/* Sección 3 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">3.</span>
            IVE — Índice de Viabilidad Estructural
          </h2>

          <div className="bg-muted rounded-md p-4 font-mono text-sm mb-6">
            IVE_k = max( 0 , d(x_k , ∂𝓥_k) / r(θ_k) )
          </div>

          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Para implementación elipsoidal</p>
          <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-2">
            <p>𝓥_k: (x − c)<sup>T</sup> P (x − c) ≤ 1</p>
            <p>d(x, ∂𝓥_k) = 1 − (x − c)<sup>T</sup> P (x − c)</p>
            <p>r(θ_k) = 1</p>
          </div>
          <p className="mt-3 text-sm text-foreground pl-4 flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span className="font-mono">IVE_k ∈ [0,1]</span>
          </p>
        </section>

        {/* Sección 4 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">4.</span>
            RLD — Reserva de Legitimidad Dinámica
          </h2>

          <div className="bg-muted rounded-md p-4 font-mono text-sm mb-6 space-y-2">
            <p>RLD_{"{"} k+1 {"}"} = max( 0 , min( 2 , RLD_k + Δ_k − δ_k ) )</p>
            <p className="pt-2">Δ_k = Δ_0 · 1_{"{"} acción válida {"}"}</p>
            <p>δ_k = α·1_{"{"} IVE_k{"<"}0.3 {"}"} + β·1_{"{"} IRM_k{"<"}0.5 {"}"} + γ·(1 − Ω_k)</p>
          </div>

          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Parámetros base</p>
          <ul className="space-y-2 text-sm text-foreground pl-4">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">α = 0.1</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">β = 0.1</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">γ = 0.2</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">Δ_0 = 0.05</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span className="font-mono">RLD_k ∈ [0,2]</span></li>
          </ul>
        </section>

        {/* Sección 5 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">5.</span>
            Dinámica de Parámetros
          </h2>

          <div className="bg-muted rounded-md p-4 font-mono text-sm mb-4">
            θ_{"{"} k+1 {"}"} = θ_k + η_k + ε_k
          </div>

          <ul className="space-y-2 text-sm text-foreground pl-4">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><span className="font-mono">η_k</span>: adaptación auditada y lenta.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><span className="font-mono">ε_k</span>: shock exógeno.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Cambios en <span className="font-mono">θ_k</span> deben registrarse con versionado.</span></li>
          </ul>
        </section>

        {/* Sección 6 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="text-2xl font-mono text-primary">6.</span>
            Ciclo Operativo por Iteración
          </h2>

          <ol className="space-y-3 text-sm text-foreground">
            {[
              "Leer estado x_k.",
              "Leer parámetros θ_k.",
              "Calcular IRM_k.",
              "Calcular IVE_k.",
              "Calcular RLD_{k+1}.",
              "Registrar métricas.",
              "Actualizar θ_k si corresponde.",
            ].map((paso, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="font-mono">{paso}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Cierre */}
        <section className="border-t border-border pt-8">
          <h3 className="text-base font-bold text-foreground mb-4">
            El sistema está matemáticamente cerrado si:
          </h3>
          <ul className="space-y-2 text-sm text-foreground pl-4 mb-8">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>Todas las métricas están acotadas.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>No existe dependencia circular.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>El dominio viable es paramétrico y auditado.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span>RLD responde a IVE, IRM y Ω sin retroalimentación oculta.</span></li>
          </ul>

          <div className="bg-muted/50 border border-border rounded-md p-4 text-xs font-mono text-muted-foreground text-center">
            Fin del núcleo cerrado.
          </div>
        </section>

      </div>
    </div>
  );
}
