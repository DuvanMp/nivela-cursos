// Datos iniciales: catálogo de cursos, paquetes y contenido de las lecciones.
// Se usan en el modo demo y para generar supabase/seed.sql (npm run seed).
// En modo Supabase NO se cargan en el navegador: el contenido viene de la base
// de datos y solo lo reciben quienes compraron el curso.
import { inglesA1 } from './ingles-a1.js'
import { inglesM2 } from './ingles-m2.js'
import { inglesM3 } from './ingles-m3.js'
import { retoHombres, retoMujeres } from './reto-militar.js'
import { ventasWhatsApp } from './ventas-whatsapp.js'
import { iaDesdeCero } from './ia-desde-cero.js'
import { redesDigitales } from './redes-digitales.js'

export const outlineOf = (content) =>
  content.units.map((u) => ({ title: u.title, goal: u.goal, color: u.color, lessons: u.lessons.length }))

export const seedContent = {
  'ingles-a1': inglesA1,
  'ingles-m2': inglesM2,
  'ingles-m3': inglesM3,
  'reto-militar-hombres': retoHombres,
  'reto-militar-mujeres': retoMujeres,
  'ventas-whatsapp': ventasWhatsApp,
  'ia-desde-cero': iaDesdeCero,
  'redes-digitales': redesDigitales,
}

const base = [
  {
    slug: 'ingles-a1',
    title: 'Inglés para conversar · Módulo 1: Lo esencial',
    short: 'Empieza de cero: saluda, preséntate, habla de tu rutina y de tu familia. Nivel A1.',
    description: 'El nivel A1 completo para quien empieza de cero, en lecciones de 5 minutos con juegos: escuchas, eliges, armas frases y escribes, con explicaciones de gramática en español. Al terminar puedes presentarte, hablar de tu rutina, comprar, pedir indicaciones y contar qué hiciste el fin de semana.',
    level: 'Principiante', price: 59900, color: 'ultra', cover: 'Hello!', status: 'published', category: 'Inglés',
  },
  {
    slug: 'ingles-m2',
    title: 'Inglés para conversar · Módulo 2: El día a día',
    short: 'Conversaciones reales: restaurante, compras, teléfono, planes con amigos y el médico.',
    description: 'Practica las conversaciones que vas a tener de verdad: pedir en un restaurante, comprar y devolver, hablar por teléfono, hacer planes, explicar qué te duele y contar tu fin de semana. Cada lección trae un diálogo real y ejercicios para elegir qué responder.',
    level: 'Básico', price: 59900, color: 'mint', cover: 'How are you?', status: 'published', category: 'Inglés',
  },
  {
    slug: 'ingles-m3',
    title: 'Inglés para conversar · Módulo 3: Viajar y trabajar',
    short: 'Aeropuerto, hotel, transporte, entrevista de trabajo, oficina y atención al cliente.',
    description: 'El inglés que necesitas para viajar sin estrés y para trabajar: check-in y migración, hotel, taxi y metro, entrevistas de trabajo, reuniones, correos y atención al cliente. Diálogos reales y ejercicios en cada lección.',
    level: 'Básico a intermedio', price: 59900, color: 'mango', cover: "Let's go!", status: 'published', category: 'Inglés',
  },
  {
    slug: 'reto-militar-hombres',
    title: 'Reto Militar 21 días · Hombres',
    short: 'Entrena como en un campamento militar desde tu casa, con sillas, botellas y una mochila.',
    description: '21 misiones diarias de 20 a 35 minutos, en tres semanas que suben de intensidad: Recluta, Soldado y Comando. Usas lo que ya tienes en casa: una silla, botellas de agua, una mochila con libros y una toalla. Cada ejercicio trae ilustración, técnica y consejos de seguridad. Haces una prueba el día 1 y otra el día 21 para medir tu avance.',
    level: 'Todos los niveles', price: 49900, color: 'olive', cover: 'MISIÓN 21', status: 'published', category: 'Entrenamiento',
  },
  {
    slug: 'reto-militar-mujeres',
    title: 'Reto Militar 21 días · Mujeres',
    short: 'Entrena como en un campamento militar desde tu casa, con más trabajo de piernas y glúteos.',
    description: '21 misiones diarias de 20 a 35 minutos, en tres semanas que suben de intensidad: Recluta, Soldado y Comando. Empieza con flexiones con rodillas apoyadas y da más trabajo a piernas y glúteos. Usas una silla, botellas de agua, una mochila y una toalla. Cada ejercicio trae ilustración, técnica y consejos de seguridad.',
    level: 'Todos los niveles', price: 49900, color: 'sand', cover: 'MISIÓN 21', status: 'published', category: 'Entrenamiento',
  },
  {
    slug: 'ventas-whatsapp',
    title: 'Domina las ventas por WhatsApp',
    short: 'De «¿precio?» a «ya te pagué»: guiones, objeciones y cierre para cualquier negocio.',
    description: 'Configura WhatsApp Business, responde rápido, pregunta antes de ofrecer, maneja el «está caro» y el «lo voy a pensar», cierra sin presionar y haz seguimiento sin molestar. Incluye plantillas listas para copiar y conversaciones de ejemplo.',
    level: 'Todos los niveles', price: 69900, color: 'mint', cover: '¿Te lo separo?', status: 'published', category: 'Ventas',
  },
  {
    slug: 'ia-desde-cero',
    title: 'Inteligencia artificial desde cero',
    short: 'ChatGPT y Claude para escribir, vender, crear imágenes y editar videos.',
    description: 'Aprende a pedirle las cosas bien a la IA con la fórmula del buen prompt, y úsala para escribir, estudiar, organizarte, crear textos de venta, imágenes de producto, guiones y videos cortos. Incluye prompts listos para copiar.',
    level: 'Principiante', price: 79900, color: 'ink', cover: 'Prompt:', status: 'published', category: 'Tecnología',
  },
  {
    slug: 'redes-digitales',
    title: 'Vende productos digitales en redes',
    short: 'Crea tu negocio digital: cuenta que vende, contenido, pauta y programa de afiliados.',
    description: 'Desde elegir tu nicho y optimizar tu perfil hasta crear videos que retienen, armar tu calendario, lanzar tu primera campaña de pauta y medir resultados. Incluye cómo vender como afiliado de Nivela con honestidad.',
    level: 'Principiante', price: 89900, color: 'rose', cover: '+1 venta', status: 'published', category: 'Negocios',
  },
]

export const seedCourses = base.map((c, i) => ({
  currency: 'COP',
  compare_at_price: null,
  sort: i,
  outline: seedContent[c.slug] ? outlineOf(seedContent[c.slug]) : [],
  ...c,
}))

// Paquetes: el precio "antes" es la suma real de los cursos por separado
const bundleBase = [
  {
    slug: 'ingles-completo',
    title: 'Inglés para conversar · Los 3 módulos',
    short: 'Del primer «hello» a conversar en el trabajo y de viaje. Ahorra comprando el paquete.',
    price: 119900, color: 'ultra', cover: '3 en 1',
    courses: ['ingles-a1', 'ingles-m2', 'ingles-m3'],
  },
  {
    slug: 'kit-emprendedor',
    title: 'Kit emprendedor digital',
    short: 'Ventas por WhatsApp + Inteligencia artificial + Vende en redes. Todo para arrancar tu negocio.',
    price: 169900, color: 'ink', cover: 'Kit x3',
    courses: ['ventas-whatsapp', 'ia-desde-cero', 'redes-digitales'],
  },
]

export const seedBundles = bundleBase.map((b, i) => ({
  currency: 'COP',
  status: 'published',
  sort: i,
  ...b,
}))
