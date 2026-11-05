// Portada tipográfica de cada curso (sin imágenes externas)
export default function CourseCover({ course, size = 'md' }) {
  return (
    <div className={`cover cover-${course.color} cover-${size}`} aria-hidden="true">
      <span>{course.cover}</span>
    </div>
  )
}
