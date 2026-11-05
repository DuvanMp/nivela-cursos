// «Si empiezas hoy…»: arma el plan con fechas reales a partir del temario.
// Todo sale de las lecciones que el curso de verdad tiene; no promete resultados.

// Lecciones sugeridas por día según el tipo de curso
const PACE = { Inglés: 2 }
const PACE_TEXT = {
  Inglés: '2 lecciones de 5 minutos al día',
  Entrenamiento: '1 misión al día, con descanso activo los días 7 y 14',
}

// Frase principal de cada curso (la promesa es la actividad, no el resultado)
const HEADLINE = {
  'ingles-a1': 'Hoy mismo dices tus primeras frases en inglés',
  'ingles-m2': 'Esta semana practicas pedir en un restaurante en inglés',
  'ingles-m3': 'Prepara tu próximo viaje o entrevista en inglés',
  'reto-militar-hombres': 'Hoy haces tu prueba inicial. El día 21, la repites',
  'reto-militar-mujeres': 'Hoy haces tu prueba inicial. El día 21, la repites',
  'ventas-whatsapp': 'Esta semana dejas tu WhatsApp listo para vender',
  'ia-desde-cero': 'Hoy le haces tu primera petición bien hecha a la IA',
  'redes-digitales': 'Hoy eliges tu nicho y arrancas en orden',
}

const RETO = [
  { day: 1, text: 'Haces tu prueba inicial y tu primera misión, con objetos de tu casa.' },
  { day: 8, text: 'Empiezas la semana Soldado: más rondas y menos descanso.' },
  { day: 21, text: 'Repites la prueba del día 1 y comparas. Recibes tu certificado.' },
]

const addDays = (base, n) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + n)
export const fmtDay = (d) => new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
export const fmtShort = (d) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(d).replace('.', '')

export function startPlan(course, today = new Date()) {
  const units = (course?.outline || []).filter((u) => u.lessons > 0)
  if (!units.length) return null
  const reto = course.category === 'Entrenamiento'
  const pace = PACE[course.category] || 1
  const total = units.reduce((n, u) => n + u.lessons, 0)
  const days = reto ? 21 : Math.max(1, Math.ceil(total / pace))

  let steps
  if (reto) {
    steps = RETO
  } else {
    // Hoy: primera unidad · Mitad del camino: la unidad que empieza cerca de la mitad · Final: certificado
    let acc = 0
    const starts = units.map((u) => { const s = acc; acc += u.lessons; return s })
    let mid = units.findIndex((_, i) => starts[i] >= total / 2)
    if (mid <= 0) mid = Math.min(1, units.length - 1)
    const last = units[units.length - 1]
    const exam = /examen/i.test(last.title)
    steps = [{ day: 1, text: units[0].goal }]
    if (mid > 0 && mid < units.length - (exam ? 1 : 0)) {
      steps.push({ day: Math.floor(starts[mid] / pace) + 1, text: `${units[mid].title}: ${units[mid].goal.charAt(0).toLowerCase()}${units[mid].goal.slice(1)}` })
    }
    steps.push({ day: days, text: exam ? 'Presentas el examen final y recibes tu certificado.' : `Terminas «${last.title}» y recibes tu certificado.` })
  }

  return {
    headline: HEADLINE[course.slug] || `Empieza hoy y termina el ${fmtDay(addDays(today, days - 1))}`,
    pace: PACE_TEXT[course.category] || `1 lección al día de ${total} en total`,
    days,
    finish: addDays(today, days - 1),
    steps: steps.map((s) => ({ ...s, date: addDays(today, s.day - 1), when: s.day === 1 ? 'Hoy' : `Día ${s.day}` })),
  }
}
