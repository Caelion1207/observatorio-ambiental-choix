# Observatorio Ambiental de Choix

Laboratorio Público de Análisis Estructural  
Choix, Sinaloa, México

---

## ¿Qué es esto?

Un sistema para evaluar si un sistema público puede sostenerse… o si está condenado a fallar.

No predice.  
No simula.  
No inventa datos.

Organiza evidencia pública, declara lo que no se sabe, y calcula la viabilidad estructural de un sistema.

---

## El problema

Los municipios toman decisiones con:

- datos incompletos  
- supuestos implícitos  
- estudios no auditables  

El resultado no es incertidumbre.  
Es ilusión de certeza.

---

## La pregunta

¿Puede un sistema público mantenerse funcional bajo su propia demanda?

---

## Qué hace el Observatorio

- organiza datos públicos dispersos  
- separa evidencia de estimaciones  
- declara supuestos explícitamente  
- calcula índices estructurales (IRM, IVE, RLD)  

---

## Qué NO hace

- no genera datos empíricos  
- no monitorea en tiempo real  
- no sustituye decisiones políticas  

---

## Idea central

Si la evidencia es débil, el sistema no es confiable.  
Si el margen es bajo, el sistema es frágil.

El Observatorio no corrige eso.

Lo hace visible.



## Ejemplo simple

**Sistema hídrico de Choix**

- Capacidad: 10 Mm³  
- Demanda: 8.2 Mm³  

**Cálculo:**

IVE = (10 - 8.2) / 10 = 0.18  

**Interpretación:**

- 82 % de uso  
- 18 % de margen  
- Alta fragilidad ante incrementos


## Clasificación de datos

| Tipo                | Descripción                         | Fuente típica              |
|---------------------|-------------------------------------|----------------------------|
| Observado           | Datos oficiales                     | INEGI, CONAGUA             |
| Estimado municipal  | Derivado estadístico                | ENIGH                      |
| Supuesto declarado  | No verificado (Sn)                  | Declarado explícitamente   |



## Arquitectura conceptual

Datos → IRM → IVE → RLD → CAELION

| Índice | Función | Pregunta |
|--------|--------|----------|
| IRM | Calidad de evidencia | ¿Qué tan confiables son los datos? |
| IVE | Viabilidad estructural | ¿Qué margen tiene el sistema? |
| RLD | Legitimidad dinámica | ¿Puede sostener decisiones? |



## Separación de roles

| Operador | Función | Pregunta |
|----------|--------|----------|
| CAELION | Análisis estructural | ¿Cómo está organizado el sistema? |
| IRM | Filtro epistemológico | ¿Qué tan sólida es la evidencia? |
| IVE | Reconocimiento de patrones | ¿Qué trayectoria sigue? |
| LIANG | Decisión estratégica | ¿Qué se hace con esto? |


## Núcleo matemático — CAELION v3.3

Dinámica del sistema:

x(k+1) = F(x(k), u(k)) + ξ(k)

Error respecto a referencia:

e(k) = x(k) - x_ref

Función de estabilidad (Lyapunov):

V(x) = eᵀ P e

Índices estructurales:

IRM(k) ∈ [0,1]  
IVE(k) = IRM(k) · Σ(w_j · N_j(k))  
RLD(k+1) = f(RLD, IVE, IRM, Ω)

Nota: La función de Lyapunov forma parte del núcleo CAELION como sistema dinámico general. 
En el Observatorio se incluye como referencia formal, pero no se implementa directamente en el análisis actual.




Estado absorbente

Si:

IRM < 0.5

Entonces:
	•	no hay decisiones válidas
	•	RLD se degrada
	•	se requiere más evidencia



## Dominios de análisis

| Dominio              | Investigaciones |
|---------------------|-----------------|
| Sistema hídrico     | 2               |
| Cobertura forestal  | 1               |
| Suelo               | 1               |
| Biodiversidad       | 1               |
| Socioeconómico      | 1               |
| Gobernanza          | 1               |

**Total:** 8


## Protocolo de investigación

1. Espacio del sistema  
2. Datos  
3. IRM  
4. IVE  
5. RLD  
6. Supuestos  
7. Brechas  
8. Conclusión  
9. Acción  



Arquitectura técnica
	•	React 19
	•	Tailwind
	•	Express
	•	tRPC
	•	Drizzle ORM
	•	MySQL



## Estado del sistema

| Componente        | Estado        |
|------------------|--------------|
| Sistema web      | Activo        |
| Núcleo CAELION   | Cerrado       |
| IRM detallado    | Pendiente     |
| IVE comparativo  | Pendiente     |
| RLD visual       | Pendiente     |




## Limitaciones

- Sin datos de campo  
- Sin monitoreo en tiempo real  
- Dependencia de datos públicos  

**Nota:**  
Un IRM bajo no es error. Es diagnóstico.



Autor

Ever
Arquitectura CAELION (diseño propio)



Licencia

Datos públicos: INEGI, CONAGUA, DOF, SEMARNAT
Arquitectura CAELION: propiedad del autor