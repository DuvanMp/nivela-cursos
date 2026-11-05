// Arma los ejercicios de una lección a partir de su vocabulario y frases.
import { normalize, tokens } from './text.js'

export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const uniq = (arr) => [...new Set(arr)]

// n distractores del pool que no sean la respuesta (ni se parezcan al normalizar)
function distractors(pool, answer, n) {
  const a = normalize(answer)
  const seen = new Set([a])
  const out = []
  for (const x of shuffle(uniq(pool))) {
    const k = normalize(x)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(x)
    if (out.length === n) break
  }
  return out
}

const contentLessons = (course) => course.units.flatMap((u) => u.lessons).filter((l) => l.words)

// Repasos y examen no tienen vocabulario propio: lo toman de la unidad o del curso
export function materialize(lesson, course) {
  if (lesson.review) {
    const ls = lesson.unit.lessons.filter((l) => l.words)
    return { ...lesson, words: shuffle(ls.flatMap((l) => l.words)).slice(0, 6), sentences: shuffle(ls.flatMap((l) => l.sentences)).slice(0, 3) }
  }
  if (lesson.exam) {
    const ls = contentLessons(course)
    return { ...lesson, words: shuffle(ls.flatMap((l) => l.words)).slice(0, 10), sentences: shuffle(ls.flatMap((l) => l.sentences)).slice(0, 6) }
  }
  return lesson
}

export function buildLesson(rawLesson, course) {
  const lesson = materialize(rawLesson, course)
  const lessons = contentLessons(course)
  const poolEn = lessons.flatMap((l) => l.words.map((w) => w[0]))
  const poolEs = lessons.flatMap((l) => l.words.map((w) => w[1]))
  const poolSentEs = lessons.flatMap((l) => l.sentences.map((s) => s[1]))
  const poolTokens = uniq(lessons.flatMap((l) => l.sentences.flatMap((x) => tokens(x[0]))))
  const sameLessonEn = lesson.words.map((w) => w[0])
  const sameLessonEs = lesson.words.map((w) => w[1])

  // Prefiere distractores de la misma lección (más difíciles), completa con el resto del curso
  const optsFrom = (local, pool, answer) => {
    const near = distractors(local, answer, 3)
    const far = distractors(pool.filter((x) => !near.some((n) => normalize(n) === normalize(x))), answer, 3 - near.length)
    return shuffle([answer, ...near, ...far])
  }

  const w = shuffle(lesson.words)
  const s = shuffle(lesson.sentences)
  let k = 0
  const id = () => `${rawLesson.id}-${k++}`

  const choose = ([en, es]) => ({ id: id(), type: 'choose', prompt: `¿Cómo se dice «${es}»?`, options: optsFrom(sameLessonEn, poolEn, en), answer: en, say: en })
  const listen = ([en, es]) => ({ id: id(), type: 'listen', prompt: 'Escucha y elige lo que significa', say: en, options: optsFrom(sameLessonEs, poolEs, es), answer: es })
  const typeIt = ([en, es]) => ({ id: id(), type: 'type', prompt: `Escribe en inglés: «${es}»`, answer: en, say: en })
  const build = ([en, es]) => {
    const own = tokens(en)
    const ownNorm = own.map(normalize)
    const extra = shuffle(poolTokens)
      .filter((t) => !ownNorm.includes(normalize(t)))
      .filter((t, i, arr) => arr.findIndex((x) => normalize(x) === normalize(t)) === i)
      .slice(0, Math.min(3, Math.max(2, 8 - own.length)))
    return { id: id(), type: 'build', prompt: es, bank: shuffle([...own, ...extra]), answer: en, say: en }
  }
  const meaning = ([en, es]) => ({ id: id(), type: 'meaning', prompt: '¿Qué significa?', text: en, say: en, options: shuffle([es, ...distractors(poolSentEs, es, 2)]), answer: es })
  const match = (pairs) => ({ id: id(), type: 'match', prompt: 'Une cada palabra con su significado', pairs })

  const ex = []
  if (rawLesson.tip) ex.push({ id: id(), type: 'tip', ...rawLesson.tip })

  if (rawLesson.exam) {
    ex.push(choose(w[0]), listen(w[1]), build(s[0]), choose(w[2]), meaning(s[1]), match(w.slice(3, 7)), listen(w[7]), build(s[2]), typeIt(w[8]), choose(w[9]), build(s[3]), meaning(s[4]), typeIt(w[4]), build(s[5]))
    return ex
  }

  ex.push(choose(w[0]), choose(w[1]), listen(w[2]), match(w.slice(0, 4)))
  if (s[0]) ex.push(build(s[0]))
  ex.push(choose(w[4] || w[3]))
  if (s[1]) ex.push(meaning(s[1]), build(s[1]))
  ex.push(listen(w[5] || w[1]), typeIt(w[0]))
  if (s[2]) ex.push(build(s[2]))
  ex.push(typeIt(w[2]))
  return ex
}

// ¿La respuesta es correcta?
export function check(ex, response) {
  switch (ex.type) {
    case 'choose':
    case 'listen':
    case 'meaning':
      return response === ex.answer
    case 'build':
      return Array.isArray(response) && normalize(response.join(' ')) === normalize(ex.answer)
    case 'type':
      return normalize(ex.answer) === normalize(response || '')
    case 'match':
    case 'tip':
      return true
    default:
      return false
  }
}
