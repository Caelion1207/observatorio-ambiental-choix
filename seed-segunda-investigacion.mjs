import { drizzle } from "drizzle-orm/mysql2";
import { investigaciones } from "./drizzle/schema.js";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

// Leer el contenido completo de la investigación
const contenidoCompleto = readFileSync("/home/ubuntu/segunda_investigacion_completa.md", "utf-8");

// Extraer secciones del documento
const extraerSeccion = (contenido, inicio, fin) => {
  const inicioIdx = contenido.indexOf(inicio);
  if (inicioIdx === -1) return "";
  
  const finIdx = fin ? contenido.indexOf(fin, inicioIdx + inicio.length) : contenido.length;
  if (finIdx === -1) return contenido.substring(inicioIdx);
  
  return contenido.substring(inicioIdx, finIdx).trim();
};

const resumenEjecutivo = contenidoCompleto.match(/## Resumen Ejecutivo\n\n([\s\S]*?)\n\n---/)?.[1] || "";
const definicionSistema = extraerSeccion(contenidoCompleto, "## 1. Definición del Sistema", "## 2. Tabla Maestra de Datos");
const tablaMaestra = extraerSeccion(contenidoCompleto, "## 2. Tabla Maestra de Datos", "## 3. Supuestos Explícitos");
const supuestosExplicitos = extraerSeccion(contenidoCompleto, "## 3. Supuestos Explícitos", "## 4. Modelo Mínimo");
const modeloMinimo = extraerSeccion(contenidoCompleto, "## 4. Modelo Mínimo", "## 5. Escenarios");
const escenarios = extraerSeccion(contenidoCompleto, "## 5. Escenarios", "## 6. Brechas Detectadas");
const brechasDetectadas = extraerSeccion(contenidoCompleto, "## 6. Brechas Detectadas", "## 7. Conclusión Estructural");
const conclusionEstructural = extraerSeccion(contenidoCompleto, "## 7. Conclusión Estructural", "## Fuentes Primarias");
const fuentesPrimarias = extraerSeccion(contenidoCompleto, "## Fuentes Primarias", null);

const segundaInvestigacion = {
  titulo: "Sistema Hídrico de Choix ante Demanda Incremental: Análisis Estructural de Resiliencia y Capacidad de Amortiguación",
  slug: "sistema-hidrico-choix-resiliencia-amortiguacion",
  resumenEjecutivo: resumenEjecutivo,
  
  // Sección 1: Definición del Sistema
  contexto: definicionSistema,
  
  // Sección 2: Tabla Maestra de Datos
  datosOficiales: tablaMaestra,
  
  // Sección 3: Supuestos Explícitos
  metodologia: supuestosExplicitos,
  
  // Sección 4: Modelo Mínimo
  analisisTecnico: modeloMinimo,
  
  // Sección 5: Escenarios
  proyeccion: escenarios,
  
  // Sección 6: Brechas Detectadas
  escenariosAlternativos: brechasDetectadas,
  
  // Sección 7: Conclusión Estructural
  limitaciones: conclusionEstructural.substring(0, conclusionEstructural.length / 2),
  conclusiones: conclusionEstructural.substring(conclusionEstructural.length / 2),
  
  fuentes: fuentesPrimarias,
  
  publicada: true,
  autorId: 1,
};

try {
  await db.insert(investigaciones).values(segundaInvestigacion);
  console.log("✅ Segunda investigación insertada exitosamente");
} catch (error) {
  console.error("❌ Error al insertar segunda investigación:", error);
  process.exit(1);
}

process.exit(0);
