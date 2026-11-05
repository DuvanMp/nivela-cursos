// Utilidades sobre el contenido de un curso (sin incluir el contenido)
export const EXAM_MAX_MISTAKES = 3

export const allLessons = (content) => content.units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })))
