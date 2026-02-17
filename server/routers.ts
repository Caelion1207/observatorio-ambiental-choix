import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { agentRouter } from "./agentRouter";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo administradores pueden acceder' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  agent: agentRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  investigaciones: router({
    list: publicProcedure.query(async () => {
      return await db.getInvestigacionesPublicadas();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const investigacion = await db.getInvestigacionBySlug(input.slug);
        if (!investigacion) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Investigación no encontrada' });
        }
        return investigacion;
      }),
    
    // CONGELADO: Nuevas publicaciones deshabilitadas
    // create: adminProcedure
    //   .input(z.object({
    //     titulo: z.string(),
    //     slug: z.string(),
    //     resumenEjecutivo: z.string(),
    //     contexto: z.string(),
    //     datosOficiales: z.string(),
    //     metodologia: z.string(),
    //     analisisTecnico: z.string(),
    //     proyeccion: z.string(),
    //     escenariosAlternativos: z.string(),
    //     limitaciones: z.string(),
    //     conclusiones: z.string(),
    //     fuentes: z.string(),
    //     publicada: z.boolean().optional(),
    //   }))
    //   .mutation(async ({ input, ctx }) => {
    //     return await db.createInvestigacion({
    //       ...input,
    //       autorId: ctx.user.id,
    //     });
    //   }),
    
    publish: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.publishInvestigacion(input.id);
        return { success: true };
      }),
  }),

  datosAbiertos: router({
    list: publicProcedure.query(async () => {
      return await db.getDatosAbiertos();
    }),
    
    getByInvestigacion: publicProcedure
      .input(z.object({ investigacionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDatosAbiertosByInvestigacion(input.investigacionId);
      }),
    
    // CONGELADO: Nuevas publicaciones deshabilitadas
    // create: adminProcedure
    //   .input(z.object({
    //     titulo: z.string(),
    //     descripcion: z.string(),
    //     tipo: z.enum(["csv", "enlace", "imagen_satelital"]),
    //     archivoUrl: z.string().optional(),
    //     archivoKey: z.string().optional(),
    //     enlaceExterno: z.string().optional(),
    //     fuenteOficial: z.string(),
    //     fechaDatos: z.date().optional(),
    //     investigacionId: z.number().optional(),
    //   }))
    //   .mutation(async ({ input }) => {
    //     return await db.createDatoAbierto(input);
    //   }),
  }),

  fuentesOficiales: router({
    list: publicProcedure.query(async () => {
      return await db.getFuentesOficiales();
    }),
    
    // CONGELADO: Nuevas publicaciones deshabilitadas
    // create: adminProcedure
    //   .input(z.object({
    //     nombre: z.string(),
    //     siglas: z.string(),
    //     descripcion: z.string(),
    //     sitioWeb: z.string().optional(),
    //     tiposDatos: z.string(),
    //   }))
    //   .mutation(async ({ input }) => {
    //     return await db.createFuenteOficial(input);
    //   }),
  }),

  participaciones: router({
    list: adminProcedure.query(async () => {
      return await db.getParticipaciones();
    }),
    
    create: publicProcedure
      .input(z.object({
        categoria: z.enum(["correccion_datos", "nueva_fuente", "aclaracion_tecnica", "pregunta_metodologica"]),
        nombre: z.string(),
        email: z.string().email(),
        asunto: z.string(),
        contenido: z.string(),
        investigacionId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createParticipacion(input);
      }),
    
    updateEstado: adminProcedure
      .input(z.object({
        id: z.number(),
        estado: z.enum(["pendiente", "revisada", "respondida"]),
        respuesta: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateParticipacion(input.id, {
          estado: input.estado,
          respuesta: input.respuesta,
        });
        return { success: true };
      }),
  }),

  visualizaciones: router({
    list: publicProcedure.query(async () => {
      return await db.getVisualizaciones();
    }),
    
    getByInvestigacion: publicProcedure
      .input(z.object({ investigacionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVisualizacionesByInvestigacion(input.investigacionId);
      }),
    
    // CONGELADO: Nuevas publicaciones deshabilitadas
    // create: adminProcedure
    //   .input(z.object({
    //     titulo: z.string(),
    //     tipo: z.enum(["grafica_hidrologica", "mapa_forestal", "serie_tiempo"]),
    //     descripcion: z.string(),
    //     datosJson: z.string(),
    //     fuenteOficial: z.string(),
    //     investigacionId: z.number().optional(),
    //   }))
    //   .mutation(async ({ input }) => {
    //     return await db.createVisualizacion(input);
    //   }),
  }),
});

export type AppRouter = typeof appRouter;
