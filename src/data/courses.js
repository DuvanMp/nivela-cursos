// Catálogo de la tienda. Solo "Inglés A1" tiene contenido por ahora;
// los demás son de ejemplo y aparecen como "Próximamente".
import { inglesA1 } from './ingles-a1.js'

export const courses = [
  {
    slug: 'ingles-a1',
    title: 'Inglés A1 desde cero',
    short: 'Saluda, preséntate, habla de tu familia y pide comida en inglés.',
    description: 'Un curso por niveles para quien empieza de cero. Cada lección dura unos 5 minutos: escuchas, eliges, armas frases y escribes. Al terminar puedes presentarte, hablar de tu familia y tu trabajo, decir números y colores, y pedir comida.',
    level: 'Principiante',
    price: 89900,
    color: 'ultra',
    cover: 'Hello!',
    available: true,
    content: inglesA1,
  },
  {
    slug: 'excel-trabajo',
    title: 'Excel para el trabajo',
    short: 'Fórmulas, tablas dinámicas y gráficos para tu día a día.',
    description: 'Aprende a organizar datos, usar las fórmulas que más se piden en las empresas y presentar informes claros.',
    level: 'Básico a intermedio',
    price: 69900,
    color: 'mint',
    cover: '=SUMA( )',
    available: false,
  },
  {
    slug: 'finanzas-personales',
    title: 'Finanzas personales',
    short: 'Arma tu presupuesto, sal de deudas y empieza a ahorrar.',
    description: 'Un método sencillo para saber en qué se va tu plata, organizar tus deudas y crear un fondo de emergencia.',
    level: 'Principiante',
    price: 59900,
    color: 'mango',
    cover: '$ + $',
    available: false,
  },
  {
    slug: 'fotografia-celular',
    title: 'Fotografía con el celular',
    short: 'Luz, encuadre y edición para fotos que se vean profesionales.',
    description: 'Saca más provecho de la cámara de tu celular: composición, luz natural, retratos y edición rápida.',
    level: 'Principiante',
    price: 49900,
    color: 'rose',
    cover: 'f/1.8',
    available: false,
  },
  {
    slug: 'programacion-web',
    title: 'Programación web desde cero',
    short: 'HTML, CSS y JavaScript hasta publicar tu primera página.',
    description: 'Construye y publica tu primera página web paso a paso, sin experiencia previa.',
    level: 'Principiante',
    price: 99900,
    color: 'ink',
    cover: '</>',
    available: false,
  },
  {
    slug: 'vender-redes',
    title: 'Vende por redes sociales',
    short: 'Instagram, WhatsApp Business y contenido que convierte.',
    description: 'Ordena tu perfil, crea contenido constante y convierte mensajes en ventas para tu negocio.',
    level: 'Básico',
    price: 69900,
    color: 'sky',
    cover: '+1 venta',
    available: false,
  },
]

export const courseBySlug = (slug) => courses.find((c) => c.slug === slug)

export const lessonCount = (c) => (c.content ? c.content.units.reduce((n, u) => n + u.lessons.length, 0) : 0)

export const pesos = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
