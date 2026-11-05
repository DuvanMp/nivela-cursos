// Elige dónde se guardan usuarios, cursos, compras y progreso:
//  - Sin variables de Supabase → modo demo (navegador)
//  - Con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY → Supabase (cuentas reales)
// Los dos se cargan por separado: con Supabase, el contenido de los cursos
// NO viaja en el código de la página, solo llega a quien tiene acceso.

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY

let impl
const get = () => {
  if (!impl) {
    impl = URL_ && KEY_
      ? import('./supabaseBackend.js').then((m) => m.createSupabaseBackend(URL_, KEY_))
      : import('./demoBackend.js').then((m) => m.demoBackend)
  }
  return impl
}
const call = (name) => async (...args) => (await get())[name](...args)

const METHODS = [
  'getProfile', 'signUp', 'signIn', 'signOut', 'listCourses', 'getContent', 'getSettings',
  'getPurchases', 'purchase', 'purchaseBundle', 'getProgress', 'saveProgress', 'listBundles', 'courseStats', 'getAffiliate',
  'adminSaveCourse', 'adminSaveBundle', 'adminPayCommissions', 'adminListUsers', 'adminSetRole', 'adminListPurchases', 'adminSetAccess', 'adminSaveSettings',
]

export const backend = {
  mode: URL_ && KEY_ ? 'supabase' : 'demo',
  onAuthChange(cb) {
    let off = () => {}
    let cancelled = false
    get().then((b) => { if (!cancelled) off = b.onAuthChange(cb) })
    return () => { cancelled = true; off() }
  },
  ...Object.fromEntries(METHODS.map((m) => [m, call(m)])),
}
