import { createContext } from 'react'

// Videos propios del sitio (archivos en public/videos/).
// No necesitan cambios en la base de datos: se agregan al mostrar la lección.

// Video al inicio de una lección: «curso/lección»
export const LESSON_VIDEOS = {
  'reto-militar-hombres/briefing': { src: '/videos/reto/instrucciones-hombres.mp4', poster: '/videos/reto/instrucciones-hombres.jpg', title: 'Instrucciones de la misión' },
  'reto-militar-mujeres/briefing': { src: '/videos/reto/instrucciones-mujeres.mp4', poster: '/videos/reto/instrucciones-mujeres.jpg', title: 'Instrucciones de la misión' },
}

// Ejercicios del Reto Militar que tienen video de técnica (public/videos/reto/ej-<clave>.mp4 y ej-<clave>-m.mp4)
const CLIPS = new Set(['sentadilla', 'flexion', 'flexionRodillas', 'zancada', 'plancha', 'fondos', 'escalador', 'tijera', 'burpee', 'puente', 'pressBotellas', 'remoMochila', 'talones', 'pared', 'abdominal', 'rodillasArriba'])
// La versión de mujeres usa los videos «-m» (con una mujer); la de hombres, los demás.
export const CourseContext = createContext('')
export function exerciseClip(key, courseSlug = '') {
  if (!CLIPS.has(key)) return null
  const name = /mujeres/.test(courseSlug) ? `ej-${key}-m` : `ej-${key}`
  return { src: `/videos/reto/${name}.mp4`, poster: `/videos/reto/${name}.jpg` }
}

// Pone el video antes del primer bloque de lectura de la lección
export function withLessonVideo(exercises, slug, lessonId) {
  const v = LESSON_VIDEOS[`${slug}/${lessonId}`]
  if (!v) return exercises
  let done = false
  return exercises.map((ex) => {
    if (done || ex.type !== 'read') return ex
    done = true
    return { ...ex, blocks: [{ type: 'video', ...v }, ...ex.blocks] }
  })
}
