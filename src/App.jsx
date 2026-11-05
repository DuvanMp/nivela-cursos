import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Store from './pages/Store.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Login from './pages/Login.jsx'
import Checkout from './pages/Checkout.jsx'
import CoursePath from './pages/CoursePath.jsx'
import Lesson from './pages/Lesson.jsx'
import MyCourses from './pages/MyCourses.jsx'
import { useAuth } from './lib/auth.jsx'

// Pide sesión iniciada; si no, manda a /entrar y vuelve después
export function RequireUser({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <p className="loading">Cargando…</p>
  if (!user) return <Navigate to={`/entrar?next=${encodeURIComponent(loc.pathname)}`} replace />
  return children
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const inLesson = pathname.includes('/leccion/')
  return (
    <>
      {!inLesson && <Header />}
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/curso/:slug" element={<CourseDetail />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/pagar/:slug" element={<RequireUser><Checkout /></RequireUser>} />
        <Route path="/mis-cursos" element={<RequireUser><MyCourses /></RequireUser>} />
        <Route path="/aprender/:slug" element={<RequireUser><CoursePath /></RequireUser>} />
        <Route path="/aprender/:slug/leccion/:lessonId" element={<RequireUser><Lesson /></RequireUser>} />
        <Route path="*" element={<main className="wrap empty"><h1>Esta página no existe</h1><a className="btn" href="/">Ver cursos</a></main>} />
      </Routes>
      {!inLesson && <Footer />}
    </>
  )
}
