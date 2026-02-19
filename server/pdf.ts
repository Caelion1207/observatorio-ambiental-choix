import { investigaciones } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";

/**
 * Genera un documento PDF profesional para una investigación específica
 * Formato limpio, no experimental, con todas las secciones del protocolo
 */
export async function generarPDFInvestigacion(slug: string): Promise<Buffer> {
  // Obtener investigación completa
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }
  
  const investigacion = await db
    .select()
    .from(investigaciones)
    .where(eq(investigaciones.slug, slug))
    .limit(1)
    .then((rows: any[]) => rows[0]);

  if (!investigacion) {
    throw new Error(`Investigación no encontrada: ${slug}`);
  }

  // Construir contenido Markdown del documento
  const markdown = `
# ${investigacion.titulo}

**Dominio:** ${investigacion.dominio}  
**Fecha de publicación:** ${new Date(investigacion.fechaPublicacion).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}  
**IVE (Índice de Viabilidad Estructural):** ${investigacion.ive}

---

## Resumen Ejecutivo

${investigacion.resumen}

---

## 1. Definición del Sistema

${investigacion.definicionSistema}

---

## 2. Tabla Maestra de Datos

${investigacion.tablaMaestra}

---

## 3. Supuestos Estructurales

${investigacion.supuestos}

---

## 4. Modelo Mínimo

${investigacion.modeloMinimo}

---

## 5. Escenarios

${investigacion.escenarios}

---

## 6. Brechas Detectadas

${investigacion.brechasDetectadas}

---

## 7. Conclusión Estructural

${investigacion.conclusion}

${investigacion.impactoComunitario ? `

---

## Impacto Comunitario

${investigacion.impactoComunitario}
` : ''}

${investigacion.lineasAccion ? `

---

## Posibles Líneas de Acción

${investigacion.lineasAccion}
` : ''}

---

## Fuentes Primarias

${investigacion.fuentesPrimarias}

---

**Documento generado por:** Observatorio Ambiental de Choix  
**Licencia:** Creative Commons BY 4.0 (reutilizable con atribución)  
**URL:** https://observatorio-choix.manus.space/investigaciones/${investigacion.slug}
`;

  // Convertir Markdown a PDF usando WeasyPrint
  // Nota: En producción, esto requiere WeasyPrint instalado en el servidor
  // Por ahora, retornamos el contenido Markdown como Buffer para testing
  return Buffer.from(markdown, 'utf-8');
}
