import { useEffect, useMemo, useState } from 'react'
import { backend } from '../lib/backend.js'
import { useAuth } from '../lib/auth.jsx'
import { useCatalog } from '../lib/catalog.jsx'
import { COLORS, STATUS_LABEL, pesos } from '../data/courses.js'
import CourseCover from '../components/CourseCover.jsx'

// Panel de administración. La interfaz solo aparece para administradores,
// pero la protección real está en la base de datos: si alguien sin rol de
// admin llama a estas funciones, el servidor las rechaza.
const TABS = [['cursos', 'Cursos y precios'], ['paquetes', 'Paquetes'], ['usuarios', 'Usuarios y roles'], ['ventas', 'Ventas'], ['afiliados', 'Afiliados'], ['ajustes', 'Ajustes']]
const ACTIVE = ['pagado', 'simulado', 'cortesia']
const PURCHASE_LABEL = { pagado: 'Pagado', simulado: 'Pago de prueba', cortesia: 'Cortesía', pendiente: 'Pendiente', reembolsado: 'Sin acceso' }
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Admin() {
  const [tab, setTab] = useState('cursos')
  return (
    <main className="wrap section admin">
      <h1>Administración</h1>
      <div className="admin-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === 'cursos' && <CoursesAdmin />}
      {tab === 'paquetes' && <BundlesAdmin />}
      {tab === 'afiliados' && <AffiliatesAdmin />}
      {tab === 'usuarios' && <UsersAdmin />}
      {tab === 'ventas' && <SalesAdmin />}
      {tab === 'ajustes' && <SettingsAdmin />}
    </main>
  )
}

function useNotice() {
  const [notice, setNotice] = useState(null)
  const show = (type, text) => { setNotice({ type, text }); if (type === 'ok') setTimeout(() => setNotice(null), 2500) }
  const el = notice && <p className={notice.type === 'ok' ? 'info' : 'error'} role="status">{notice.text}</p>
  return [el, show]
}

// ── Cursos y precios ──────────────────────────────────────────────
const EMPTY = { slug: '', title: '', short: '', description: '', level: '', category: '', price: 0, compare_at_price: null, badge: '', currency: 'COP', color: 'ultra', cover: '', status: 'draft', sort: 99 }

function validate(c, isNew, existing) {
  if (isNew && !/^[a-z0-9-]{2,60}$/.test(c.slug)) return 'La dirección (slug) solo puede tener minúsculas, números y guiones, de 2 a 60 caracteres.'
  if (isNew && existing.some((x) => x.slug === c.slug)) return 'Ya existe un curso con esa dirección.'
  if (c.title.trim().length < 2 || c.title.length > 120) return 'El título debe tener entre 2 y 120 caracteres.'
  if (!Number.isInteger(c.price) || c.price < 0 || c.price > 100000000) return 'El precio debe ser un número entero entre 0 y 100.000.000.'
  if (c.compare_at_price && c.compare_at_price <= c.price) return 'El precio anterior debe ser mayor que el precio actual (o déjalo en 0).'
  if (c.short.length > 200) return 'La descripción corta admite máximo 200 caracteres.'
  if (c.description.length > 2000) return 'La descripción admite máximo 2.000 caracteres.'
  if (c.cover.length > 20) return 'El texto de portada admite máximo 20 caracteres.'
  return ''
}

