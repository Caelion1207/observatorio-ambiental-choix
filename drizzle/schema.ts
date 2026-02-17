import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * ARQUITECTURA ESCALABLE 2.0
 * Sistema de dominios ilimitados con investigaciones autónomas
 */

// ============================================================================
// USUARIOS Y AUTENTICACIÓN
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// DOMINIOS (ESCALABLE A N DOMINIOS)
// ============================================================================

/**
 * Tabla de dominios del observatorio.
 * Permite agregar dominios ilimitados sin modificar el core.
 * Cada dominio define sus propias variables, índices y escenarios base.
 */
export const dominios = mysqlTable("dominios", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(), // "Hidrología", "Finanzas Públicas", etc.
  slug: varchar("slug", { length: 255 }).notNull().unique(), // "hidrologia", "finanzas", etc.
  descripcion: text("descripcion").notNull(),
  icono: varchar("icono", { length: 50 }), // Nombre del ícono lucide-react
  color: varchar("color", { length: 50 }), // Color hex o clase Tailwind
  
  // Configuración del dominio (JSON)
  variablesTemplate: text("variablesTemplate"), // JSON: [{nombre, unidad, tipo, rango}]
  indicesConfig: text("indicesConfig"), // JSON: [{nombre, formula, descripcion, umbral}]
  escenariosBase: text("escenariosBase"), // JSON: [{nombre, descripcion, parametros}]
  
  // Configuración de imágenes satelitales (opcional)
  requiereSatelital: boolean("requiereSatelital").default(false).notNull(),
  tipoIndice: varchar("tipoIndice", { length: 50 }), // "NDWI", "NDVI", null
  
  activo: boolean("activo").default(true).notNull(),
  orden: int("orden").default(0).notNull(), // Para ordenar en UI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dominio = typeof dominios.$inferSelect;
export type InsertDominio = typeof dominios.$inferInsert;

// ============================================================================
// INVESTIGACIONES (AUTÓNOMAS)
// ============================================================================

/**
 * Investigaciones técnicas publicadas en el observatorio.
 * Cada investigación es autónoma y referencia un dominio dinámicamente.
 * Protocolo de 7 secciones obligatorias mantenido.
 */
export const investigaciones = mysqlTable("investigaciones", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(),
  dominioId: int("dominioId").notNull(), // Referencia a tabla dominios
  titulo: varchar("titulo", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  resumenEjecutivo: text("resumenEjecutivo").notNull(),
  
  // Protocolo de 7 secciones
  definicionSistema: text("definicionSistema").notNull(),
  tablaMaestra: text("tablaMaestra").notNull(),
  supuestos: text("supuestos").notNull(),
  modelo: text("modelo").notNull(),
  escenarios: text("escenarios").notNull(),
  brechas: text("brechas").notNull(),
  conclusion: text("conclusion").notNull(),
  
  // Metadata de la investigación (JSON)
  metadataJson: text("metadataJson"), // {ubicacion, periodo, alcance, etc.}
  
  // Configuración de escenarios e índices específicos de esta investigación
  escenariosConfig: text("escenariosConfig"), // JSON: escenarios personalizados
  indicesCalculados: text("indicesCalculados"), // JSON: resultados de índices
  
  // Imágenes satelitales (opcional, JSON)
  imagenesSatelitales: text("imagenesSatelitales"), // JSON: {raw, procesadas, comparativas, metadatos}
  
  // Blindaje metodológico
  versionProtocolo: varchar("versionProtocolo", { length: 20 }).default("1.0").notNull(),
  fechaCierreSemantico: timestamp("fechaCierreSemantico"),
  supuestosEstructurados: text("supuestosEstructurados"), // JSON: [{supuesto, impacto, sensibilidad, verificado}]
  indiceRobustez: decimal("indiceRobustez", { precision: 3, scale: 2 }).default("0.00"),
  
  publicada: boolean("publicada").default(false).notNull(),
  autorId: int("autorId").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type Investigacion = typeof investigaciones.$inferSelect;
export type InsertInvestigacion = typeof investigaciones.$inferInsert;

// ============================================================================
// FUENTES (SEPARADAS POR INVESTIGACIÓN)
// ============================================================================

/**
 * Fuentes utilizadas en cada investigación.
 * Separación real: cada investigación tiene sus propias fuentes.
 * Clasificadas por tipo: oficiales, técnicas, académicas, periodísticas.
 */
export const fuentes = mysqlTable("fuentes", {
  id: int("id").autoincrement().primaryKey(),
  investigacionId: int("investigacionId").notNull(),
  tipo: mysqlEnum("tipo", ["oficial", "tecnica", "academica", "periodistica"]).notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  autor: varchar("autor", { length: 255 }),
  institucion: varchar("institucion", { length: 255 }),
  url: text("url"),
  fechaPublicacion: timestamp("fechaPublicacion"),
  fechaConsulta: timestamp("fechaConsulta").notNull(),
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Fuente = typeof fuentes.$inferSelect;
export type InsertFuente = typeof fuentes.$inferInsert;

// ============================================================================
// DATOS ABIERTOS (POR INVESTIGACIÓN)
// ============================================================================

/**
 * Datos abiertos descargables por investigación.
 * Formatos: CSV, JSON, GeoJSON, escenarios, índices.
 */
export const datosAbiertos = mysqlTable("datosAbiertos", {
  id: int("id").autoincrement().primaryKey(),
  investigacionId: int("investigacionId").notNull(),
  tipo: mysqlEnum("tipo", ["csv", "json", "geojson", "escenarios", "indices"]).notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  descripcion: text("descripcion").notNull(),
  archivoUrl: text("archivoUrl"), // URL de S3
  archivoKey: text("archivoKey"), // Key de S3
  formato: varchar("formato", { length: 50 }).notNull(), // "text/csv", "application/json", etc.
  tamano: int("tamano"), // Tamaño en bytes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DatoAbierto = typeof datosAbiertos.$inferSelect;
export type InsertDatoAbierto = typeof datosAbiertos.$inferInsert;

// ============================================================================
// PARTICIPACIONES CIUDADANAS
// ============================================================================

export const participaciones = mysqlTable("participaciones", {
  id: int("id").autoincrement().primaryKey(),
  categoria: mysqlEnum("categoria", [
    "correccion_datos",
    "nueva_fuente",
    "aclaracion_tecnica",
    "pregunta_metodologica"
  ]).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  asunto: varchar("asunto", { length: 500 }).notNull(),
  contenido: text("contenido").notNull(),
  investigacionId: int("investigacionId"),
  estado: mysqlEnum("estado", ["pendiente", "revisada", "respondida"]).default("pendiente").notNull(),
  respuesta: text("respuesta"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Participacion = typeof participaciones.$inferSelect;
export type InsertParticipacion = typeof participaciones.$inferInsert;

// ============================================================================
// VISUALIZACIONES
// ============================================================================

export const visualizaciones = mysqlTable("visualizaciones", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  tipo: mysqlEnum("tipo", ["grafica", "mapa", "serie_tiempo", "satelital"]).notNull(),
  descripcion: text("descripcion").notNull(),
  datosJson: text("datosJson").notNull(),
  investigacionId: int("investigacionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visualizacion = typeof visualizaciones.$inferSelect;
export type InsertVisualizacion = typeof visualizaciones.$inferInsert;
