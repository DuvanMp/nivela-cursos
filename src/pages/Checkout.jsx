import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { courseBySlug, pesos } from '../data/courses.js'
import CourseCover from '../components/CourseCover.jsx'
import { useAuth } from '../lib/auth.jsx'
import { PAYMENTS_MODE } from '../lib/backend.js'

// Pago. Hoy es simulado: el botón concede el acceso.
// Para cobrar de verdad, aquí se redirige a la pasarela (Wompi, Mercado Pago…)
// y el acceso lo concede el servidor cuando la pasarela confirma el pago.
export default function Checkout() {
  const { slug } = useParams()
  const course = courseBySlug(slug)
  const { user, hasAccess, purchase } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!course || !course.available) return <Navigate to="/" replace />
  if (hasAccess(course.slug)) return <Navigate to={`/aprender/${course.slug}`} replace />

  const pay = async () => {
    setBusy(true); setError('')
    try {
      await purchase(course.slug)
      navigate(`/aprender/${course.slug}?bienvenida=1`, { replace: true })
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <main className="wrap checkout">
      <h1>Confirma tu compra</h1>
      <div className="checkout-card">
        <div className="checkout-item">
          <CourseCover course={course} size="sm" />
          <div>
            <strong>{course.title}</strong>
            <span>Cuenta: {user.email}</span>
          </div>
          <span className="price">{pesos(course.price)}</span>
        </div>
        <dl className="totals">
          <dt>Total</dt><dd>{pesos(course.price)}</dd>
        </dl>
        {PAYMENTS_MODE === 'simulado' && (
          <p className="test-note">Pago de prueba: no se hará ningún cobro. El acceso se activa al confirmar.</p>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-block btn-mango" onClick={pay} disabled={busy}>{busy ? 'Activando acceso…' : 'Confirmar pago de prueba'}</button>
        <Link to={`/curso/${course.slug}`} className="cancel">Volver al curso</Link>
      </div>
    </main>
  )
}
