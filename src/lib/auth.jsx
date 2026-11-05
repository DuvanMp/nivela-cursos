import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { backend } from './backend.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = cargando
  const [purchases, setPurchases] = useState(null)

  useEffect(() => backend.onAuthChange((u) => setUser(u)), [])

  // Las compras se cargan aparte (no dentro del aviso de sesión)
  useEffect(() => {
    if (user === undefined) return
    if (!user) { setPurchases([]); return }
    let live = true
    setPurchases(null)
    backend.getPurchases(user).then((p) => live && setPurchases(p)).catch(() => live && setPurchases([]))
    return () => { live = false }
  }, [user?.id])

  const purchase = useCallback(async (courseId) => {
    await backend.purchase(user, courseId)
    setPurchases((p) => [...new Set([...(p || []), courseId])])
  }, [user])

  const value = {
    user,
    loading: user === undefined || (user && purchases === null),
    purchases: purchases || [],
    hasAccess: (courseId) => (purchases || []).includes(courseId),
    signIn: backend.signIn,
    signUp: backend.signUp,
    signOut: backend.signOut,
    purchase,
    mode: backend.mode,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
