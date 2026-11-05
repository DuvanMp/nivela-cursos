import { Link } from 'react-router-dom'
import { useCatalog } from '../lib/catalog.jsx'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'

export default function MyCourses() {
  const { user, purchases } = useAuth()
  const { courses } = useCatalog()
  const mine = courses.filter((c) => purchases.includes(c.slug))
  return (
    <main className="wrap section">
      {new URLSearchParams(window.location.search).get('bienvenida') && <p className="welcome">Acceso activado. ¡Empecemos!</p>}
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
          <p>Todavía no tienes cursos. Mira el catálogo: hay inglés, entrenamiento, ventas, inteligencia artificial y negocios digitales.</p>
          <Link to="/#cursos" className="btn">Ver cursos</Link>
        </div>
      )}
    </main>
  )
}
