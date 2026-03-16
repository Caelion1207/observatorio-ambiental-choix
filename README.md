# Observatorio Ambiental de Choix

**Laboratorio Público de Análisis Estructural — Choix, Sinaloa, México**

> El Observatorio no genera resultados empíricos ni simula impacto real.
> Solo analiza estructuras con base en datos públicos verificables.

---

## ¿Qué es?

El Observatorio Ambiental de Choix es un sistema de análisis estructural que evalúa problemáticas ambientales del municipio de Choix, Sinaloa, usando únicamente fuentes públicas verificables. Cada investigación declara explícitamente sus datos observados, sus estimaciones y sus supuestos, sin mezclar las tres categorías.

El sistema no predice, no monitorea en tiempo real y no genera datos primarios. Su función es organizar lo que se sabe, declarar lo que no se sabe, y calcular índices que reflejen ambas condiciones con honestidad metodológica.

---

## Núcleo Matemático — CAELION v3.3

El sistema opera sobre seis ecuaciones fundamentales que conforman el núcleo **CAELION** (*Cognitive Architecture for Environmental and Legitimacy Index Operations*):

```
x(k+1) = F(x(k), u(k)) + ξ(k)    ← dinámica del estado cognitivo
e(k)   = x(k) − x_ref             ← error cognitivo respecto a referencia
V(x)   = e(k)ᵀ P e(k)             ← función de Lyapunov (estabilidad)
IRM(k) ∈ [0,1]                    ← filtro epistemológico (calidad de evidencia)
IVE(k) = IRM(k) · Σ(wⱼ · Nⱼ(k)) ← viabilidad estructural
RLD(k+1) = f(RLD, IVE, IRM, Ω)   ← legitimidad dinámica
```

### Separación de roles

| Operador | Función | Pregunta que responde |
|---|---|---|
| **CAELION** | Análisis estructural e hipótesis | ¿Cómo está organizado el sistema? |
| **IRM** | Filtro epistemológico | ¿Qué tan sólida es la evidencia disponible? |
| **IVE** | Viabilidad por reconocimiento de patrones | ¿Qué trayectoria sigue este sistema según casos similares? |
| **LIANG** | Decisión estratégica | ¿Qué se hace con lo que el análisis revela? |

LIANG solo se activa cuando `IRM ≥ 0.5` **y** `IVE ≥ 0.5` simultáneamente. Sin evidencia suficiente, no hay decisión válida.

### Cadena de cómputo

```
variables observables (fuentes públicas verificables)
        ↓  preprocesamiento (escala natural positiva)
subdimensiones → dimensiones estructurales (vector x_k)
        ↓
IRM  ← calidad de supuestos y fuentes que sostienen el análisis
        ↓
IVE  ← patrones de casos similares documentados + comparación con x_k
        ↓
RLD  ← legitimidad dinámica del sistema (α=0.10, β=0.10, γ=0.15)
        ↓
CAELION (análisis) ──→ LIANG (decisión estratégica, si IRM≥0.5 y IVE≥0.5)
```

### Estado absorbente IRM < 0.5

Cuando `IRM < 0.5`, la evidencia empírica se considera insuficiente. En este estado la RLD se degrada progresivamente y no puede recuperarse mediante acciones operativas. La única salida es mejorar la evidencia. Este comportamiento es **intencional**: *sin evidencia verificable no existe legitimidad estructural*.

---

## Clasificación de Datos

Cada variable del sistema se clasifica en una de tres categorías, declaradas explícitamente en cada investigación:

| Tipo | Descripción | Fuente típica |
|---|---|---|
| **Observado** | Dato registrado por autoridad federal o estatal | DOF, INEGI, CONAGUA, SEMARNAT |
| **Estimado municipal** | Dato derivado por desagregación de estadísticas estatales | ENIGH, Censo con factor de prorrateo |
| **Supuesto declarado** | Parámetro no verificado, asumido para completar el análisis | Declarado explícitamente con código S_n |

