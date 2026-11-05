import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Nivela, inicio">
      <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--ultra)" />
        <rect x="14" y="36" width="10" height="14" rx="3" fill="var(--mango)" />
        <rect x="27" y="26" width="10" height="24" rx="3" fill="#fff" />
        <rect x="40" y="14" width="10" height="36" rx="3" fill="var(--mint)" />
      </svg>
      <span>nivela</span>
    </Link>
  )
}

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="top">
      <div className="wrap top-inner">
        <Logo />
        <nav className="top-nav" aria-label="Principal">
          <NavLink to="/" end>Cursos</NavLink>
          {user && <NavLink to="/mis-cursos">Mis cursos</NavLink>}
          {user ? (
            <button className="link-btn" onClick={async () => { await signOut(); navigate('/') }}>
              Salir <span className="who">({user.name})</span>
            </button>
          ) : (
            <Link to="/entrar" className="btn btn-sm">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
