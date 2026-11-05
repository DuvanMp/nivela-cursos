// Progreso de un curso: lecciones completadas, XP y racha de días.
// Se guarda como un solo objeto JSON por usuario y curso.

export const emptyProgress = () => ({ completed: {}, xp: 0, streak: { count: 0, last: null } })

export const localDay = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

const prevDay = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

// Estrellas según errores: 0 → 3, 1-2 → 2, más → 1
export const starsFor = (mistakes) => (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1)
export const xpFor = (mistakes) => 10 + (mistakes === 0 ? 5 : 0)

export function completeLesson(progress, lessonId, mistakes, today = localDay()) {
  const p = progress || emptyProgress()
  const prev = p.completed[lessonId]
  const stars = Math.max(starsFor(mistakes), prev?.stars || 0)
  const last = p.streak.last
  const count = last === today ? p.streak.count : last === prevDay(today) ? p.streak.count + 1 : 1
  return {
    completed: { ...p.completed, [lessonId]: { stars, at: today } },
    xp: p.xp + xpFor(mistakes),
    streak: { count, last: today },
  }
}

// La racha se muestra en 0 si el último día de práctica fue antes de ayer
export function currentStreak(progress, today = localDay()) {
  const s = progress?.streak
  if (!s?.last) return 0
  return s.last === today || s.last === prevDay(today) ? s.count : 0
}

// Las lecciones se desbloquean en orden: cada una exige terminar la anterior
export function lessonState(lessonIds, progress, lessonId) {
  const done = progress?.completed || {}
  if (done[lessonId]) return 'done'
  const i = lessonIds.indexOf(lessonId)
  const prevDone = i <= 0 || !!done[lessonIds[i - 1]]
  return prevDone ? 'current' : 'locked'
}

export const percent = (lessonIds, progress) =>
  Math.round((lessonIds.filter((id) => progress?.completed?.[id]).length / lessonIds.length) * 100)
