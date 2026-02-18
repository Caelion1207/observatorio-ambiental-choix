import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { agentRouter } from "./agentRouter";
import { validarIntegridad } from "./services/validacion";

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
    list: publicProcedure
      .input(z.object({ dominioId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.dominioId) {
          return await db.getInvestigacionesByDominio(input.dominioId);
        }
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
    
    getRelated: publicProcedure
      .input(z.object({ 
        dominioId: z.number(),
        currentSlug: z.string(),
        limit: z.number().optional().default(3)
      }))
      .query(async ({ input }) => {
        return await db.getInvestigacionesRelacionadas(
          input.dominioId, 
          input.currentSlug, 
          input.limit
        );
      }),
    
    exportPDF: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ input }) => {
        const investigacion = await db.getInvestigacionBySlug(input.slug);
        if (!investigacion) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Investigación no encontrada' });
        }
        
        // Obtener fuentes de la investigación desde tabla separada
        const fuentes = await db.getFuentesByInvestigacionId(investigacion.id);
        
        try {
          // Intentar generar PDF con Puppeteer
          const { generatePDFFromInvestigacion } = await import('./services/puppeteerPdfGenerator');
          const pdfBuffer = await generatePDFFromInvestigacion(investigacion as any, fuentes);
          
          // Convertir buffer a base64 para enviar al cliente
          const pdfBase64 = pdfBuffer.toString('base64');
          
          return {
            format: 'pdf' as const,
            pdfBase64,
            filename: `${investigacion.slug}.pdf`
          };
        } catch (pdfError: any) {
          // FALLBACK: Si falla PDF, generar HTML formateado
          console.error(`[Export] Fallo al generar PDF, usando fallback HTML:`, pdfError.message);
          
          const { generateInvestigacionHTML } = await import('./services/htmlGenerator');
          const html = generateInvestigacionHTML(investigacion as any, fuentes);
          
          // Convertir HTML a base64
          const htmlBase64 = Buffer.from(html, 'utf-8').toString('base64');
          
          return {
            format: 'html' as const,
            htmlBase64,
            filename: `${investigacion.slug}.html`,
            fallbackReason: pdfError.message
          };
        }
      }),
    
    exportJSON: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const investigacion = await db.getInvestigacionBySlug(input.slug);
        if (!investigacion) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Investigación no encontrada' });
        }
        
        const fuentes = await db.getFuentesByInvestigacionId(investigacion.id);
        const dominio = await db.getDominioById(investigacion.dominioId);
        
        return {
          investigacion: {
            id: investigacion.id,
            titulo: investigacion.titulo,
            slug: investigacion.slug,
            dominio: dominio?.nombre || 'Sin dominio',
            resumenEjecutivo: investigacion.resumenEjecutivo,
            definicionSistema: investigacion.definicionSistema,
            tablaMaestra: investigacion.tablaMaestra,
            supuestos: investigacion.supuestos,
            modelo: investigacion.modelo,
            escenarios: investigacion.escenarios,
            brechas: investigacion.brechas,
            conclusion: investigacion.conclusion,
            indiceRobustez: investigacion.indiceRobustez,
            publishedAt: investigacion.publishedAt,
          },
          fuentes: fuentes.map(f => ({
            tipo: f.tipo,
            titulo: f.titulo,
            autor: f.autor,
            institucion: f.institucion,
            url: f.url,
            fechaPublicacion: f.fechaPublicacion,
          })),
          metadata: {
            exportadoEn: new Date().toISOString(),
            version: '1.0',
            licencia: 'Datos Abiertos - Dominio Público',
          }
        };
      }),
    
    exportCSV: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const investigacion = await db.getInvestigacionBySlug(input.slug);
        if (!investigacion) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Investigación no encontrada' });
        }
        
        const fuentes = await db.getFuentesByInvestigacionId(investigacion.id);
        const dominio = await db.getDominioById(investigacion.dominioId);
        
        // Generar CSV simple: metadata de investigación + fuentes
        const csvLines: string[] = [];
        
        // Sección 1: Metadata de investigación
        csvLines.push('METADATA DE INVESTIGACIÓN');
        csvLines.push('Campo,Valor');
        csvLines.push(`Título,"${investigacion.titulo.replace(/"/g, '""')}"`);
        csvLines.push(`Dominio,"${dominio?.nombre || 'Sin dominio'}"`);
        csvLines.push(`Slug,${investigacion.slug}`);
        csvLines.push(`Índice de Robustez Metodológica,${investigacion.indiceRobustez}`);
        csvLines.push(`Fecha de Publicación,${investigacion.publishedAt?.toISOString() || 'No publicada'}`);
        csvLines.push('');
        
        // Sección 2: Fuentes primarias
        csvLines.push('FUENTES PRIMARIAS');
        csvLines.push('Tipo,Título,Autor,Institución,URL,Fecha Publicación');
        fuentes.forEach(f => {
          csvLines.push(
            `${f.tipo},"${(f.titulo || '').replace(/"/g, '""')}","${(f.autor || '').replace(/"/g, '""')}","${(f.institucion || '').replace(/"/g, '""')}",${f.url || ''},${f.fechaPublicacion?.toISOString() || ''}`
          );
        });
        csvLines.push('');
        
        // Sección 3: Metadata de exportación
        csvLines.push('METADATA DE EXPORTACIÓN');
        csvLines.push('Campo,Valor');
        csvLines.push(`Exportado en,${new Date().toISOString()}`);
        csvLines.push('Versión,1.0');
        csvLines.push('Licencia,Datos Abiertos - Dominio Público');
        
        return {
          csv: csvLines.join('\n'),
          filename: `${investigacion.slug}.csv`
        };
      }),
    
    validarIntegridad: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const investigacion = await db.getInvestigacionBySlug(input.slug);
        if (!investigacion) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Investigación no encontrada' });
        }
        
        // Obtener fuentes de la investigación desde tabla separada
        const fuentes = await db.getFuentesByInvestigacionId(investigacion.id);
        
        // Ejecutar validación ARESK/ARGOS mínimo viable
        const resultado = validarIntegridad(investigacion as any, fuentes);
        
        return resultado;
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

  dominios: router({
    list: publicProcedure.query(async () => {
      return await db.getDominios();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const dominio = await db.getDominioById(input.id);
        if (!dominio) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Dominio no encontrado' });
        }
        return dominio;
      }),
  }),
  
  fuentes: router({
    getByInvestigacionId: publicProcedure
      .input(z.object({ investigacionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFuentesByInvestigacionId(input.investigacionId);
      }),
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
