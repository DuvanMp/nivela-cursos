// MODO REAL: usuarios, roles, cursos, compras y progreso en Supabase.
// Se activa solo si existen VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
// La seguridad la aplica la base de datos (supabase/schema.sql), no este archivo:
// aunque alguien modifique el código en su navegador, el servidor rechaza lo que no le corresponde.
import { createClient } from '@supabase/supabase-js'

const ACTIVE = ['pagado', 'simulado', 'cortesia']
const MENSAJES = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese correo. Entra con tu contraseña.',
  'Email not confirmed': 'Confirma tu correo con el enlace que te enviamos y vuelve a entrar.',
  'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
}
const fail = (error) => {
  const msg = error.message || ''
  if (/password/i.test(msg) && /(least|characters|weak)/i.test(msg)) throw new Error('La contraseña es muy débil. Usa al menos 8 caracteres, con letras y números.')
  if (/row-level security|permission denied/i.test(msg)) throw new Error('No tienes permiso para hacer esto.')
  throw new Error(MENSAJES[msg] || msg)
}

const toUser = (u) => (u ? { id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0], role: 'student' } : null)

export function createSupabaseBackend(url, anonKey) {
  const sb = createClient(url, anonKey)
  const q = async (promise) => {
    const { data, error } = await promise
    if (error) fail(error)
    return data
  }

  return {
    mode: 'supabase',

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_event, session) => cb(toUser(session?.user)))
      return () => data.subscription.unsubscribe()
    },

    // El rol se lee de la base de datos, no del token del navegador
    async getProfile(user) {
      const p = await q(sb.from('profiles').select('id, email, full_name, role, ref_code').eq('id', user.id).maybeSingle())
      return p ? { id: p.id, email: p.email, name: p.full_name || user.name, role: p.role, ref_code: p.ref_code } : user
    },

    async signUp({ name, email, password }) {
      const { data, error } = await sb.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim().slice(0, 80) } } })
      if (error) fail(error)
      return { needsConfirmation: !data.session }
    },

    async signIn({ email, password }) {
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
      if (error) fail(error)
    },

    async signOut() {
      await sb.auth.signOut()
    },

    // ── Catálogo y contenido ──
    listCourses: () => q(sb.from('courses').select('*').order('sort')),

    async getContent(slug) {
      const row = await q(sb.from('course_content').select('data').eq('course_slug', slug).maybeSingle())
      if (!row) throw new Error('No tienes acceso a este curso.')
      return row.data
    },

    listBundles: () => q(sb.from('bundles').select('*').order('sort')),

    courseStats: () => q(sb.rpc('course_stats')),

    async getSettings() {
      const rows = await q(sb.from('settings').select('key, value'))
      return Object.fromEntries(rows.map((r) => [r.key, r.value]))
    },

    // ── Compras ──
    async getPurchases(user) {
      const rows = await q(sb.from('purchases').select('course_slug, status').eq('user_id', user.id))
      return rows.filter((r) => ACTIVE.includes(r.status)).map((r) => r.course_slug)
    },

    // Pago de prueba: lo valida y registra el servidor con el precio de la base de datos
    async purchase(_user, slug, ref) {
      await q(sb.rpc('simulate_purchase', { p_slug: slug, p_ref: ref || null }))
    },

    async purchaseBundle(_user, slug, ref) {
      await q(sb.rpc('simulate_bundle_purchase', { p_slug: slug, p_ref: ref || null }))
    },

    // ── Afiliados ──
    async getAffiliate(user) {
      const [profile, sales, settings] = await Promise.all([
        q(sb.from('profiles').select('ref_code').eq('id', user.id).maybeSingle()),
        q(sb.rpc('my_affiliate_sales')),
        q(sb.from('settings').select('value').eq('key', 'affiliate_rate').maybeSingle()),
      ])
      return { ref_code: profile?.ref_code, rate: Number(settings?.value ?? 0.3), sales }
    },

    // ── Progreso ──
    async getProgress(user, slug) {
      const row = await q(sb.from('progress').select('data').eq('user_id', user.id).eq('course_slug', slug).maybeSingle())
      return row?.data || null
    },

    async saveProgress(user, slug, data) {
      await q(sb.from('progress').upsert({ user_id: user.id, course_slug: slug, data }))
    },

    // ── Administración (la base de datos verifica que seas admin) ──
    async adminSaveCourse(course) {
      const { slug, title, short, description, level, category, price, compare_at_price, badge, currency, color, cover, status, sort } = course
      await q(sb.from('courses').upsert({ slug, title, short, description, level, category, price, compare_at_price: compare_at_price || null, badge: badge || '', currency, color, cover, status, sort }))
    },

    async adminSaveBundle(bundle) {
      const { slug, title, short, price, currency, color, cover, status, courses, sort } = bundle
      await q(sb.from('bundles').upsert({ slug, title, short, price, currency, color, cover, status, courses, sort }))
    },

    async adminPayCommissions(affiliateId) {
      await q(sb.from('purchases').update({ commission_status: 'pagada' }).eq('affiliate_id', affiliateId).eq('commission_status', 'pendiente'))
    },

    async adminListUsers() {
      const rows = await q(sb.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }))
      return rows.map((r) => ({ id: r.id, email: r.email, name: r.full_name, role: r.role, created_at: r.created_at }))
    },

    async adminSetRole(userId, role) {
      await q(sb.from('profiles').update({ role }).eq('id', userId))
    },

    adminListPurchases: () => q(sb.from('purchases').select('*').order('created_at', { ascending: false })),

    async adminSetAccess(userId, slug, status, amount) {
      const row = { user_id: userId, course_slug: slug, status, provider: 'admin' }
      if (amount != null) row.amount = amount
      await q(sb.from('purchases').upsert(row, { onConflict: 'user_id,course_slug' }))
    },

    async adminSaveSettings(settings) {
      await q(sb.from('settings').upsert(Object.entries(settings).map(([key, value]) => ({ key, value }))))
    },
  }
}
