import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { backend } from './backend.js'
import { useAuth } from './auth.jsx'

// Catálogo (cursos, paquetes y estadísticas reales de venta) leído de la base de datos
const CatalogContext = createContext(null)

const BESTSELLER_MIN_SALES = 3 // "Más vendido" solo con ventas reales
const STUDENTS_MIN = 10 // el número de estudiantes se muestra desde 10

export function CatalogProvider({ children }) {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const [courses, bundles, stats] = await Promise.all([
        backend.listCourses(),
        backend.listBundles().catch(() => []),
        backend.courseStats().catch(() => []),
      ])
      setData({ courses, bundles, stats: Object.fromEntries(stats.map((s) => [s.course_slug, s])) })
      setError('')
    } catch (e) { setError(e.message); setData({ courses: [], bundles: [], stats: {} }) }
  }, [])

  // Se recarga al cambiar de usuario: un admin también ve los borradores
  useEffect(() => { reload() }, [reload, user?.id, user?.role])

  const courses = data?.courses || []
  const bundles = data?.bundles || []
  const stats = data?.stats || {}
  const bySlug = (slug) => courses.find((c) => c.slug === slug)

  const top = Object.values(stats).filter((s) => s.sales >= BESTSELLER_MIN_SALES && bySlug(s.course_slug)).sort((a, b) => b.sales - a.sales)[0]

  // Precio "antes" de un paquete = suma real de sus cursos por separado
  const bundleInfo = (b) => {
    const items = b.courses.map(bySlug).filter(Boolean)
    const separate = items.reduce((n, c) => n + c.price, 0)
    const saving = Math.max(0, separate - b.price)
    return { items, separate, saving, percent: separate ? Math.round((saving / separate) * 100) : 0 }
  }

  const value = {
    courses,
    bundles,
    loading: data === null,
    error,
    bySlug,
    bundleBySlug: (slug) => bundles.find((b) => b.slug === slug),
    bundlesFor: (slug) => bundles.filter((b) => b.status === 'published' && b.courses.includes(slug)),
    bundleInfo,
    isBestseller: (slug) => top?.course_slug === slug,
    students: (slug) => (stats[slug]?.students >= STUDENTS_MIN ? stats[slug].students : 0),
    discount: (c) => (c.compare_at_price > c.price ? Math.round((1 - c.price / c.compare_at_price) * 100) : 0),
    reload,
  }
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)
