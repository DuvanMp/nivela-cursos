import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCourse } from '../lib/useCourse.js'
import { currentStreak, lessonState, percent } from '../lib/progress.js'
import { allLessons } from '../lib/courseUtils.js'

const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46] // forma de camino serpenteante

function Stars({ n }) {
  return (
    <span className="stars" aria-label={`${n} de 3 estrellas`}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
    </span>
  )
}

export default function CoursePath() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { course, content, progress, status, error } = useCourse(slug)

  if (status === 'no-course') return <Navigate to="/" replace />
  if (status === 'no-access') return <Navigate to={`/curso/${slug}`} replace />
  if (status === 'no-content') return <main className="wrap empty"><h1>Este curso todavía no tiene lecciones</h1><Link to="/" className="btn">Ver cursos</Link></main>
  if (status === 'error') return <main className="wrap empty"><h1>No pudimos cargar tu progreso</h1><p>{error}</p></main>
  if (status === 'loading') return <p className="loading">Cargando tu progreso…</p>

  const lessons = allLessons(content)
  const ids = lessons.map((l) => l.id)
  const pct = percent(ids, progress)
  const streak = currentStreak(progress)
  const next = lessons.find((l) => lessonState(ids, progress, l.id) === 'current')
  let idx = 0

  return (
    <main className="path-page">
      <div className="wrap path-head">
        <div>
          {params.get('bienvenida') && <p className="welcome">Acceso activado. ¡Empecemos!</p>}
          <h1>{course.title}</h1>
          <div className="progress-line" aria-label={`${pct} % completado`}><span style={{ width: `${pct}%` }} /></div>
          <p className="muted">{pct} % completado</p>
        </div>
        <dl className="stats">
          <div><dt>Racha</dt><dd>{streak} {streak === 1 ? 'día' : 'días'}</dd></div>
          <div><dt>Puntos</dt><dd>{progress.xp} XP</dd></div>
          {next && <button className="btn" onClick={() => navigate(`/aprender/${slug}/leccion/${next.id}`)}>Continuar</button>}
        </dl>
      </div>

      <div className="wrap path">
        {content.units.map((u, ui) => (
          <section key={u.id} className={`unit u-${u.color}`}>
            <header className="unit-banner">
              <span className="unit-n">Unidad {ui + 1}</span>
              <h2>{u.title}</h2>
              <p>{u.goal}</p>
            </header>
            <ol className="nodes">
              {u.lessons.map((l) => {
                const state = lessonState(ids, progress, l.id)
                const off = OFFSETS[idx++ % OFFSETS.length]
                const stars = progress.completed[l.id]?.stars || 0
                const label = `${l.title}${state === 'locked' ? ' (bloqueada)' : state === 'done' ? ' (completada)' : ''}`
                return (
                  <li key={l.id} style={{ '--off': `${off}px` }} className={`node-wrap ${state} ${l.exam ? 'is-exam' : l.review ? 'is-review' : ''}`}>
                    {state === 'locked' ? (
                      <span className="node" aria-label={label}><LockIcon /></span>
                    ) : (
                      <Link to={`/aprender/${slug}/leccion/${l.id}`} className="node" aria-label={label}>
                        {state === 'done' ? <CheckIcon /> : l.exam ? <TrophyIcon /> : l.review ? <ReviewIcon /> : l.workout ? <BoltIcon /> : l.kind === 'read' ? <BookIcon /> : <PlayIcon />}
                      </Link>
                    )}
                    <span className="node-title">{l.title}</span>
                    {state === 'done' && <Stars n={stars} />}
                    {state === 'current' && <span className="node-tip">Empieza aquí</span>}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
        {pct === 100 && (
          <div className="finish">
            <h2>¡Terminaste {course.title}!</h2>
            <p>Puedes repetir cualquier lección para subir tus estrellas.</p>
            <Link to={`/aprender/${slug}/certificado`} className="btn btn-mango">Ver mi certificado</Link>
          </div>
        )}
      </div>
    </main>
  )
}

const PlayIcon = () => <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
const ReviewIcon = () => <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
const TrophyIcon = () => <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 20h8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
const BookIcon = () => <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></svg>
const BoltIcon = () => <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" /></svg>
const LockIcon = () => <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
