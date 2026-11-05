// Utilidades del catálogo. Los cursos y precios viven en la base de datos
// (o en src/data/seedData.js en el modo demo).

export const lessonCount = (c) => (c?.outline || []).reduce((n, u) => n + (u.lessons || 0), 0)

export const isAvailable = (c) => c?.status === 'published'

export const pesos = (n, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

export const STATUS_LABEL = { published: 'Publicado', coming_soon: 'Próximamente', draft: 'Borrador' }
export const COLORS = ['ultra', 'mint', 'mango', 'rose', 'ink', 'sky', 'olive', 'sand']
