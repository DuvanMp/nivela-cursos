import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAvailable, lessonCount, pesos } from '../data/courses.js'
import { useCatalog } from '../lib/catalog.jsx'
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
          <button key={o} className={`opt ${pick === o ? (right ? 'is-right' : 'is-wrong') : ''}`} onClick={() => choose(o)}>{o}</button>
        ))}
      </div>
      {pick && (
        <div className={`demo-feedback ${right ? 'ok' : 'ko'}`}>
          {right ? (
            <>
              <strong>¡Correcto! +10 XP</strong>
              <Link to="/curso/ingles-a1" className="btn btn-light btn-sm">Seguir con Inglés</Link>
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

export function Price({ price, compare, currency, big }) {
  return (
    <span className={`price-row ${big ? 'big' : ''}`}>
      {compare > price && <s>{pesos(compare, currency)}</s>}
      <strong>{pesos(price, currency)}</strong>
    </span>
  )
}

function OfferCard({ course }) {
  const { hasAccess } = useAuth()
  const { isBestseller, students, discount, bundlesFor } = useCatalog()
  const owned = hasAccess(course.slug)
  const n = lessonCount(course)
  const off = discount(course)
  const st = students(course.slug)
  const inBundle = bundlesFor(course.slug)[0]
  return (
    <li>
      <Link to={owned ? `/aprender/${course.slug}` : `/curso/${course.slug}`} className={`card offer ${isAvailable(course) ? '' : 'soon'}`}>
        <div className="offer-cover">
          <CourseCover course={course} />
          <div className="badges">
            {isBestseller(course.slug) && <span className="badge b-best">Más vendido</span>}
            {course.badge === 'nuevo' && <span className="badge b-new">Nuevo</span>}
            {course.badge === 'recomendado' && <span className="badge b-rec">Recomendado</span>}
          </div>
          {off > 0 && !owned && <span className="off">-{off}%</span>}
        </div>
        <div className="card-body">
          {course.category && <span className="cat">{course.category}</span>}
          <h3>{course.title}</h3>
          <p>{course.short}</p>
          <span className="meta">{course.level}{n ? ` · ${n} lecciones` : ''}{st ? ` · ${st.toLocaleString('es-CO')} estudiantes` : ''}</span>
          <div className="card-buy">
            {owned ? (
              <><span className="tag tag-owned">Ya es tuyo</span><span className="go">Continuar</span></>
            ) : isAvailable(course) ? (
              <>
                <Price price={course.price} compare={course.compare_at_price} currency={course.currency} />
                <span className="perk">Pago único · Acceso inmediato</span>
                {inBundle && <span className="perk-alt">También en el paquete «{inBundle.title}»</span>}
              </>
            ) : (
              <span className="tag">{course.status === 'draft' ? 'Borrador' : 'Próximamente'}</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

export function BundleCard({ bundle }) {
  const { bundleInfo } = useCatalog()
  const { hasAccess } = useAuth()
  const info = bundleInfo(bundle)
  const ownedAll = info.items.every((c) => hasAccess(c.slug))
  return (
    <article className={`bundle u-${bundle.color}`}>
      <div className="bundle-covers" aria-hidden="true">
        {info.items.slice(0, 3).map((c) => <CourseCover key={c.slug} course={c} />)}
      </div>
      <div className="bundle-body">
        <div className="bundle-head">
          <span className="badge b-pack">Paquete · {info.items.length} cursos</span>
          {info.percent > 0 && <span className="off static">-{info.percent}%</span>}
        </div>
        <h3>{bundle.title}</h3>
        <p>{bundle.short}</p>
        <ul className="bundle-list">{info.items.map((c) => <li key={c.slug}>{c.title}</li>)}</ul>
        <div className="bundle-buy">
          {ownedAll ? <span className="tag tag-owned">Ya tienes todos</span> : (
            <>
              <Price price={bundle.price} compare={info.separate} currency={bundle.currency} big />
              {info.saving > 0 && <span className="save">Ahorras {pesos(info.saving, bundle.currency)}</span>}
            </>
          )}
          <Link to={`/paquete/${bundle.slug}`} className="btn btn-mango">Ver paquete</Link>
        </div>
      </div>
    </article>
  )
}

export default function Store() {
  const { courses, bundles, loading, error } = useCatalog()
  const [cat, setCat] = useState('Todos')
  const cats = ['Todos', ...new Set(courses.map((c) => c.category).filter(Boolean))]
  const shown = courses.filter((c) => cat === 'Todos' || c.category === cat)
  const packs = bundles
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Aprende algo útil en 10 minutos al día</h1>
            <p className="lead">Cursos cortos en español: inglés para conversar, entrenamiento en casa, ventas, inteligencia artificial y negocios digitales. Avanzas por niveles y tu progreso queda guardado.</p>
            <div className="actions">
              <a href="#cursos" className="btn btn-mango">Ver cursos</a>
              <a href="#paquetes" className="btn btn-ghost">Ver paquetes con descuento</a>
            </div>
          </div>
          <HeroDemo />
        </div>
      </section>

      {packs.length > 0 && (
        <section id="paquetes" className="wrap section">
          <h2>Paquetes con descuento</h2>
          <div className="bundles">{packs.map((b) => <BundleCard key={b.slug} bundle={b} />)}</div>
        </section>
      )}

      <section id="cursos" className="wrap section">
        <div className="section-bar">
          <h2>Cursos</h2>
          <div className="chips-filter" role="group" aria-label="Filtrar por categoría">
            {cats.map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        </div>
        {error && <p className="error">No pudimos cargar los cursos: {error}</p>}
        {loading ? <p className="muted">Cargando cursos…</p> : (
          <ul className="grid">{shown.map((c) => <OfferCard key={c.slug} course={c} />)}</ul>
        )}
      </section>

      <section className="wrap section how">
        <h2>Cómo funciona</h2>
        <ol className="steps">
          <li><strong>Elige un curso o un paquete</strong><span>Mira qué vas a aprender y cuántas lecciones tiene.</span></li>
          <li><strong>Paga una sola vez</strong><span>Creas tu cuenta y el acceso se activa de inmediato.</span></li>
          <li><strong>Avanza a tu ritmo</strong><span>Cada lección desbloquea la siguiente. Tu racha, tus puntos y tu certificado quedan en tu cuenta.</span></li>
        </ol>
      </section>

      <section className="wrap section">
        <div className="aff-cta">
          <div>
            <h2>Gana dinero recomendando</h2>
            <p>Comparte tu enlace personal y gana una comisión por cada curso que se venda con él. Sin inscripciones ni niveles: solo ventas reales.</p>
          </div>
          <Link to="/afiliados" className="btn btn-mango">Quiero mi enlace</Link>
        </div>
      </section>
    </main>
  )
}
