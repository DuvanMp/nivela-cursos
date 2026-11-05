// MODO DEMO: usuarios, roles, cursos, compras y progreso guardados en este
// navegador (localStorage). Imita las reglas de la base de datos real para que
// puedas probar todo, incluido el panel de administración, sin servidor.
// El PRIMER usuario que se registra queda como administrador.
// Para cuentas reales entre dispositivos usa Supabase (ver README).
import { seedBundles, seedContent, seedCourses } from '../data/seedData.js'

const KEY = 'nivela-demo-v3'
const ACTIVE = ['pagado', 'simulado', 'cortesia']
const empty = () => ({ users: {}, session: null, purchases: [], progress: {}, courses: seedCourses, bundles: seedBundles, settings: { payments_mode: 'simulado', affiliate_rate: 0.3 } })

const load = () => {
  try { return { ...empty(), ...(JSON.parse(localStorage.getItem(KEY)) || {}) } } catch { return empty() }
}
const save = (db) => {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* modo privado: no se guarda */ }
}

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const publicUser = (u) => (u ? { id: u.id, email: u.email, name: u.name, role: u.role, ref_code: u.ref_code } : null)
const randomCode = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8)
const current = (db) => db.users[db.session] || null
const listeners = new Set()
const emit = () => {
  const u = publicUser(current(load()))
  listeners.forEach((cb) => cb(u))
}

// Mismas reglas que en el servidor
const requireUser = (db) => {
  const u = current(db)
  if (!u) throw new Error('Debes iniciar sesión.')
  return u
}
const requireAdmin = (db) => {
  const u = requireUser(db)
  if (u.role !== 'admin') throw new Error('Solo un administrador puede hacer esto.')
  return u
}
const hasAccess = (db, userId, slug) =>
  db.purchases.some((p) => p.user_id === userId && p.course_slug === slug && ACTIVE.includes(p.status))

// Registra compras con la comisión del afiliado (igual que register_purchase en la base de datos)
function register(db, u, items, bundleSlug, ref) {
  const aff = ref ? Object.values(db.users).find((x) => x.ref_code === ref && x.id !== u.id) : null
  const rate = db.settings.affiliate_rate ?? 0.3
  for (const [slug, price] of items) {
    if (db.purchases.some((p) => p.user_id === u.id && p.course_slug === slug)) continue
    db.purchases.push({
      id: crypto.randomUUID(), user_id: u.id, course_slug: slug, status: 'simulado', amount: price, currency: 'COP',
      bundle_slug: bundleSlug, affiliate_id: aff?.id || null, commission: aff ? Math.round(price * rate) : 0,
      commission_status: aff ? 'prueba' : null, created_at: new Date().toISOString(),
    })
  }
}

