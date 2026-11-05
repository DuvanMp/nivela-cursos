// MODO DEMO: cuentas, compras y progreso guardados en este navegador (localStorage).
// Sirve para probar todo sin servidor. Para cuentas reales entre dispositivos,
// configura Supabase (ver README) y este archivo deja de usarse.
const KEY = 'nivela-demo-v1'
const empty = () => ({ users: {}, session: null, purchases: {}, progress: {} })

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || empty() } catch { return empty() }
}
const save = (db) => {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* modo privado: no se guarda */ }
}

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const publicUser = (u) => (u ? { id: u.id, email: u.email, name: u.name } : null)
const listeners = new Set()
const emit = () => {
  const db = load()
  const u = publicUser(db.users[db.session])
  listeners.forEach((cb) => cb(u))
}

export const demoBackend = {
  mode: 'demo',

  onAuthChange(cb) {
    listeners.add(cb)
    const db = load()
    cb(publicUser(db.users[db.session]))
    return () => listeners.delete(cb)
  },

  async signUp({ name, email, password }) {
    const db = load()
    const key = email.trim().toLowerCase()
    if (db.users[key]) throw new Error('Ya existe una cuenta con ese correo. Entra con tu contraseña.')
    db.users[key] = { id: crypto.randomUUID(), name: name.trim(), email: key, pass: await hash(password) }
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

  async getPurchases(user) {
    return load().purchases[user.id] || []
  },

  // Pago simulado: concede el acceso de inmediato
  async purchase(user, courseId) {
    const db = load()
    db.purchases[user.id] = [...new Set([...(db.purchases[user.id] || []), courseId])]
    save(db)
  },

  async getProgress(user, courseId) {
    return load().progress[user.id]?.[courseId] || null
  },

  async saveProgress(user, courseId, data) {
    const db = load()
    db.progress[user.id] = { ...(db.progress[user.id] || {}), [courseId]: data }
    save(db)
  },
}
