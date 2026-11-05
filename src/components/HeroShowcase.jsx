import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAvailable, pesos } from '../data/courses.js'
import { startPlan } from '../lib/startToday.js'
import CourseCover from './CourseCover.jsx'

// Qué vas a lograr con cada curso (se usa en el título que cambia)
export const VERB = {
  'ingles-a1': 'hablar inglés',
  'ingles-m2': 'conversar en inglés',
  'ingles-m3': 'viajar en inglés',
  'reto-militar-hombres': 'entrenar en casa',
  'reto-militar-mujeres': 'entrenar en casa',
  'ventas-whatsapp': 'vender por WhatsApp',
  'ia-desde-cero': 'usar la IA',
  'redes-digitales': 'vender en redes',
}

// Pequeña animación «en vivo» encima de cada portada, según el tipo de curso
function Live({ course }) {
  switch (course.category) {
    case 'Inglés':
      return <div className="live live-chat"><span>Hello! 👋</span><span className="me">Hi! I’m Ana</span></div>
    case 'Entrenamiento':
      return <div className="live live-ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" /><circle cx="20" cy="20" r="16" className="go" /></svg><b>Día 1<small>/21</small></b></div>
    case 'Ventas':
      return <div className="live live-chat"><span>¿Cuánto vale?</span><span className="me">¡Te lo separo! ✓✓</span></div>
    case 'Tecnología':
      return <div className="live live-type"><b>Prompt:</b><span>escribe un anuncio para mi tienda</span></div>
    default:
      return <div className="live live-notif"><i /> <b>+1 venta</b><small>hace 1 min</small></div>
  }
}

// Portada en movimiento: un mazo de cursos que se reparte solo.
// Se pausa al pasar el mouse; con «reducir movimiento» no avanza solo.
export default function HeroShowcase({ courses, active, onChange }) {
  const list = courses.filter(isAvailable)
  const [paused, setPaused] = useState(false)
  const reduce = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const n = list.length

  useEffect(() => {
    if (!n || paused || reduce.current) return
    const t = setTimeout(() => onChange((active + 1) % n), 3800)
    return () => clearTimeout(t)
  }, [active, paused, n, onChange])

  if (!n) return null
  return (
    <div className="show" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="deck">
        {list.map((c, i) => {
          const d = (i - active + n) % n
          const pos = d === 0 ? 'p0' : d === 1 ? 'p1' : d === 2 ? 'p2' : d === n - 1 ? 'out' : 'hide'
          const plan = startPlan(c)
          return (
            <Link key={c.slug} to={`/curso/${c.slug}`} className={`deck-card ${pos}`} tabIndex={d === 0 ? 0 : -1} aria-hidden={d !== 0}>
              <div className="deck-cover">
                <CourseCover course={c} />
                {d === 0 && <Live course={c} />}
              </div>
              <div className="deck-body">
                <span className="cat">{c.category}</span>
                <strong>{c.title}</strong>
                {plan && <p>{plan.headline}</p>}
                <span className="deck-buy">{pesos(c.price, c.currency)} <em>Ver curso →</em></span>
              </div>
            </Link>
          )
        })}
        <span className="float f1">+10 XP</span>
        <span className="float f2">🔥 Racha: 3 días</span>
        <span className="float f3">Certificado ✓</span>
      </div>
      <div className="deck-dots" role="tablist" aria-label="Cursos">
        {list.map((c, i) => (
          <button key={c.slug} role="tab" aria-selected={i === active} aria-label={c.title} onClick={() => onChange(i)}>
            {i === active && !paused && !reduce.current && <i key={active} />}
          </button>
        ))}
      </div>
    </div>
  )
}

// Cinta infinita con todos los cursos (debajo de la portada)
export function CourseMarquee({ courses }) {
  const list = courses.filter(isAvailable)
  if (!list.length) return null
  const items = [...list, ...list]
  return (
    <div className="marquee" aria-label="Todos los cursos">
      <div className="marquee-track">
        {items.map((c, i) => (
          <Link key={`${c.slug}-${i}`} to={`/curso/${c.slug}`} className="mq-item" tabIndex={i < list.length ? 0 : -1} aria-hidden={i >= list.length}>
            <CourseCover course={c} size="sm" />
            <span>{c.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