export const demoBackend = {
  mode: 'demo',

  onAuthChange(cb) {
    listeners.add(cb)
    cb(publicUser(current(load())))
    return () => listeners.delete(cb)
  },

  async getProfile(user) {
    return publicUser(load().users[user.email])
  },

  async signUp({ name, email, password }) {
    const db = load()
    const key = email.trim().toLowerCase()
    if (db.users[key]) throw new Error('Ya existe una cuenta con ese correo. Entra con tu contraseña.')
    const first = Object.keys(db.users).length === 0
    db.users[key] = { id: crypto.randomUUID(), name: name.trim().slice(0, 80), email: key, role: first ? 'admin' : 'student', ref_code: randomCode(), pass: await hash(password), created_at: new Date().toISOString() }
    db.session = key
    save(db)
    emit()
    return { needsConfirmation: false }
  },

  async signIn({ email, password }) {
    const db = load()
    const key = email.trim().toLowerCase()
    const u = db.users[key]
    if (!u || u.pass !== (await hash(password))) throw new Error('Correo o contraseña incorrectos.')
    db.session = key
    save(db)
    emit()
  },

  async signOut() {
    const db = load()
    db.session = null
    save(db)
    emit()
  },

  // ── Catálogo y contenido ──
  async listCourses() {
    const db = load()
    const admin = current(db)?.role === 'admin'
    return db.courses.filter((c) => admin || c.status !== 'draft').sort((a, b) => a.sort - b.sort)
  },

  async getContent(slug) {
    const db = load()
    const u = requireUser(db)
    if (u.role !== 'admin' && !hasAccess(db, u.id, slug)) throw new Error('No tienes acceso a este curso.')
    return seedContent[slug] || null
  },

  async getSettings() {
    return load().settings
  },

  async listBundles() {
    const db = load()
    const admin = current(db)?.role === 'admin'
    return db.bundles.filter((b) => admin || b.status !== 'draft').sort((a, b) => a.sort - b.sort)
  },

  // Solo ventas reales: "Más vendido" y "estudiantes" no se inventan
  async courseStats() {
    const stats = {}
    for (const p of load().purchases) {
      const s = (stats[p.course_slug] ||= { course_slug: p.course_slug, students: 0, sales: 0 })
      if (['pagado', 'cortesia'].includes(p.status)) s.students++
      if (p.status === 'pagado') s.sales++
    }
    return Object.values(stats)
  },

  // ── Compras ──
  async getPurchases(user) {
    return load().purchases.filter((p) => p.user_id === user.id && ACTIVE.includes(p.status)).map((p) => p.course_slug)
  },

  async purchase(_user, slug, ref) {
    const db = load()
    const u = requireUser(db)
    if (db.settings.payments_mode !== 'simulado') throw new Error('Los pagos de prueba están desactivados.')
    const c = db.courses.find((x) => x.slug === slug && x.status === 'published')
    if (!c) throw new Error('Este curso no está disponible.')
    register(db, u, [[slug, c.price]], null, ref)
    save(db)
  },

  async purchaseBundle(_user, slug, ref) {
    const db = load()
    const u = requireUser(db)
    if (db.settings.payments_mode !== 'simulado') throw new Error('Los pagos de prueba están desactivados.')
    const b = db.bundles.find((x) => x.slug === slug && x.status === 'published')
    if (!b) throw new Error('Este paquete no está disponible.')
    if (b.courses.some((s) => !db.courses.find((c) => c.slug === s && c.status === 'published'))) throw new Error('Un curso del paquete no está disponible.')
    const missing = b.courses.filter((s) => !db.purchases.some((p) => p.user_id === u.id && p.course_slug === s))
    if (!missing.length) throw new Error('Ya tienes todos los cursos de este paquete.')
    const share = Math.floor(b.price / missing.length)
    register(db, u, missing.map((s, i) => [s, i === missing.length - 1 ? b.price - share * (missing.length - 1) : share]), slug, ref)
    save(db)
  },

  // ── Afiliados ──
  async getAffiliate(user) {
    const db = load()
    const u = Object.values(db.users).find((x) => x.id === user.id)
    const sales = db.purchases.filter((p) => p.affiliate_id === user.id && p.status !== 'reembolsado')
      .map(({ created_at, course_slug, amount, commission, commission_status }) => ({ created_at, course_slug, amount, commission, commission_status }))
    return { ref_code: u?.ref_code, rate: db.settings.affiliate_rate ?? 0.3, sales }
  },

  // ── Progreso ──
  async getProgress(user, slug) {
    return load().progress[user.id]?.[slug] || null
  },

  async saveProgress(_user, slug, data) {
    const db = load()
    const u = requireUser(db)
    if (!hasAccess(db, u.id, slug) && u.role !== 'admin') throw new Error('No tienes acceso a este curso.')
    db.progress[u.id] = { ...(db.progress[u.id] || {}), [slug]: data }
    save(db)
  },

  // ── Administración ──
  async adminSaveCourse(course) {
    const db = load()
    requireAdmin(db)
    const i = db.courses.findIndex((c) => c.slug === course.slug)
    if (i >= 0) db.courses[i] = { ...db.courses[i], ...course }
    else db.courses.push({ currency: 'COP', outline: [], sort: db.courses.length, ...course })
    save(db)
  },

  async adminListUsers() {
    const db = load()
    requireAdmin(db)
    return Object.values(db.users).map(({ id, email, name, role, created_at }) => ({ id, email, name, role, created_at }))
  },

  async adminSetRole(userId, role) {
    const db = load()
    const me = requireAdmin(db)
    if (me.id === userId) throw new Error('No puedes cambiar tu propio rol.')
    const u = Object.values(db.users).find((x) => x.id === userId)
    if (!u) throw new Error('Usuario no encontrado.')
    u.role = role
    save(db)
    emit()
  },

  async adminListPurchases() {
    const db = load()
    requireAdmin(db)
    return [...db.purchases].sort((a, b) => b.created_at.localeCompare(a.created_at))
  },

  async adminSetAccess(userId, slug, status, amount) {
    const db = load()
    requireAdmin(db)
    const p = db.purchases.find((x) => x.user_id === userId && x.course_slug === slug)
    if (p) { p.status = status; if (amount != null) p.amount = amount }
    else db.purchases.push({ id: crypto.randomUUID(), user_id: userId, course_slug: slug, status, amount: amount || 0, currency: 'COP', created_at: new Date().toISOString() })
    save(db)
  },

  async adminSaveBundle(bundle) {
    const db = load()
    requireAdmin(db)
    const i = db.bundles.findIndex((b) => b.slug === bundle.slug)
    if (i >= 0) db.bundles[i] = { ...db.bundles[i], ...bundle }
    else db.bundles.push({ currency: 'COP', sort: db.bundles.length, ...bundle })
    save(db)
  },

  async adminPayCommissions(affiliateId) {
    const db = load()
    requireAdmin(db)
    for (const p of db.purchases) if (p.affiliate_id === affiliateId && p.commission_status === 'pendiente') p.commission_status = 'pagada'
    save(db)
  },

  async adminSaveSettings(settings) {
    const db = load()
    requireAdmin(db)
    db.settings = { ...db.settings, ...settings }
    save(db)
  },
}
