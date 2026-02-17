import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

/**
 * Investigaciones técnicas publicadas en el observatorio.
 * Cada investigación sigue una estructura fija de 9 secciones obligatorias.
 */
export const investigaciones = mysqlTable("investigaciones", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(), // Número de investigación en la serie
  categoria: mysqlEnum("categoria", ["hidrologia", "medio_ambiente", "infraestructura", "salud", "educacion", "transporte"]).notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  resumenEjecutivo: text("resumenEjecutivo").notNull(),
  contexto: text("contexto").notNull(),
  datosOficiales: text("datosOficiales").notNull(),
  metodologia: text("metodologia").notNull(),
  analisisTecnico: text("analisisTecnico").notNull(),
  proyeccion: text("proyeccion").notNull(),
  escenariosAlternativos: text("escenariosAlternativos").notNull(),
  limitaciones: text("limitaciones").notNull(),
  conclusiones: text("conclusiones").notNull(),
  fuentes: text("fuentes").notNull(),
  publicada: boolean("publicada").default(false).notNull(),
  autorId: int("autorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type Investigacion = typeof investigaciones.$inferSelect;
export type InsertInvestigacion = typeof investigaciones.$inferInsert;

/**
 * Datos abiertos disponibles para descarga.
 * Incluye archivos CSV, enlaces a fuentes oficiales e imágenes satelitales.
 */
export const datosAbiertos = mysqlTable("datosAbiertos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  descripcion: text("descripcion").notNull(),
  tipo: mysqlEnum("tipo", ["csv", "enlace", "imagen_satelital"]).notNull(),
  archivoUrl: text("archivoUrl"),
  archivoKey: text("archivoKey"),
  enlaceExterno: text("enlaceExterno"),
  fuenteOficial: varchar("fuenteOficial", { length: 255 }).notNull(),
  fechaDatos: timestamp("fechaDatos"),
  investigacionId: int("investigacionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DatoAbierto = typeof datosAbiertos.$inferSelect;
export type InsertDatoAbierto = typeof datosAbiertos.$inferInsert;

/**
 * Fuentes oficiales utilizadas en el observatorio.
 * Catálogo de instituciones y sus datos disponibles.
 */
export const fuentesOficiales = mysqlTable("fuentesOficiales", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  siglas: varchar("siglas", { length: 50 }).notNull(),
  descripcion: text("descripcion").notNull(),
  sitioWeb: text("sitioWeb"),
  tiposDatos: text("tiposDatos").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FuenteOficial = typeof fuentesOficiales.$inferSelect;
export type InsertFuenteOficial = typeof fuentesOficiales.$inferInsert;

/**
 * Participaciones ciudadanas estructuradas.
 * Sin comentarios abiertos, solo formularios estructurados por categoría.
 */
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

/**
 * Visualizaciones de datos ambientales.
 * Datos estructurados para gráficas y mapas técnicos.
 */
export const visualizaciones = mysqlTable("visualizaciones", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  tipo: mysqlEnum("tipo", ["grafica_hidrologica", "mapa_forestal", "serie_tiempo"]).notNull(),
  descripcion: text("descripcion").notNull(),
  datosJson: text("datosJson").notNull(),
  fuenteOficial: varchar("fuenteOficial", { length: 255 }).notNull(),
  investigacionId: int("investigacionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visualizacion = typeof visualizaciones.$inferSelect;
export type InsertVisualizacion = typeof visualizaciones.$inferInsert;
