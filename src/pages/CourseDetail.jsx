import { Link, useNavigate, useParams } from 'react-router-dom'
import { courseBySlug, lessonCount, pesos } from '../data/courses.js'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'

export default function CourseDetail() {
  const { slug } = useParams()
  const course = courseBySlug(slug)
  const { user, hasAccess } = useAuth()
  const navigate = useNavigate()

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
          {course.content ? (
            <>
              <h2>Qué vas a aprender</h2>
              <ol className="units">
                {course.content.units.map((u) => (
                  <li key={u.id} className={`unit-row u-${u.color}`}>
                    <div>
                      <h3>{u.title}</h3>
                      <p>{u.goal}</p>
                    </div>
                    <span>{u.lessons.length} lecciones</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <h2>Este curso está en preparación</h2>
              <p>Mientras tanto puedes empezar con Inglés A1, que ya está completo.</p>
              <Link to="/curso/ingles-a1" className="btn btn-ghost-dark">Ver Inglés A1</Link>
            </>
          )}
        </section>

        <aside className="buy">
          <span className="price">{pesos(course.price)}</span>
          <p>Pago único. Acceso al curso completo{course.content ? `: ${lessonCount(course)} lecciones` : ''}.</p>
          {owned ? (
            <Link to={`/aprender/${course.slug}`} className="btn btn-block">Ir al curso</Link>
          ) : course.available ? (
            <button className="btn btn-block" onClick={buy}>Comprar acceso</button>
          ) : (
            <button className="btn btn-block" disabled>Próximamente</button>
          )}
          <ul className="perks">
            <li>Lecciones de 5 minutos</li>
            <li>Ejercicios con audio</li>
            <li>Progreso guardado en tu cuenta</li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
