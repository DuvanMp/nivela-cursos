import { useEffect, useState } from 'react'
import { backend } from './backend.js'
import { useAuth } from './auth.jsx'
import { useCatalog } from './catalog.jsx'
import { emptyProgress } from './progress.js'

// Curso + contenido + progreso del usuario.
// status: 'loading' | 'no-course' | 'no-access' | 'no-content' | 'error' | 'ready'
export function useCourse(slug) {
  const { user, hasAccess, loading } = useAuth()
  const { bySlug, loading: catalogLoading } = useCatalog()
  const course = bySlug(slug)
  const [state, setState] = useState({ content: undefined, progress: null, error: '' })

  const allowed = !!course && hasAccess(slug)

  useEffect(() => {
    if (!user || !allowed) return
    let live = true
    setState({ content: undefined, progress: null, error: '' })
    Promise.all([backend.getContent(slug), backend.getProgress(user, slug)])
      .then(([content, progress]) => live && setState({ content: content || null, progress: progress || emptyProgress(), error: '' }))
      .catch((e) => live && setState({ content: null, progress: null, error: e.message }))
    return () => { live = false }
  }, [user?.id, slug, allowed])

  const save = async (next) => {
    setState((s) => ({ ...s, progress: next }))
    await backend.saveProgress(user, slug, next)
  }

  let status = 'ready'
  if (loading || catalogLoading) status = 'loading'
  else if (!course) status = 'no-course'
  else if (!allowed) status = 'no-access'
  else if (state.error) status = 'error'
  else if (state.content === undefined) status = 'loading'
  else if (!state.content) status = 'no-content'

  return { course, content: state.content, progress: state.progress, save, status, error: state.error }
}
