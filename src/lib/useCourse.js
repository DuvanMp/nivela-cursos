import { useEffect, useState } from 'react'
import { courseBySlug } from '../data/courses.js'
import { backend } from './backend.js'
import { useAuth } from './auth.jsx'
import { emptyProgress } from './progress.js'

// Curso + progreso del usuario. status: 'loading' | 'no-course' | 'no-access' | 'ready' | 'error'
export function useCourse(slug) {
  const { user, hasAccess, loading } = useAuth()
  const course = courseBySlug(slug)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')

  const allowed = !!course?.content && hasAccess(slug)

  useEffect(() => {
    if (!user || !allowed) return
    let live = true
    backend.getProgress(user, slug)
      .then((p) => live && setProgress(p || emptyProgress()))
      .catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [user?.id, slug, allowed])

  const save = async (next) => {
    setProgress(next)
    await backend.saveProgress(user, slug, next)
  }

  let status = 'ready'
  if (!course?.content) status = 'no-course'
  else if (loading) status = 'loading'
  else if (!allowed) status = 'no-access'
  else if (error) status = 'error'
  else if (!progress) status = 'loading'

  return { course, progress, save, status, error }
}
