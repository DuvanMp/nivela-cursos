import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

// Logo: doble chevrón «subir de nivel» con brillo naranja, y la «i» de nivela con una chispa
export function Logo() {
  const id = 'lg' + useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <Link to="/" className="logo" aria-label="Nivela, inicio">
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" className="logo-mark">
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7C6CFF" /><stop offset="1" stopColor="#2D3BE3" /></linearGradient>
          <radialGradient id={`${id}b`} cx=".85" cy=".1" r=".7"><stop offset="0" stopColor="#FFB020" stopOpacity=".75" /><stop offset="1" stopColor="#FFB020" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="64" height="64" rx="19" fill={`url(#${id}a)`} />
        <rect width="64" height="64" rx="19" fill={`url(#${id}b)`} />
        <path d="M18 46l14-12 14 12" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 31l14-12 14 12" fill="none" stroke="#FFD27A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-word" aria-hidden="true">
        n<span className="logo-i">ı<svg viewBox="0 0 20 20"><path d="M10 0c1 5.5 3.5 8 10 10-6.5 2-9 4.5-10 10-1-5.5-3.5-8-10-10C6.5 8 9 5.5 10 0z" fill="#FFB020" /></svg></span>vela
      </span>
    </Link>
  )
}

export default function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const [open, setOpen] = useState(false)

  // El menú del celular se cierra al cambiar de página o con la tecla Esc
  useEffect(() => { setOpen(false) }, [pathname, hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
    {open && <div className="menu-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    <header className={`top${open ? ' menu-open' : ''}`}>
      <div className="wrap top-inner">
        <Logo />
        <nav className="top-nav" id="menu-principal" aria-label="Principal">
          <NavLink to="/" end>Cursos</NavLink>
          {user && <NavLink to="/mis-cursos">Mis cursos</NavLink>}
          <NavLink to="/afiliados">Afiliados</NavLink>
          {isAdmin && <NavLink to="/admin">Administrar</NavLink>}
          {user ? (
            <button className="link-btn nav-out" onClick={async () => { setOpen(false); await signOut(); navigate('/') }}>
              Salir <span className="who">({user.name})</span>
            </button>
          ) : (
            <Link to="/entrar" className="btn btn-sm nav-enter">Entrar</Link>
          )}
        </nav>
        <div className="top-mobile">
          {!user && <Link to="/entrar" className="btn btn-sm">Entrar</Link>}
          <button className="menu-btn" aria-expanded={open} aria-controls="menu-principal" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
    </>
  )
}
