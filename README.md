# Sistema de Validacion Estructural
Laboratorio Publico de Analisis Estructural  
Choix, Sinaloa, Mexico  

---

## ¿Que es esto?

Un sistema para evaluar si un sistema publico puede sostenerse... o si esta condenado a fallar.

No predice.  
No simula.  
No inventa datos.  

Organiza evidencia publica, declara lo que no se sabe, y calcula la viabilidad estructural de un sistema.

---

## El problema

Los municipios toman decisiones con:

- datos incompletos  
- supuestos implicitos  
- estudios no auditables  

El resultado no es incertidumbre.  
Es ilusion de certeza.

---

## La pregunta

¿Puede un sistema publico mantenerse funcional bajo su propia demanda?

---

## Que hace el sistema

- organiza datos publicos dispersos  
- separa evidencia de estimaciones  
- declara supuestos explicitamente  
- calcula indices estructurales (IRM, IVE, RLD)  

---

## Que NO hace

- no genera datos empiricos  
- no monitorea en tiempo real  
- no sustituye decisiones politicas  

---

## Idea central

Si la evidencia es debil, el sistema no es confiable.  
Si el margen es bajo, el sistema es fragil.  

El sistema no corrige eso.  
Lo hace visible.

---

## Ejemplo simple

Sistema hidrico de Choix  

Capacidad: 10 Mm3  
Demanda: 8.2 Mm3  

IVE = (10 - 8.2) / 10 = 0.18  

Interpretacion:

- 82% de uso  
- 18% de margen  
- Alta fragilidad  

---

## Clasificacion de datos

**Observado**  
Datos oficiales  
INEGI, CONAGUA  

**Estimado municipal**  
Derivado estadistico  
ENIGH  

**Supuesto declarado**  
No verificado (Sn)  
Declarado explicitamente  

---

## Arquitectura conceptual

Datos -> IRM -> IVE -> RLD -> Sistema  

---

## Indices

**IRM**  
Funcion: Calidad de evidencia  
Pregunta: ¿Que tan confiables son los datos?  

**IVE**  
Funcion: Viabilidad estructural  
Pregunta: ¿Que margen tiene el sistema?  

**RLD**  
Funcion: Legitimidad dinamica  
Pregunta: ¿Puede sostener decisiones?  

---

## Separacion de roles

**Sistema estructural**  
Analisis del sistema  

**IRM**  
Filtro de calidad de evidencia  

**IVE**  
Evaluacion de viabilidad  

**LIANG**  
Decision estrategica  

---

## Estado del sistema

Sistema web: Activo  
Nucleo estructural: Estable  
IRM detallado: Pendiente  
IVE comparativo: Pendiente  
RLD visual: Pendiente  

---

## Arquitectura tecnica

React  
Express  
tRPC  
Drizzle ORM  
MySQL  

---

## Autor

Ever  
Arquitectura estructural propia  