function CoursesAdmin() {
  const { courses, reload } = useCatalog()
  const [editing, setEditing] = useState(null) // { course, isNew }
  const [notice, show] = useNotice()

  const quickSave = async (course, changes) => {
    try {
      await backend.adminSaveCourse({ ...course, ...changes })
      await reload()
      show('ok', 'Cambios guardados.')
    } catch (e) { show('error', e.message) }
  }

  return (
    <section className="admin-panel">
      <div className="admin-bar">
        <p className="muted">El precio y el estado se cambian aquí y se aplican de inmediato en la tienda.</p>
        <button className="btn btn-sm" onClick={() => setEditing({ course: { ...EMPTY }, isNew: true })}>Nuevo curso</button>
      </div>
      {notice}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Curso</th><th>Estado</th><th>Precio (COP)</th><th></th></tr></thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.slug}>
                <td><div className="t-course"><CourseCover course={c} size="sm" /><div><strong>{c.title}</strong><span>/{c.slug}{!c.outline?.length && c.status === 'published' ? ' · sin lecciones todavía' : ''}</span></div></div></td>
                <td>
                  <select value={c.status} onChange={(e) => quickSave(c, { status: e.target.value })} aria-label={`Estado de ${c.title}`}>
                    {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </td>
                <td><PriceInput course={c} onSave={(price) => quickSave(c, { price })} /></td>
                <td><button className="link-btn" onClick={() => setEditing({ course: { ...c }, isNew: false })}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <CourseForm
          {...editing}
          existing={courses}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reload(); show('ok', 'Curso guardado.') }}
        />
      )}
    </section>
  )
}

function PriceInput({ course, onSave }) {
  const [value, setValue] = useState(String(course.price))
  useEffect(() => setValue(String(course.price)), [course.price])
  const n = Number(value.replace(/\D/g, ''))
  const changed = n !== course.price
  return (
    <form className="price-edit" onSubmit={(e) => { e.preventDefault(); if (changed) onSave(n) }}>
      <input inputMode="numeric" value={Number(value.replace(/\D/g, '') || 0).toLocaleString('es-CO')} onChange={(e) => setValue(e.target.value)} aria-label={`Precio de ${course.title}`} />
      {changed && <button className="btn btn-sm">Guardar</button>}
    </form>
  )
}

