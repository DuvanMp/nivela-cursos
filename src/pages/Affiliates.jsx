import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { backend } from '../lib/backend.js'
import { useAuth } from '../lib/auth.jsx'
import { useCatalog } from '../lib/catalog.jsx'
import { affiliateLink } from '../lib/referral.js'
import { pesos } from '../data/courses.js'

const STATUS = { pendiente: 'Por pagar', pagada: 'Pagada', anulada: 'Anulada', prueba: 'Venta de prueba' }
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

function Rules() {
  return (
    <section className="aff-rules">
      <h2>Reglas del programa</h2>
      <ul className="perks">
        <li>Ganas una comisión por cada curso o paquete que alguien compre con tu enlace.</li>
        <li>Solo cuentan ventas reales a clientes. No hay pagos por inscribir a otros afiliados ni niveles.</li>
        <li>Tu enlace funciona durante 30 días en el navegador de quien lo abre.</li>
        <li>Comprar con tu propio enlace no genera comisión.</li>
        <li>Di siempre que es tu enlace de afiliado y no prometas resultados que no puedes garantizar.</li>
      </ul>
    </section>
  )
}

export default function Affiliates() {
  const { user, loading } = useAuth()
  const { bySlug } = useCatalog()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    backend.getAffiliate(user).then(setData).catch((e) => setError(e.message))
  }, [user?.id])

  if (loading) return <p className="loading">Cargando…</p>
  if (!user) {
    return (
      <main className="wrap section aff">
        <h1>Gana dinero recomendando cursos</h1>
        <p className="lead">Crea tu cuenta gratis, copia tu enlace y compártelo. Cada vez que alguien compre con él, ganas una comisión.</p>
        <Link to="/entrar?next=/afiliados" className="btn btn-mango">Crear mi cuenta y obtener mi enlace</Link>
        <Rules />
      </main>
    )
  }
  if (error) return <main className="wrap empty"><h1>No pudimos cargar tu panel</h1><p>{error}</p></main>
  if (!data) return <p className="loading">Cargando tu panel…</p>

  const link = affiliateLink(data.ref_code)
  const real = data.sales.filter((s) => s.commission_status !== 'prueba')
  const sum = (st) => real.filter((s) => s.commission_status === st).reduce((n, s) => n + s.commission, 0)
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* sin permiso */ }
  }

  return (
    <main className="wrap section aff">
      <h1>Tu panel de afiliado</h1>
      <div className="aff-link">
        <span>Tu enlace personal</span>
        <div className="aff-link-row">
          <input value={link} readOnly aria-label="Tu enlace de afiliado" onFocus={(e) => e.target.select()} />
          <button className="btn" onClick={copy}>{copied ? 'Copiado' : 'Copiar enlace'}</button>
        </div>
        <p className="muted">Ganas el {Math.round(data.rate * 100)} % de cada venta hecha con este enlace. Puedes agregar la página de un curso, por ejemplo: {link.replace('/?', '/curso/ingles-a1?')}</p>
      </div>
      <dl className="kpis">
        <div><dt>Ventas</dt><dd>{real.length}</dd></div>
        <div><dt>Por pagar</dt><dd>{pesos(sum('pendiente'))}</dd></div>
        <div><dt>Pagadas</dt><dd>{pesos(sum('pagada'))}</dd></div>
        <div><dt>Ventas de prueba</dt><dd>{data.sales.length - real.length}</dd></div>
      </dl>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Fecha</th><th>Curso</th><th className="num">Venta</th><th className="num">Tu comisión</th><th>Estado</th></tr></thead>
          <tbody>
            {data.sales.length === 0 && <tr><td colSpan={5} className="muted">Todavía no tienes ventas. Comparte tu enlace para empezar.</td></tr>}
            {data.sales.map((s, i) => (
              <tr key={i}>
                <td>{fecha(s.created_at)}</td>
                <td>{bySlug(s.course_slug)?.title || s.course_slug}</td>
                <td className="num">{pesos(s.amount)}</td>
                <td className="num">{pesos(s.commission)}</td>
                <td><span className={`status s-${s.commission_status}`}>{STATUS[s.commission_status] || '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Rules />
    </main>
  )
}
