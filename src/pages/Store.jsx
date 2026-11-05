import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, lessonCount, pesos } from '../data/courses.js'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'
import { speak, sounds } from '../lib/media.js'

// Mini ejercicio real en la portada: así se ve una lección
function HeroDemo() {
  const options = ['Goodbye', 'Thank you', 'Please']
  const [pick, setPick] = useState(null)
  const right = pick === 'Thank you'
  const choose = (o) => {
    setPick(o)
    if (o === 'Thank you') { sounds.right(); speak('Thank you') } else sounds.wrong()
  }
  return (
    <div className="demo" aria-live="polite">
      <div className="demo-bar"><span style={{ width: pick ? '100%' : '35%' }} /></div>
      <p className="demo-q">¿Cómo se dice <strong>«gracias»</strong>?</p>
      <div className="options">
        {options.map((o) => (
          <button
            key={o}
            className={`opt ${pick === o ? (right ? 'is-right' : 'is-wrong') : ''}`}
            onClick={() => choose(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {pick && (
        <div className={`demo-feedback ${right ? 'ok' : 'ko'}`}>
          {right ? (
            <>
              <strong>¡Correcto! +10 XP</strong>
              <Link to="/curso/ingles-a1" className="btn btn-light btn-sm">Seguir con Inglés A1</Link>
            </>
          ) : (
            <>
              <strong>Casi. Era «Thank you».</strong>
              <button className="btn btn-light btn-sm" onClick={() => setPick(null)}>Intentar otra vez</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function CourseCard({ course }) {
  const { hasAccess } = useAuth()
  const owned = hasAccess(course.slug)
  const n = lessonCount(course)
  return (
    <li>
      <Link to={owned ? `/aprender/${course.slug}` : `/curso/${course.slug}`} className={`card ${course.available ? '' : 'soon'}`}>
        <CourseCover course={course} />
        <div className="card-body">
          <h3>{course.title}</h3>
          <p>{course.short}</p>
          <div className="card-meta">
            <span>{course.level}{n ? `, ${n} lecciones` : ''}</span>
            {owned ? <span className="tag tag-owned">Tuyo</span> : course.available ? <strong>{pesos(course.price)}</strong> : <span className="tag">Próximamente</span>}
          </div>
        </div>
      </Link>
    </li>
  )
}

export default function Store() {
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Aprende algo útil en 10 minutos al día</h1>
            <p className="lead">Cursos cortos en español. Avanzas por niveles, practicas con ejercicios y tu progreso queda guardado en tu cuenta.</p>
            <div className="actions">
              <Link to="/curso/ingles-a1" className="btn btn-mango">Empezar Inglés A1</Link>
              <a href="#cursos" className="btn btn-ghost">Ver todos los cursos</a>
            </div>
          </div>
          <HeroDemo />
        </div>
      </section>

      <section id="cursos" className="wrap section">
        <h2>Cursos</h2>
        <ul className="grid">
          {courses.map((c) => <CourseCard key={c.slug} course={c} />)}
        </ul>
      </section>

      <section className="wrap section how">
        <h2>Cómo funciona</h2>
        <ol className="steps">
          <li><strong>Elige un curso</strong><span>Mira qué vas a aprender y cuántas lecciones tiene.</span></li>
          <li><strong>Paga una sola vez</strong><span>Creas tu cuenta y tienes acceso al curso completo.</span></li>
          <li><strong>Avanza a tu ritmo</strong><span>Cada lección desbloquea la siguiente. Tu racha y tus puntos se guardan.</span></li>
        </ol>
      </section>
    </main>
  )
}
