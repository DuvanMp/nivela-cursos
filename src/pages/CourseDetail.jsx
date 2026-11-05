import { Link, useNavigate, useParams } from 'react-router-dom'
import { isAvailable, lessonCount, pesos } from '../data/courses.js'
import { useCatalog } from '../lib/catalog.jsx'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'
import { Price } from './Store.jsx'

const PERKS = {
  Inglés: ['Lecciones de 5 minutos con juegos', 'Audio en cada palabra y frase', 'Explicaciones en español', 'Certificado al aprobar el examen'],
  Entrenamiento: ['21 misiones de 20 a 35 minutos', 'Ilustración y técnica de cada ejercicio', 'Solo con objetos de la casa', 'Certificado al completar el reto'],
}
const DEFAULT_PERKS = ['Lecciones cortas con mini pruebas', 'Plantillas y ejemplos listos para usar', 'Progreso guardado en tu cuenta', 'Certificado al terminar']

export default function CourseDetail() {
  const { slug } = useParams()
  const { bySlug, loading, discount, isBestseller, students, bundlesFor, bundleInfo } = useCatalog()
  const course = bySlug(slug)
  const { user, hasAccess } = useAuth()
  const navigate = useNavigate()

  if (loading) return <p className="loading">Cargando…</p>
  if (!course) return <main className="wrap empty"><h1>No encontramos ese curso</h1><Link to="/" className="btn">Ver cursos</Link></main>

  const owned = hasAccess(course.slug)
  const buy = () => {
    const to = `/pagar/${course.slug}`
    navigate(user ? to : `/entrar?next=${encodeURIComponent(to)}`)
  }

  return (
    <main>
      <section className={`detail-hero bg-${course.color}`}>
        <div className="wrap detail-grid">
          <div>
            <Link to="/" className="back">Todos los cursos</Link>
            <h1>{course.title}</h1>
            <p className="lead">{course.description}</p>
          </div>
          <CourseCover course={course} size="lg" />
        </div>
      </section>

      <div className="wrap detail-body">
        <section>
          {course.outline?.length ? (
            <>
              <h2>Qué vas a aprender</h2>
              <ol className="units">
                {course.outline.map((u) => (
                  <li key={u.title} className={`unit-row u-${u.color}`}>
                    <div>
                      <h3>{u.title}</h3>
                      <p>{u.goal}</p>
                    </div>
                    <span>{u.lessons} {u.lessons === 1 ? 'lección' : 'lecciones'}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <h2>Este curso está en preparación</h2>
              <p>Mientras tanto puedes ver los cursos que ya están disponibles.</p>
              <Link to="/#cursos" className="btn btn-ghost-dark">Ver cursos</Link>
            </>
          )}
        </section>

        <aside className="buy">
          <div className="badges static">
            {isBestseller(course.slug) && <span className="badge b-best">Más vendido</span>}
            {course.badge === 'nuevo' && <span className="badge b-new">Nuevo</span>}
            {course.badge === 'recomendado' && <span className="badge b-rec">Recomendado</span>}
            {discount(course) > 0 && <span className="off static">-{discount(course)}%</span>}
          </div>
          <Price price={course.price} compare={course.compare_at_price} currency={course.currency} big />
          <p>Pago único, sin mensualidades. Acceso inmediato al curso completo{lessonCount(course) ? `: ${lessonCount(course)} lecciones` : ''}.</p>
          {students(course.slug) > 0 && <p className="muted">{students(course.slug).toLocaleString('es-CO')} estudiantes</p>}
          {owned ? (
            <Link to={`/aprender/${course.slug}`} className="btn btn-block">Ir al curso</Link>
          ) : isAvailable(course) ? (
            <button className="btn btn-block" onClick={buy}>Comprar acceso</button>
          ) : (
            <button className="btn btn-block" disabled>Próximamente</button>
          )}
          <ul className="perks">
            {(PERKS[course.category] || DEFAULT_PERKS).map((p) => <li key={p}>{p}</li>)}
          </ul>
          {!owned && bundlesFor(course.slug).map((b) => {
            const info = bundleInfo(b)
            return (
              <Link key={b.slug} to={`/paquete/${b.slug}`} className="upsell">
                <strong>Ahorra {pesos(info.saving, b.currency)} con el paquete</strong>
                <span>{b.title}: {info.items.length} cursos por {pesos(b.price, b.currency)}</span>
              </Link>
            )
          })}
        </aside>
      </div>
    </main>
  )
}