function CourseForm({ course, isNew, existing, onClose, onSaved }) {
  const [c, setC] = useState(course)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k, num) => (e) => setC({ ...c, [k]: num ? Number(e.target.value.replace(/\D/g, '') || 0) : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const clean = { ...c, title: c.title.trim(), slug: c.slug.trim(), compare_at_price: c.compare_at_price || null }
    const err = validate(clean, isNew, existing)
    if (err) return setError(err)
    setBusy(true)
    try { await backend.adminSaveCourse(clean); onSaved() } catch (e2) { setError(e2.message); setBusy(false) }
  }

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={isNew ? 'Nuevo curso' : `Editar ${course.title}`}>
      <form className="sheet-card" onSubmit={submit}>
        <h2>{isNew ? 'Nuevo curso' : 'Editar curso'}</h2>
        <div className="form-grid">
          <label className="field">Título<input value={c.title} onChange={set('title')} maxLength={120} required /></label>
          <label className="field">Dirección (slug)<input value={c.slug} onChange={set('slug')} disabled={!isNew} placeholder="ej. excel-avanzado" /></label>
          <label className="field">Precio (COP)<input inputMode="numeric" value={c.price.toLocaleString('es-CO')} onChange={set('price', true)} /></label>
          <label className="field">Estado
            <select value={c.status} onChange={set('status')}>{Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className="field">Precio anterior (opcional)<input inputMode="numeric" value={(c.compare_at_price || 0).toLocaleString('es-CO')} onChange={set('compare_at_price', true)} /></label>
          <label className="field">Etiqueta
            <select value={c.badge || ''} onChange={set('badge')}>
              <option value="">Ninguna</option><option value="nuevo">Nuevo</option><option value="recomendado">Recomendado</option>
            </select>
          </label>
          <p className="hint wide">El precio anterior muestra el descuento («-20 %»). Úsalo solo si el curso de verdad se vendió a ese precio: mostrar descuentos falsos es publicidad engañosa. «Más vendido» y el número de estudiantes se calculan solos con las ventas reales.</p>
          <label className="field">Nivel<input value={c.level} onChange={set('level')} maxLength={60} /></label>
          <label className="field">Categoría<input value={c.category || ''} onChange={set('category')} maxLength={40} placeholder="ej. Inglés" /></label>
          <label className="field">Orden en la tienda<input inputMode="numeric" value={c.sort} onChange={set('sort', true)} /></label>
          <label className="field">Color
            <select value={c.color} onChange={set('color')}>{COLORS.map((x) => <option key={x}>{x}</option>)}</select>
          </label>
          <label className="field">Texto de portada<input value={c.cover} onChange={set('cover')} maxLength={20} /></label>
          <label className="field wide">Descripción corta<input value={c.short} onChange={set('short')} maxLength={200} /></label>
          <label className="field wide">Descripción<textarea value={c.description} onChange={set('description')} rows={4} maxLength={2000} /></label>
        </div>
        {isNew && <p className="hint">El curso se crea sin lecciones. El contenido se agrega en el código (src/data) y se sube con npm run seed.</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="sheet-actions">
          <button type="button" className="btn btn-ghost-dark" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar curso'}</button>
        </div>
      </form>
    </div>
  )
}

// ── Paquetes ──────────────────────────────────────────────────────
function BundlesAdmin() {
  const { bundles, courses, bundleInfo, reload } = useCatalog()
  const [editing, setEditing] = useState(null)
  const [notice, show] = useNotice()
  const blank = { slug: '', title: '', short: '', price: 0, currency: 'COP', color: 'ultra', cover: '', status: 'draft', courses: [], sort: 99 }

  return (
    <section className="admin-panel">
      <div className="admin-bar">
        <p className="muted">El descuento del paquete se calcula solo: es la diferencia con la suma de los cursos por separado.</p>
        <button className="btn btn-sm" onClick={() => setEditing({ b: { ...blank }, isNew: true })}>Nuevo paquete</button>
      </div>
      {notice}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Paquete</th><th>Estado</th><th className="num">Por separado</th><th className="num">Precio</th><th className="num">Ahorro</th><th></th></tr></thead>
          <tbody>
            {bundles.map((b) => {
              const info = bundleInfo(b)
              return (
                <tr key={b.slug}>
                  <td><strong>{b.title}</strong><span className="sub">{info.items.map((c) => c.title).join(' + ')}</span></td>
                  <td>{STATUS_LABEL[b.status]}</td>
                  <td className="num">{pesos(info.separate)}</td>
                  <td className="num">{pesos(b.price)}</td>
                  <td className="num">{info.percent} %</td>
                  <td><button className="link-btn" onClick={() => setEditing({ b: { ...b }, isNew: false })}>Editar</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {editing && <BundleForm {...editing} courses={courses} existing={bundles} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload(); show('ok', 'Paquete guardado.') }} />}
    </section>
  )
}

function BundleForm({ b: initial, isNew, courses, existing, onClose, onSaved }) {
  const [b, setB] = useState(initial)
  const [error, setError] = useState('')
  const set = (k, num) => (e) => setB({ ...b, [k]: num ? Number(e.target.value.replace(/\D/g, '') || 0) : e.target.value })
  const toggle = (slug) => setB({ ...b, courses: b.courses.includes(slug) ? b.courses.filter((x) => x !== slug) : [...b.courses, slug] })
  const separate = b.courses.reduce((n, s) => n + (courses.find((c) => c.slug === s)?.price || 0), 0)

  const submit = async (e) => {
    e.preventDefault()
    if (isNew && !/^[a-z0-9-]{2,60}$/.test(b.slug)) return setError('La dirección (slug) solo puede tener minúsculas, números y guiones.')
    if (isNew && existing.some((x) => x.slug === b.slug)) return setError('Ya existe un paquete con esa dirección.')
    if (b.title.trim().length < 2) return setError('Escribe un título.')
    if (b.courses.length < 2) return setError('Un paquete necesita al menos 2 cursos.')
    if (b.price >= separate) return setError('El precio del paquete debe ser menor que la suma de los cursos por separado.')
    try { await backend.adminSaveBundle({ ...b, title: b.title.trim() }); onSaved() } catch (e2) { setError(e2.message) }
  }

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={isNew ? 'Nuevo paquete' : 'Editar paquete'}>
      <form className="sheet-card" onSubmit={submit}>
        <h2>{isNew ? 'Nuevo paquete' : 'Editar paquete'}</h2>
        <div className="form-grid">
          <label className="field">Título<input value={b.title} onChange={set('title')} maxLength={120} /></label>
          <label className="field">Dirección (slug)<input value={b.slug} onChange={set('slug')} disabled={!isNew} /></label>
          <label className="field">Precio del paquete (COP)<input inputMode="numeric" value={b.price.toLocaleString('es-CO')} onChange={set('price', true)} /></label>
          <label className="field">Estado
            <select value={b.status} onChange={set('status')}>{Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className="field">Color<select value={b.color} onChange={set('color')}>{COLORS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field">Texto de portada<input value={b.cover} onChange={set('cover')} maxLength={20} /></label>
          <label className="field wide">Descripción corta<input value={b.short} onChange={set('short')} maxLength={200} /></label>
        </div>
        <fieldset className="pick-courses">
          <legend>Cursos incluidos</legend>
          {courses.map((c) => (
            <label key={c.slug}><input type="checkbox" checked={b.courses.includes(c.slug)} onChange={() => toggle(c.slug)} /> {c.title} <span className="muted">{pesos(c.price)}</span></label>
          ))}
        </fieldset>
        <p className="hint">Por separado: {pesos(separate)} · Paquete: {pesos(b.price)} · Ahorro: {pesos(Math.max(0, separate - b.price))}</p>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="sheet-actions">
          <button type="button" className="btn btn-ghost-dark" onClick={onClose}>Cancelar</button>
          <button className="btn">Guardar paquete</button>
        </div>
      </form>
    </div>
  )
}

// ── Afiliados ─────────────────────────────────────────────────────
function AffiliatesAdmin() {
  const [data, setData] = useState(null)
  const [notice, show] = useNotice()
  const load = async () => {
    try {
      const [p, u] = await Promise.all([backend.adminListPurchases(), backend.adminListUsers()])
      setData({ purchases: p, users: Object.fromEntries(u.map((x) => [x.id, x])) })
    } catch (e) { show('error', e.message) }
  }
  useEffect(() => { load() }, [])
  if (!data) return <p className="muted">Cargando afiliados…</p>

  const rows = {}
  for (const p of data.purchases) {
    if (!p.affiliate_id || p.status === 'reembolsado') continue
    const r = (rows[p.affiliate_id] ||= { id: p.affiliate_id, sales: 0, tests: 0, pending: 0, paid: 0 })
    if (p.commission_status === 'prueba') { r.tests++; continue }
    r.sales++
    if (p.commission_status === 'pendiente') r.pending += p.commission
    if (p.commission_status === 'pagada') r.paid += p.commission
  }
  const list = Object.values(rows).sort((a, b) => b.pending - a.pending)
  const pay = async (id) => {
    try { await backend.adminPayCommissions(id); await load(); show('ok', 'Comisiones marcadas como pagadas.') } catch (e) { show('error', e.message) }
  }

  return (
    <section className="admin-panel">
      <p className="muted">Las comisiones se generan solas con cada venta pagada que llega por un enlace de afiliado. Cuando le transfieras a un afiliado, márcalas como pagadas.</p>
      {notice}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Afiliado</th><th className="num">Ventas</th><th className="num">Por pagar</th><th className="num">Pagado</th><th></th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={5} className="muted">Todavía no hay ventas con enlaces de afiliado.</td></tr>}
            {list.map((r) => (
              <tr key={r.id}>
                <td><strong>{data.users[r.id]?.name || '(sin nombre)'}</strong><span className="sub">{data.users[r.id]?.email}{r.tests ? ` · ${r.tests} ventas de prueba` : ''}</span></td>
                <td className="num">{r.sales}</td>
                <td className="num">{pesos(r.pending)}</td>
                <td className="num">{pesos(r.paid)}</td>
                <td>{r.pending > 0 && <button className="btn btn-sm" onClick={() => pay(r.id)}>Marcar como pagado</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ── Usuarios y roles ──────────────────────────────────────────────
function UsersAdmin() {
  const { user: me } = useAuth()
  const { courses } = useCatalog()
  const [users, setUsers] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [filter, setFilter] = useState('')
  const [notice, show] = useNotice()

  const load = async () => {
    try {
      const [u, p] = await Promise.all([backend.adminListUsers(), backend.adminListPurchases()])
      setUsers(u); setPurchases(p)
    } catch (e) { show('error', e.message); setUsers([]) }
  }
  useEffect(() => { load() }, [])

  const run = async (fn, okText) => {
    try { await fn(); await load(); show('ok', okText) } catch (e) { show('error', e.message) }
  }

  const list = (users || []).filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(filter.toLowerCase()))
  const accessOf = (id) => purchases.filter((p) => p.user_id === id && ACTIVE.includes(p.status))
  const sellable = courses.filter((c) => c.status !== 'draft')

  if (!users) return <p className="muted">Cargando usuarios…</p>
  return (
    <section className="admin-panel">
      <div className="admin-bar">
        <input className="search" placeholder="Buscar por nombre o correo" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Buscar usuario" />
        <span className="muted">{users.length} usuarios</span>
      </div>
      {notice}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Usuario</th><th>Rol</th><th>Cursos</th><th>Dar acceso</th></tr></thead>
          <tbody>
            {list.map((u) => {
              const own = accessOf(u.id)
              const missing = sellable.filter((c) => !own.some((p) => p.course_slug === c.slug))
              return (
                <tr key={u.id}>
                  <td><strong>{u.name || '(sin nombre)'}</strong><span className="sub">{u.email} · desde {fecha(u.created_at)}</span></td>
                  <td>
                    <select value={u.role} disabled={u.id === me.id} title={u.id === me.id ? 'No puedes cambiar tu propio rol' : ''}
                      onChange={(e) => run(() => backend.adminSetRole(u.id, e.target.value), 'Rol actualizado.')} aria-label={`Rol de ${u.email}`}>
                      <option value="student">Estudiante</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td>
                    <div className="chips-row">
                      {own.length === 0 && <span className="muted">Ninguno</span>}
                      {own.map((p) => (
                        <span key={p.course_slug} className="pill">
                          {courses.find((c) => c.slug === p.course_slug)?.title || p.course_slug}
                          <button aria-label={`Quitar acceso a ${p.course_slug}`} onClick={() => run(() => backend.adminSetAccess(u.id, p.course_slug, 'reembolsado'), 'Acceso retirado.')}>×</button>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {missing.length > 0 && <GrantAccess user={u} courses={missing} onGrant={(slug, kind) => {
                      const c = courses.find((x) => x.slug === slug)
                      return run(() => backend.adminSetAccess(u.id, slug, kind, kind === 'pagado' ? c.price : 0), kind === 'pagado' ? 'Venta registrada.' : 'Acceso de cortesía concedido.')
                    }} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// Dar acceso: venta pagada por fuera (Nequi, transferencia, efectivo) o cortesía
function GrantAccess({ user, courses, onGrant }) {
  const [slug, setSlug] = useState('')
  const [kind, setKind] = useState('pagado')
  return (
    <div className="grant">
      <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label={`Curso para ${user.email}`}>
        <option value="">Elegir curso…</option>
        {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
      </select>
      <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Tipo de acceso">
        <option value="pagado">Pagó (Nequi, transferencia…)</option>
        <option value="cortesia">Cortesía (gratis)</option>
      </select>
      <button className="btn btn-sm" disabled={!slug} onClick={async () => { await onGrant(slug, kind); setSlug('') }}>Dar acceso</button>
    </div>
  )
}

// ── Ventas ────────────────────────────────────────────────────────
function SalesAdmin() {
  const { courses } = useCatalog()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([backend.adminListPurchases(), backend.adminListUsers()])
      .then(([p, u]) => setData({ purchases: p, users: Object.fromEntries(u.map((x) => [x.id, x])) }))
      .catch((e) => setError(e.message))
  }, [])

  const stats = useMemo(() => {
    const p = data?.purchases || []
    return {
      ingresos: p.filter((x) => x.status === 'pagado').reduce((n, x) => n + x.amount, 0),
      pagadas: p.filter((x) => x.status === 'pagado').length,
      prueba: p.filter((x) => x.status === 'simulado').length,
      cortesia: p.filter((x) => x.status === 'cortesia').length,
    }
  }, [data])

  if (error) return <p className="error">{error}</p>
  if (!data) return <p className="muted">Cargando ventas…</p>
  return (
    <section className="admin-panel">
      <dl className="kpis">
        <div><dt>Ingresos reales</dt><dd>{pesos(stats.ingresos)}</dd></div>
        <div><dt>Ventas pagadas</dt><dd>{stats.pagadas}</dd></div>
        <div><dt>Pagos de prueba</dt><dd>{stats.prueba}</dd></div>
        <div><dt>Cortesías</dt><dd>{stats.cortesia}</dd></div>
      </dl>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Fecha</th><th>Usuario</th><th>Curso</th><th>Estado</th><th className="num">Valor</th></tr></thead>
          <tbody>
            {data.purchases.length === 0 && <tr><td colSpan={5} className="muted">Todavía no hay compras.</td></tr>}
            {data.purchases.map((p) => (
              <tr key={p.id}>
                <td>{fecha(p.created_at)}</td>
                <td>{data.users[p.user_id]?.email || 'Usuario eliminado'}</td>
                <td>{courses.find((c) => c.slug === p.course_slug)?.title || p.course_slug}</td>
                <td><span className={`status s-${p.status}`}>{PURCHASE_LABEL[p.status]}</span></td>
                <td className="num">{pesos(p.amount, p.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ── Ajustes ───────────────────────────────────────────────────────
function SettingsAdmin() {
  const [mode, setMode] = useState(null)
  const [rate, setRate] = useState(30)
  const [notice, show] = useNotice()
  useEffect(() => {
    backend.getSettings().then((s) => { setMode(s.payments_mode || 'simulado'); setRate(Math.round(Number(s.affiliate_rate ?? 0.3) * 100)) }).catch((e) => show('error', e.message))
  }, [])
  const saveRate = async (e) => {
    e.preventDefault()
    if (!(rate >= 0 && rate <= 80)) return show('error', 'La comisión debe estar entre 0 % y 80 %.')
    try { await backend.adminSaveSettings({ affiliate_rate: rate / 100 }); show('ok', 'Comisión guardada.') } catch (e2) { show('error', e2.message) }
  }

  const change = async (value) => {
    try { await backend.adminSaveSettings({ payments_mode: value }); setMode(value); show('ok', 'Ajuste guardado.') } catch (e) { show('error', e.message) }
  }
  if (!mode) return <p className="muted">Cargando…</p>
  return (
    <section className="admin-panel settings">
      <h2>Pagos</h2>
      {notice}
      <label className="radio">
        <input type="radio" name="pay" checked={mode === 'simulado'} onChange={() => change('simulado')} />
        <span><strong>Pagos de prueba activos</strong>Cualquier usuario puede activar un curso con el botón de pago de prueba. Úsalo solo mientras pruebas.</span>
      </label>
      <label className="radio">
        <input type="radio" name="pay" checked={mode === 'real'} onChange={() => change('real')} />
        <span><strong>Pagos de prueba desactivados</strong>Nadie puede activar cursos gratis. Los accesos llegan por la pasarela de pagos o los das tú desde Usuarios.</span>
      </label>
      <h2>Afiliados</h2>
      <form className="rate-form" onSubmit={saveRate}>
        <label className="field">Comisión por venta (%)
          <input inputMode="numeric" value={rate} onChange={(e) => setRate(Number(e.target.value.replace(/\D/g, '') || 0))} />
        </label>
        <button className="btn btn-sm">Guardar</button>
      </form>
      <p className="hint">Se aplica a las ventas nuevas. Las comisiones ya registradas no cambian.</p>
    </section>
  )
}
