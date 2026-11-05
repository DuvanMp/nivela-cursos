import { useState } from 'react'
import CoverArt, { hasArt } from './CoverArt.jsx'
import { COVER_PHOTOS, photoUrl } from '../data/coverPhotos.js'

// Portada de cada curso. Prioridad:
//  1) la imagen que subió el administrador,
//  2) la foto del curso (src/data/coverPhotos.js), con su etiqueta,
//  3) la ilustración propia del curso (también si la foto no carga),
//  4) una portada de color con el texto (para cursos nuevos).
export default function CourseCover({ course, size = 'md' }) {
  const [broken, setBroken] = useState('')
  const photo = COVER_PHOTOS[course.slug]
  const sm = size === 'sm'

  let body
  if (course.image && broken !== course.image) {
    body = <img src={course.image} alt="" loading="lazy" decoding="async" draggable="false" onError={() => setBroken(course.image)} />
  } else if (photo && broken !== photo.src) {
    body = (
      <>
        <img
          src={photoUrl(photo.src, sm ? 160 : 960, sm)}
          srcSet={sm ? undefined : `${photoUrl(photo.src, 640)} 640w, ${photoUrl(photo.src, 960)} 960w, ${photoUrl(photo.src, 1440)} 1440w`}
          sizes={sm ? undefined : '(max-width: 700px) 100vw, 420px'}
          alt="" loading="lazy" decoding="async" draggable="false"
          onError={() => setBroken(photo.src)}
        />
        {!sm && <span className={`cover-label${photo.tone ? ` t-${photo.tone}` : ''}`}>{photo.label}</span>}
      </>
    )
  } else if (hasArt(course.slug)) {
    body = <CoverArt slug={course.slug} />
  } else {
    body = <span>{course.cover}</span>
  }

  return (
    <div className={`cover cover-${course.color} cover-${size}`} aria-hidden="true">
      {body}
    </div>
  )
}
