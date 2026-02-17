import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  investigaciones,
  InsertInvestigacion,
  datosAbiertos,
  InsertDatoAbierto,
  fuentesOficiales,
  InsertFuenteOficial,
  participaciones,
  InsertParticipacion,
  visualizaciones,
  InsertVisualizacion
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Investigaciones
export async function getInvestigacionesPublicadas() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(investigaciones)
    .where(eq(investigaciones.publicada, true))
    .orderBy(desc(investigaciones.publishedAt));
}

export async function getInvestigacionBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(investigaciones)
    .where(eq(investigaciones.slug, slug))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createInvestigacion(data: InsertInvestigacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(investigaciones).values(data);
  return result;
}

export async function updateInvestigacion(id: number, data: Partial<InsertInvestigacion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(investigaciones).set(data).where(eq(investigaciones.id, id));
}

export async function publishInvestigacion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(investigaciones).set({
    publicada: true,
    publishedAt: new Date()
  }).where(eq(investigaciones.id, id));
}

// Datos Abiertos
export async function getDatosAbiertos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(datosAbiertos).orderBy(desc(datosAbiertos.createdAt));
}

export async function getDatosAbiertosByInvestigacion(investigacionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(datosAbiertos)
    .where(eq(datosAbiertos.investigacionId, investigacionId))
    .orderBy(desc(datosAbiertos.createdAt));
}

export async function createDatoAbierto(data: InsertDatoAbierto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(datosAbiertos).values(data);
  return result;
}

// Fuentes Oficiales
export async function getFuentesOficiales() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(fuentesOficiales).orderBy(fuentesOficiales.nombre);
}

export async function createFuenteOficial(data: InsertFuenteOficial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(fuentesOficiales).values(data);
  return result;
}

// Participaciones Ciudadanas
export async function getParticipaciones() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(participaciones).orderBy(desc(participaciones.createdAt));
}

export async function createParticipacion(data: InsertParticipacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(participaciones).values(data);
  return result;
}

export async function updateParticipacion(id: number, data: Partial<InsertParticipacion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(participaciones).set(data).where(eq(participaciones.id, id));
}

// Visualizaciones
export async function getVisualizaciones() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(visualizaciones).orderBy(desc(visualizaciones.createdAt));
}

export async function getVisualizacionesByInvestigacion(investigacionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(visualizaciones)
    .where(eq(visualizaciones.investigacionId, investigacionId))
    .orderBy(desc(visualizaciones.createdAt));
}

export async function createVisualizacion(data: InsertVisualizacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(visualizaciones).values(data);
  return result;
}
