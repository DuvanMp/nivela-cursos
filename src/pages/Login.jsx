import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function Login() {
  const { user, signIn, signUp, mode } = useAuth()
  const [params] = useSearchParams()
  const next = params.get('next') || '/mis-cursos'
  const navigate = useNavigate()
  const [tab, setTab] = useState('signup')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={next} replace />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo('')
    if (tab === 'signup' && !form.name.trim()) return setError('Escribe tu nombre.')
    if (tab === 'signup' && (form.password.length < 8 || !/[a-zA-Z]/.test(form.password) || !/\d/.test(form.password))) return setError('La contraseña debe tener al menos 8 caracteres, con letras y números.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Escribe un correo válido.')
    setBusy(true)
    try {
      if (tab === 'signup') {
        const r = await signUp(form)
        if (r?.needsConfirmation) { setInfo('Te enviamos un correo. Confirma tu cuenta con el enlace y luego entra aquí.'); setTab('signin'); return }
      } else {
        await signIn(form)
      }
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="wrap auth">
      <div className="auth-card">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'signup'} onClick={() => { setTab('signup'); setError('') }}>Crear cuenta</button>
          <button type="button" role="tab" aria-selected={tab === 'signin'} onClick={() => { setTab('signin'); setError('') }}>Entrar</button>
        </div>
        <form onSubmit={submit} noValidate>
          {tab === 'signup' && (
            <label className="field">Nombre
              <input value={form.name} onChange={set('name')} autoComplete="given-name" />
            </label>
          )}
          <label className="field">Correo
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
          </label>
          <label className="field">Contraseña
            <input type="password" value={form.password} onChange={set('password')} autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} required />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          {info && <p className="info" role="status">{info}</p>}
          <button className="btn btn-block" disabled={busy}>{busy ? 'Un momento…' : tab === 'signup' ? 'Crear cuenta' : 'Entrar'}</button>
        </form>
        {mode === 'demo' && <p className="hint">Modo demo: la cuenta se guarda solo en este navegador. No uses una contraseña real.</p>}
      </div>
    </main>
  )
}
