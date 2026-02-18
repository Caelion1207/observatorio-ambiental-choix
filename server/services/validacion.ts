/**
 * ARESK/ARGOS Mínimo Viable
 * Validación de integridad de investigaciones
 * 
 * Funciones:
 * 1. Validación de variables null
 * 2. Detección de supuestos sin fuente
 * 3. Índice de completitud del modelo
 * 4. Conteo de palabras "estimado"
 */

interface Investigacion {
  id: number;
  titulo: string;
  resumenEjecutivo: string;
  definicionSistema: string;
  tablaMaestra: string;
  supuestos: string;
  modelo: string;
  escenarios: string;
  brechas: string;
  conclusion: string;
  supuestosEstructurados: string | null;
  indiceRobustez: string | null;
}

interface Fuente {
  id: number;
  investigacionId: number;
  autor: string | null;
  institucion: string | null;
  titulo: string;
  tipo: string;
  url: string | null;
  fechaPublicacion: Date | null;
  fechaConsulta: Date | null;
}

interface ResultadoValidacion {
  investigacionId: number;
  titulo: string;
  puntajeIntegridad: number; // 0-100
  alertas: Alerta[];
  indiceCompletitud: number; // 0-1
  conteoEstimado: number;
  supuestosSinFuente: number;
  camposNull: string[];
}

interface Alerta {
  tipo: 'critico' | 'advertencia' | 'info';
  categoria: string;
  mensaje: string;
  sugerencia: string;
}

/**
 * Valida la integridad de una investigación
 */
export function validarIntegridad(
  investigacion: Investigacion,
  fuentes: Fuente[]
): ResultadoValidacion {
  const alertas: Alerta[] = [];
  let puntaje = 100;

  // 1. Validación de variables null
  const camposNull: string[] = [];
  const camposOpcionales = ['supuestosEstructurados', 'indiceRobustez'];
  const camposObligatorios = [
    'resumenEjecutivo',
    'definicionSistema',
    'tablaMaestra',
    'supuestos',
    'modelo',
    'escenarios',
    'brechas',
    'conclusion'
  ];

  for (const campo of camposObligatorios) {
    if (!investigacion[campo as keyof Investigacion] || investigacion[campo as keyof Investigacion] === '') {
      camposNull.push(campo);
      alertas.push({
        tipo: 'critico',
        categoria: 'Campo Vacío',
        mensaje: `El campo obligatorio "${campo}" está vacío`,
        sugerencia: `Completar el campo "${campo}" con contenido estructurado`
      });
      puntaje -= 15;
    }
  }

  // 2. Detección de supuestos sin fuente
  const supuestosSinFuente = contarSupuestosSinFuente(investigacion, fuentes);
  if (supuestosSinFuente > 0) {
    alertas.push({
      tipo: 'advertencia',
      categoria: 'Supuestos Sin Fuente',
      mensaje: `${supuestosSinFuente} supuestos no tienen fuente verificable`,
      sugerencia: 'Agregar fuentes primarias que respalden los supuestos críticos'
    });
    puntaje -= supuestosSinFuente * 5;
  }

  // 3. Índice de completitud del modelo
  const indiceCompletitud = calcularIndiceCompletitud(investigacion);
  if (indiceCompletitud < 0.7) {
    alertas.push({
      tipo: 'advertencia',
      categoria: 'Completitud Baja',
      mensaje: `Índice de completitud: ${(indiceCompletitud * 100).toFixed(0)}% (mínimo recomendado: 70%)`,
      sugerencia: 'Expandir las secciones incompletas para alcanzar el estándar de calidad'
    });
    puntaje -= 10;
  }

  // 4. Conteo de palabras "estimado"
  const conteoEstimado = contarPalabrasEstimado(investigacion);
  if (conteoEstimado > 10) {
    alertas.push({
      tipo: 'advertencia',
      categoria: 'Exceso de Estimaciones',
      mensaje: `Se encontraron ${conteoEstimado} menciones de "estimado" o variantes`,
      sugerencia: 'Reemplazar estimaciones con datos verificables cuando sea posible'
    });
    puntaje -= Math.min(conteoEstimado, 15);
  }

  // 5. Validación de fuentes mínimas
  if (fuentes.length < 3) {
    alertas.push({
      tipo: 'critico',
      categoria: 'Fuentes Insuficientes',
      mensaje: `Solo ${fuentes.length} fuentes (mínimo recomendado: 3)`,
      sugerencia: 'Agregar fuentes primarias verificables para respaldar el análisis'
    });
    puntaje -= 20;
  }

  // Asegurar que el puntaje no sea negativo
  puntaje = Math.max(0, puntaje);

  return {
    investigacionId: investigacion.id,
    titulo: investigacion.titulo,
    puntajeIntegridad: puntaje,
    alertas,
    indiceCompletitud,
    conteoEstimado,
    supuestosSinFuente,
    camposNull
  };
}

/**
 * Cuenta supuestos que no tienen fuente verificable
 */
function contarSupuestosSinFuente(investigacion: Investigacion, fuentes: Fuente[]): number {
  if (!investigacion.supuestosEstructurados) return 0;

  try {
    const supuestos = JSON.parse(investigacion.supuestosEstructurados);
    if (!Array.isArray(supuestos)) return 0;

    // Contar supuestos críticos no verificados
    return supuestos.filter((s: any) => 
      s.sensibilidad === 'Crítico' && !s.verificado
    ).length;
  } catch {
    return 0;
  }
}

/**
 * Calcula el índice de completitud del modelo (0-1)
 */
function calcularIndiceCompletitud(investigacion: Investigacion): number {
  const secciones = [
    'definicionSistema',
    'tablaMaestra',
    'supuestos',
    'modelo',
    'escenarios',
    'brechas',
    'conclusion'
  ];

  let puntajeTotal = 0;
  const longitudMinima = 200; // caracteres mínimos por sección

  for (const seccion of secciones) {
    const contenido = investigacion[seccion as keyof Investigacion] as string;
    if (contenido && contenido.length >= longitudMinima) {
      puntajeTotal += 1;
    } else if (contenido && contenido.length > 0) {
      puntajeTotal += contenido.length / longitudMinima;
    }
  }

  return puntajeTotal / secciones.length;
}

/**
 * Cuenta menciones de "estimado" y variantes
 */
function contarPalabrasEstimado(investigacion: Investigacion): number {
  const contenidoCompleto = [
    investigacion.resumenEjecutivo,
    investigacion.definicionSistema,
    investigacion.tablaMaestra,
    investigacion.supuestos,
    investigacion.modelo,
    investigacion.escenarios,
    investigacion.brechas,
    investigacion.conclusion
  ].join(' ').toLowerCase();

  const patrones = [
    /estimad[oa]s?/g,
    /aproximad[oa]s?/g,
    /probablemente/g,
    /posiblemente/g,
    /se asume/g,
    /se presume/g
  ];

  let conteo = 0;
  for (const patron of patrones) {
    const matches = contenidoCompleto.match(patron);
    if (matches) {
      conteo += matches.length;
    }
  }

  return conteo;
}
