import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Exportación de Datos Abiertos', () => {
  it('debe exportar investigación en formato JSON con metadata completa', async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Usar slug de investigación real (#7 - Finanzas)
    const result = await caller.investigaciones.exportJSON({ 
      slug: 'analisis-estructural-presupuesto-municipal-choix-2020-2026' 
    });
    
    // Verificar estructura de respuesta
    expect(result).toHaveProperty('investigacion');
    expect(result).toHaveProperty('fuentes');
    expect(result).toHaveProperty('metadata');
    
    // Verificar campos de investigación
    expect(result.investigacion).toHaveProperty('id');
    expect(result.investigacion).toHaveProperty('titulo');
    expect(result.investigacion).toHaveProperty('slug');
    expect(result.investigacion).toHaveProperty('dominio');
    expect(result.investigacion).toHaveProperty('resumenEjecutivo');
    expect(result.investigacion).toHaveProperty('definicionSistema');
    expect(result.investigacion).toHaveProperty('tablaMaestra');
    expect(result.investigacion).toHaveProperty('supuestos');
    expect(result.investigacion).toHaveProperty('modelo');
    expect(result.investigacion).toHaveProperty('escenarios');
    expect(result.investigacion).toHaveProperty('brechas');
    expect(result.investigacion).toHaveProperty('conclusion');
    expect(result.investigacion).toHaveProperty('indiceRobustez');
    expect(result.investigacion).toHaveProperty('publishedAt');
    
    // Verificar que fuentes es un array
    expect(Array.isArray(result.fuentes)).toBe(true);
    
    // Verificar metadata de exportación
    expect(result.metadata).toHaveProperty('exportadoEn');
    expect(result.metadata).toHaveProperty('version');
    expect(result.metadata).toHaveProperty('licencia');
    expect(result.metadata.version).toBe('1.0');
    expect(result.metadata.licencia).toBe('Datos Abiertos - Dominio Público');
  });
  
  it('debe exportar investigación en formato CSV con secciones correctas', async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Usar slug de investigación real (#7 - Finanzas)
    const result = await caller.investigaciones.exportCSV({ 
      slug: 'analisis-estructural-presupuesto-municipal-choix-2020-2026' 
    });
    
    // Verificar estructura de respuesta
    expect(result).toHaveProperty('csv');
    expect(result).toHaveProperty('filename');
    expect(result.filename).toBe('analisis-estructural-presupuesto-municipal-choix-2020-2026.csv');
    
    // Verificar que CSV contiene las secciones esperadas
    expect(result.csv).toContain('METADATA DE INVESTIGACIÓN');
    expect(result.csv).toContain('FUENTES PRIMARIAS');
    expect(result.csv).toContain('METADATA DE EXPORTACIÓN');
    
    // Verificar que CSV contiene campos clave
    expect(result.csv).toContain('Título');
    expect(result.csv).toContain('Dominio');
    expect(result.csv).toContain('Índice de Robustez Metodológica');
    expect(result.csv).toContain('Fecha de Publicación');
    expect(result.csv).toContain('Licencia,Datos Abiertos - Dominio Público');
  });
  
  it('debe lanzar error NOT_FOUND para slug inexistente en exportJSON', async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.investigaciones.exportJSON({ slug: 'investigacion-inexistente' })
    ).rejects.toThrow('Investigación no encontrada');
  });
  
  it('debe lanzar error NOT_FOUND para slug inexistente en exportCSV', async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.investigaciones.exportCSV({ slug: 'investigacion-inexistente' })
    ).rejects.toThrow('Investigación no encontrada');
  });
});
