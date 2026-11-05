import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { backend } from './backend.js'
import { getRef } from './referral.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando
  const [profile, setProfile] = useState(null)
  const [purchases, setPurchases] = useState(null)

  useEffect(() => backend.onAuthChange((u) => setSession(u)), [])

  // Perfil (rol) y compras se cargan aparte, nunca dentro del aviso de sesión
  const refresh = useCallback(async (u) => {
    if (!u) { setProfile(null); setPurchases([]); return }
    const [p, buys] = await Promise.all([
      backend.getProfile(u).catch(() => u),
      backend.getPurchases(u).catch(() => []),
    ])
    setProfile(p)
    setPurchases(buys)
  }, [])

  useEffect(() => {
    if (session === undefined) return
    setProfile(null)
    setPurchases(null)
    refresh(session)
  }, [session?.id, refresh])

  const user = session && profile ? { ...session, ...profile } : session && !profile ? null : session
  const loading = session === undefined || (session && (profile === null || purchases === null))

  const purchase = useCallback(async (slug, { bundle = false } = {}) => {
    if (bundle) await backend.purchaseBundle(user, slug, getRef())
    else await backend.purchase(user, slug, getRef())
    setPurchases(await backend.getPurchases(user))
  }, [user?.id])

  const value = {
    user: loading ? null : user,
    loading,
    isAdmin: !loading && user?.role === 'admin',
    purchases: purchases || [],
    hasAccess: (slug) => user?.role === 'admin' || (purchases || []).includes(slug),
    signIn: backend.signIn,
    signUp: backend.signUp,
    signOut: backend.signOut,
    purchase,
    reloadAccount: () => refresh(session),
    mode: backend.mode,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
