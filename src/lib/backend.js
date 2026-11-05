// Elige dónde se guardan cuentas, compras y progreso:
//  - Sin variables de Supabase → modo demo (navegador)
//  - Con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY → Supabase (cuentas reales)
import { demoBackend } from './demoBackend.js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const useSupabase = Boolean(url && key)

let impl = useSupabase ? null : demoBackend
const get = async () => {
  if (!impl) impl = (await import('./supabaseBackend.js')).createSupabaseBackend(url, key)
  return impl
}
const call = (name) => async (...args) => (await get())[name](...args)

export const backend = {
  mode: useSupabase ? 'supabase' : 'demo',
  onAuthChange(cb) {
    let off = () => {}
    let cancelled = false
    get().then((b) => { if (!cancelled) off = b.onAuthChange(cb) })
    return () => { cancelled = true; off() }
  },
  signUp: call('signUp'),
  signIn: call('signIn'),
  signOut: call('signOut'),
  getPurchases: call('getPurchases'),
  purchase: call('purchase'),
  getProgress: call('getProgress'),
  saveProgress: call('saveProgress'),
}

// Pagos: 'simulado' concede el acceso con un botón. Cuando conectes una
// pasarela (Wompi, Mercado Pago, etc.), cambia esto y el flujo de /pagar.
export const PAYMENTS_MODE = 'simulado'