---

## Dominios Activos

El Observatorio cubre actualmente seis dominios de análisis:

| # | Dominio | Investigaciones |
|---|---|---|
| 1 | Sistema Hídrico | 2 (incluyendo evaluación CAELION v2.0) |
| 2 | Cobertura Forestal | 1 |
| 3 | Calidad del Suelo | 1 |
| 4 | Biodiversidad | 1 |
| 5 | Presión Socioeconómica | 1 |
| 6 | Gobernanza Ambiental | 1 |

**Total: 8 investigaciones en base de datos.**

---

## Arquitectura Técnica

El sistema está construido sobre una pila React + tRPC + Express + MySQL con autenticación OAuth integrada.

```
client/
  src/
    pages/          ← Investigaciones, dominios, núcleo matemático
    components/     ← TipoDato, visualizaciones, navegación
drizzle/
  schema.ts         ← Tablas: investigaciones, variables, supuestos, fuentes
server/
  routers.ts        ← Procedimientos tRPC (investigaciones, fuentes, supuestos)
  db.ts             ← Helpers de consulta
```

### Stack

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Express 4, tRPC 11, Drizzle ORM
- **Base de datos:** MySQL / TiDB
- **Autenticación:** Manus OAuth
- **Tests:** Vitest (12/12 pasando)

---

## Estado de Implementación

| Componente | Estado |
|---|---|
| Sistema web funcional | Activo — `choixenviro-ccnow76k.manus.space` |
| Protocolo de 9 secciones por investigación | Implementado |
| Clasificación TipoDato (Observado / Estimado / Supuesto) | Implementado |
| Núcleo CAELION v3.3 — especificación formal | Cerrado |
| IRM con scores por tipo de fuente | **Pendiente** |
| IVE con Base Comparativa Externa (≥10 casos) | **Pendiente** |
| RLD con estados de agencia visibles en UI | **Pendiente** |
| Función de Lyapunov como monitor de convergencia | **Pendiente** |
| Investigación #8 IVE | **Inválido** — pendiente de recálculo con metodología correcta |

---

## Protocolo de Investigación

Cada investigación sigue un protocolo de 9 secciones obligatorias:

1. **Espacio del Sistema** — variables de estado y parámetros del dominio
2. **Tabla Maestra de Datos** — fuentes, tipo de dato, valores con preprocesamiento
3. **Cálculo IRM** — scores por supuesto, ponderación, valor resultante
4. **Cálculo IVE** — casos de referencia, normalización, valor resultante
5. **Dinámica RLD** — estado inicial, ciclos, condición de agencia
6. **Supuestos Declarados** — clasificados por verificabilidad (S1...Sn)
7. **Brechas de Información** — datos ausentes que limitan el análisis
8. **Conclusiones** — con límites explícitos del análisis
9. **Líneas de Acción** — condicionadas al umbral IRM + IVE

---

## Limitaciones Declaradas

El Observatorio opera exclusivamente con fuentes públicas disponibles a la fecha de cada investigación. No tiene acceso a datos de campo, no realiza monitoreo continuo y no puede verificar supuestos que dependen de documentos no publicados (como MIAs en trámite ante SEMARNAT).

Toda investigación declara explícitamente sus brechas de información. Un IRM bajo no es un error del sistema — es el sistema funcionando correctamente al reflejar la calidad real de la evidencia disponible.

---

## Autor

**Ever** — Ingeniero de Arquitecturas Cognitivas  
Arquitectura CAELION: diseño propio, formalización en colaboración con Manus AI  
Municipio de análisis: Choix, Sinaloa, México

---

## Licencia

Este repositorio es público con fines de transparencia metodológica. Los datos utilizados provienen de fuentes gubernamentales de acceso público (DOF, INEGI, CONAGUA, SEMARNAT). La arquitectura CAELION es propiedad intelectual del autor.
