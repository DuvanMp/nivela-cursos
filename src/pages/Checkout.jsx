import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { isAvailable, pesos } from '../data/courses.js'
import { useCatalog } from '../lib/catalog.jsx'
import { backend } from '../lib/backend.js'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'

// Pago de un curso (/pagar/:slug) o de un paquete (/pagar/paquete/:slug).
// Hoy es de prueba: el botón activa el acceso. Para cobrar de verdad, aquí se
// redirige a la pasarela (Wompi, Mercado Pago…) y el acceso lo concede el
// servidor cuando la pasarela confirma el pago.
export default function Checkout({ bundle: isBundle = false }) {
  const { slug } = useParams()
  const { bySlug, bundleBySlug, bundleInfo, loading } = useCatalog()
  const { user, hasAccess, purchase } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { backend.getSettings().then((s) => setMode(s.payments_mode || 'simulado')).catch(() => setMode('simulado')) }, [])

  if (loading || !mode) return <p className="loading">Cargando…</p>

  const item = isBundle ? bundleBySlug(slug) : bySlug(slug)
  if (!item || (isBundle ? item.status !== 'published' : !isAvailable(item))) return <Navigate to="/" replace />

  const info = isBundle ? bundleInfo(item) : null
  const pending = isBundle ? info.items.filter((c) => !hasAccess(c.slug)) : []
  if (!isBundle && hasAccess(item.slug)) return <Navigate to={`/aprender/${item.slug}`} replace />
  if (isBundle && pending.length === 0) return <Navigate to="/mis-cursos" replace />

  const pay = async () => {
    setBusy(true); setError('')
    try {
      await purchase(item.slug, { bundle: isBundle })
      navigate(isBundle ? '/mis-cursos?bienvenida=1' : `/aprender/${item.slug}?bienvenida=1`, { replace: true })
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <main className="wrap checkout">
      <h1>Confirma tu compra</h1>
      <div className="checkout-card">
        {isBundle ? (
          <>
            <div className="checkout-item">
              <div className="bundle-covers mini" aria-hidden="true">{info.items.slice(0, 3).map((c) => <CourseCover key={c.slug} course={c} size="sm" />)}</div>
              <div><strong>{item.title}</strong><span>Cuenta: {user.email}</span></div>
              <span className="price">{pesos(item.price, item.currency)}</span>
            </div>
            <ul className="checkout-list">
              {info.items.map((c) => <li key={c.slug}>{c.title}{hasAccess(c.slug) ? ' (ya lo tienes)' : ''}</li>)}
            </ul>
            {info.saving > 0 && <p className="save">Ahorras {pesos(info.saving, item.currency)} frente a comprarlos por separado</p>}
          </>
        ) : (
          <div className="checkout-item">
            <CourseCover course={item} size="sm" />
            <div><strong>{item.title}</strong><span>Cuenta: {user.email}</span></div>
            <span className="price">{pesos(item.price, item.currency)}</span>
          </div>
        )}
        <dl className="totals">
          <dt>Total</dt><dd>{pesos(item.price, item.currency)}</dd>
        </dl>
        {mode === 'simulado' ? (
          <p className="test-note">Pago de prueba: no se hará ningún cobro. El acceso se activa al confirmar.</p>
        ) : (
          <p className="test-note">Los pagos en línea se están configurando. Escríbenos para activar tu acceso.</p>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-block btn-mango" onClick={pay} disabled={busy || mode !== 'simulado'}>{busy ? 'Activando acceso…' : 'Confirmar pago de prueba'}</button>
        <Link to={isBundle ? `/paquete/${item.slug}` : `/curso/${item.slug}`} className="cancel">Volver</Link>
      </div>
    </main>
  )
}
