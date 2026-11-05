import CoverArt, { hasArt } from './CoverArt.jsx'

// Portada de cada curso. Prioridad:
//  1) la imagen que subió el administrador,
//  2) la ilustración propia del curso,
//  3) una portada de color con el texto (para cursos nuevos).
export default function CourseCover({ course, size = 'md' }) {
  return (
    <div className={`cover cover-${course.color} cover-${size}`} aria-hidden="true">
      {course.image ? (
        <img src={course.image} alt="" loading="lazy" decoding="async" draggable="false" />
      ) : hasArt(course.slug) ? (
        <CoverArt slug={course.slug} />
      ) : (
        <span>{course.cover}</span>
      )}
    </div>
  )
}
