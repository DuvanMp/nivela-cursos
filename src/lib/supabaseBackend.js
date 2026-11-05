// MODO REAL: cuentas y progreso en Supabase (gratis hasta cierto uso).
// Se activa solo si existen VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
// Las tablas y permisos están en supabase/schema.sql.
import { createClient } from '@supabase/supabase-js'

const MENSAJES = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese correo. Entra con tu contraseña.',
  'Email not confirmed': 'Confirma tu correo con el enlace que te enviamos y vuelve a entrar.',
  'Password should be at least 6 characters.': 'La contraseña debe tener al menos 6 caracteres.',
}
const fail = (error) => { throw new Error(MENSAJES[error.message] || error.message) }

const toUser = (u) => (u ? { id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] } : null)

export function createSupabaseBackend(url, anonKey) {
  const sb = createClient(url, anonKey)

  return {
    mode: 'supabase',

    onAuthChange(cb) {
      // Emite también la sesión inicial (INITIAL_SESSION)
      const { data } = sb.auth.onAuthStateChange((_event, session) => cb(toUser(session?.user)))
      return () => data.subscription.unsubscribe()
    },

    async signUp({ name, email, password }) {
      const { data, error } = await sb.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } })
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

    async getPurchases(user) {
      const { data, error } = await sb.from('purchases').select('course_id').eq('user_id', user.id)
      if (error) fail(error)
      return data.map((r) => r.course_id)
    },

    // Pago simulado. Con pasarela real, esta fila la crea el servidor
    // cuando la pasarela confirma el pago (webhook), no el navegador.
    async purchase(user, courseId) {
      const { error } = await sb.from('purchases').upsert({ user_id: user.id, course_id: courseId, status: 'simulado' })
      if (error) fail(error)
    },

    async getProgress(user, courseId) {
      const { data, error } = await sb.from('progress').select('data').eq('user_id', user.id).eq('course_id', courseId).maybeSingle()
      if (error) fail(error)
      return data?.data || null
    },

    async saveProgress(user, courseId, progress) {
      const { error } = await sb.from('progress').upsert({ user_id: user.id, course_id: courseId, data: progress, updated_at: new Date().toISOString() })
      if (error) fail(error)
    },
  }
}
