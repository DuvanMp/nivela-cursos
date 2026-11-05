import { Link, useNavigate, useParams } from 'react-router-dom'
import { lessonCount, pesos } from '../data/courses.js'
import { useCatalog } from '../lib/catalog.jsx'
import { useAuth } from '../lib/auth.jsx'
import CourseCover from '../components/CourseCover.jsx'
import { Price } from './Store.jsx'

export default function BundleDetail() {
  const { slug } = useParams()
  const { bundleBySlug, bundleInfo, loading } = useCatalog()
  const { user, hasAccess } = useAuth()
  const navigate = useNavigate()
  const bundle = bundleBySlug(slug)

  if (loading) return <p className="loading">Cargando…</p>
  if (!bundle) return <main className="wrap empty"><h1>No encontramos ese paquete</h1><Link to="/" className="btn">Ver cursos</Link></main>

  const info = bundleInfo(bundle)
  const owned = info.items.filter((c) => hasAccess(c.slug))
  const ownedAll = owned.length === info.items.length
  const buy = () => {
    const to = `/pagar/paquete/${bundle.slug}`
    navigate(user ? to : `/entrar?next=${encodeURIComponent(to)}`)
  }

  return (
    <main>
      <section className={`detail-hero bg-${bundle.color}`}>
        <div className="wrap detail-grid">
          <div>
            <Link to="/#paquetes" className="back">Todos los paquetes</Link>
            <h1>{bundle.title}</h1>
            <p className="lead">{bundle.short}</p>
          </div>
          {bundle.image ? (
            <div className="bundle-covers big has-image" aria-hidden="true"><img src={bundle.image} alt="" decoding="async" /></div>
          ) : (
            <div className="bundle-covers big" aria-hidden="true">
              {info.items.slice(0, 3).map((c) => <CourseCover key={c.slug} course={c} />)}
            </div>
          )}
        </div>
      </section>

      <div className="wrap detail-body">
        <section>
          <h2>Incluye {info.items.length} cursos</h2>
          <ol className="units">
            {info.items.map((c) => (
              <li key={c.slug} className={`unit-row u-${c.color}`}>
                <div>
                  <h3><Link to={`/curso/${c.slug}`}>{c.title}</Link></h3>
                  <p>{c.short}</p>
                </div>
                <span>{lessonCount(c)} lecciones · {pesos(c.price, c.currency)}</span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="buy">
          <div className="badges static">
            <span className="badge b-pack">Paquete</span>
            {info.percent > 0 && <span className="off static">-{info.percent}%</span>}
          </div>
          <Price price={bundle.price} compare={info.separate} currency={bundle.currency} big />
          {info.saving > 0 && <p className="save">Ahorras {pesos(info.saving, bundle.currency)} frente a comprarlos por separado</p>}
          <p>Pago único. Acceso inmediato a los {info.items.length} cursos.</p>
          {owned.length > 0 && !ownedAll && <p className="muted">Ya tienes {owned.length} de estos cursos: el pago activa los que te faltan.</p>}
          {ownedAll ? (
            <Link to="/mis-cursos" className="btn btn-block">Ir a mis cursos</Link>
          ) : bundle.status === 'published' ? (
            <button className="btn btn-block btn-mango" onClick={buy}>Comprar paquete</button>
          ) : (
            <button className="btn btn-block" disabled>Próximamente</button>
          )}
        </aside>
      </div>
    </main>
  )
}
