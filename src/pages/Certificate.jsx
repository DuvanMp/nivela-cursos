import { Link, Navigate, useParams } from 'react-router-dom'
import { useCourse } from '../lib/useCourse.js'
import { useAuth } from '../lib/auth.jsx'
import { allLessons } from '../lib/courseUtils.js'
import { Logo } from '../components/Header.jsx'

// Certificado de finalización del curso (se puede imprimir o guardar como PDF)
export default function Certificate() {
  const { slug } = useParams()
  const { user } = useAuth()
  const { course, content, progress, status } = useCourse(slug)

  if (status === 'no-course') return <Navigate to="/" replace />
  if (status === 'no-access') return <Navigate to={`/curso/${slug}`} replace />
  if (status === 'no-content') return <Navigate to="/" replace />
  if (status !== 'ready') return <p className="loading">Cargando…</p>

  // Con examen: aprobarlo. Sin examen: completar todas las lecciones.
  const lessons = allLessons(content)
  const exam = lessons.find((l) => l.exam)
  const lastDone = lessons.map((l) => progress.completed[l.id]?.at).filter(Boolean).sort().pop()
  const passed = exam ? progress.completed[exam.id] : lessons.every((l) => progress.completed[l.id]) && { at: lastDone }
  if (!passed) {
    return (
      <main className="wrap empty">
        <h1>Aún no tienes el certificado</h1>
        <p>{exam ? 'Aprueba el examen final del curso para obtenerlo.' : 'Completa todas las lecciones del curso para obtenerlo.'}</p>
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
        <p className="cert-text">completó <strong>{course.title}</strong>{content.certNote ? `, ${content.certNote}` : ''}{exam ? ', y aprobó su examen final' : ''}.</p>
        <dl className="cert-meta">
          <div><dt>Fecha</dt><dd>{date}</dd></div>
          <div><dt>Puntos obtenidos</dt><dd>{progress.xp} XP</dd></div>
        </dl>
        <p className="cert-note">Certificado de finalización emitido por Nivela. No es un título ni una certificación oficial.</p>
      </article>
      <div className="cert-actions">
        <button className="btn btn-mango" onClick={() => window.print()}>Imprimir o guardar como PDF</button>
        <Link to={`/aprender/${slug}`} className="btn btn-ghost-dark">Volver al curso</Link>
      </div>
    </main>
  )
}
