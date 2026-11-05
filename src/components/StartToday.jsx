import { Link } from 'react-router-dom'
import { isAvailable, pesos } from '../data/courses.js'
import { fmtDay, fmtShort, startPlan } from '../lib/startToday.js'
import { useAuth } from '../lib/auth.jsx'
import CourseCover from './CourseCover.jsx'

// Bloque «Si empiezas hoy…» en la página del curso: fechas reales desde hoy
export function StartToday({ course, onStart }) {
  const { hasAccess } = useAuth()
  const plan = startPlan(course)
  if (!plan) return null
  const owned = hasAccess(course.slug)
  return (
    <section className={`start-today u-${course.color}`} aria-labelledby="st-title">
      <p className="st-kicker">Si empiezas hoy…</p>
      <h2 id="st-title">{plan.headline}</h2>
      <ol className="st-line">
        {plan.steps.map((s, i) => (
          <li key={s.day} className={i === 0 ? 'is-now' : i === plan.steps.length - 1 ? 'is-goal' : ''}>
            <span className="st-when">{s.when}<small>{i === 0 ? fmtDay(s.date) : fmtShort(s.date)}</small></span>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="st-foot">
        <p>Ritmo sugerido: {plan.pace}. Vas a tu ritmo: si un día no puedes, tu progreso te espera.</p>
        {!owned && isAvailable(course) && <button className="btn btn-mango" onClick={onStart}>Empezar hoy</button>}
        {owned && <Link to={`/aprender/${course.slug}`} className="btn btn-mango">Seguir hoy</Link>}
      </div>
    </section>
  )
}

// Franja de la tienda: «¿Y si empiezas hoy?» con la fecha en que terminarías cada curso
export function StartTodayStrip({ courses }) {
  const { hasAccess } = useAuth()
  const list = courses.filter((c) => isAvailable(c) && startPlan(c))
  if (!list.length) return null
  const today = new Date()
  return (
    <section className="st-strip" aria-labelledby="sts-title">
      <div className="wrap">
        <div className="sts-head">
          <div>
            <p className="st-kicker">Hoy es {fmtDay(today)}</p>
            <h2 id="sts-title">¿Y si empiezas hoy?</h2>
          </div>
          <p>Mira en qué fecha terminarías cada curso con el ritmo sugerido. Entras, pagas una sola vez y tu primera lección empieza en minutos.</p>
        </div>
        <ul className="sts-row">
          {list.map((c) => {
            const plan = startPlan(c, today)
            const owned = hasAccess(c.slug)
            return (
              <li key={c.slug}>
                <Link to={owned ? `/aprender/${c.slug}` : `/curso/${c.slug}`} className="sts-card">
                  <CourseCover course={c} />
                  <div className="sts-body">
                    <strong>{plan.headline}</strong>
                    <span className="sts-date">
                      <b>{plan.days} {plan.days === 1 ? 'día' : 'días'}</b> · terminas el {fmtShort(plan.finish)}
                    </span>
                    <span className="sts-buy">
                      {owned ? 'Ya es tuyo · Seguir' : <>{pesos(c.price, c.currency)} <em>Empezar hoy →</em></>}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// Barra fija en el celular con el precio y el botón, cuando la caja de compra no se ve
export function BuyBar({ course, visible, onStart }) {
  if (!visible) return null
  const plan = startPlan(course)
  return (
    <div className="buy-bar" role="region" aria-label="Comprar curso">
      <div>
        <strong>{pesos(course.price, course.currency)}</strong>
        <span>{plan ? `Si empiezas hoy, terminas el ${fmtShort(plan.finish)}` : 'Pago único · Acceso inmediato'}</span>
      </div>
      <button className="btn btn-mango" onClick={onStart}>Empezar hoy</button>
    </div>
  )
}
