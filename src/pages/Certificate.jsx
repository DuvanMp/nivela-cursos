import { Link, Navigate, useParams } from 'react-router-dom'
import { useCourse } from '../lib/useCourse.js'
import { useAuth } from '../lib/auth.jsx'
import { allLessons } from '../data/ingles-a1.js'
import { Logo } from '../components/Header.jsx'

// Certificado de finalización del curso (se puede imprimir o guardar como PDF)
export default function Certificate() {
  const { slug } = useParams()
  const { user } = useAuth()
  const { course, progress, status } = useCourse(slug)

  if (status === 'no-course') return <Navigate to="/" replace />
  if (status === 'no-access') return <Navigate to={`/curso/${slug}`} replace />
  if (status !== 'ready') return <p className="loading">Cargando…</p>

  const exam = allLessons(course.content).find((l) => l.exam)
  const passed = exam && progress.completed[exam.id]
  if (!passed) {
    return (
      <main className="wrap empty">
        <h1>Aún no tienes el certificado</h1>
        <p>Aprueba el examen final del curso para obtenerlo.</p>
        <Link to={`/aprender/${slug}`} className="btn">Volver al curso</Link>
      </main>
    )
  }
  const date = new Date(`${passed.at}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="wrap cert-page">
      <article className="cert">
        <Logo />
        <p className="cert-kicker">Certificado de finalización</p>
        <h1 className="cert-name">{user.name}</h1>
        <p className="cert-text">completó el curso <strong>{course.title}</strong>, con nivel de referencia A1 del Marco Común Europeo, y aprobó su examen final.</p>
        <dl className="cert-meta">
          <div><dt>Fecha</dt><dd>{date}</dd></div>
          <div><dt>Puntos obtenidos</dt><dd>{progress.xp} XP</dd></div>
        </dl>
        <p className="cert-note">Certificado emitido por Nivela. No es una certificación oficial de idioma.</p>
      </article>
      <div className="cert-actions">
        <button className="btn btn-mango" onClick={() => window.print()}>Imprimir o guardar como PDF</button>
        <Link to={`/aprender/${slug}`} className="btn btn-ghost-dark">Volver al curso</Link>
      </div>
    </main>
  )
}
