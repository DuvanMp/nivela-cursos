import { Link } from 'react-router-dom'
import { courses } from '../data/courses.js'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'

export default function MyCourses() {
  const { user, purchases } = useAuth()
  const mine = courses.filter((c) => purchases.includes(c.slug))
  return (
    <main className="wrap section">
      <h1>Hola, {user.name}</h1>
      {mine.length ? (
        <ul className="grid">
          {mine.map((c) => (
            <li key={c.slug}>
              <Link to={`/aprender/${c.slug}`} className="card">
                <CourseCover course={c} />
                <div className="card-body">
                  <h3>{c.title}</h3>
                  <span className="go">Continuar</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-box">
          <p>Todavía no tienes cursos. Empieza con Inglés A1: lecciones cortas de 5 minutos.</p>
          <Link to="/curso/ingles-a1" className="btn">Ver Inglés A1</Link>
        </div>
      )}
    </main>
  )
}
