import { useAuth } from '../lib/auth.jsx'

export default function Footer() {
  const { mode } = useAuth()
  return (
    <footer className="foot wrap">
      <p>© {new Date().getFullYear()} Nivela. Los pagos están en modo de prueba: todavía no se hacen cobros reales.</p>
      {mode === 'demo' && <p>Modo demo: tu cuenta y tu progreso se guardan en este navegador.</p>}
      <p><a href="https://duvan-martinez.vercel.app/" target="_blank" rel="noreferrer">Sitio web por DM Software</a></p>
    </footer>
  )
}
