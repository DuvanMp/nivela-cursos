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
  return shuffle(uniq(pool).filter((x) => normalize(x) !== a)).slice(0, n)
}

export function buildLesson(lesson, course) {
  const lessons = course.units.flatMap((u) => u.lessons)
  const poolEn = lessons.flatMap((l) => l.words.map((w) => w[0]))
  const poolEs = lessons.flatMap((l) => l.words.map((w) => w[1]))
  const poolSentEs = lessons.flatMap((l) => l.sentences.map((s) => s[1]))
  const sameLessonEn = lesson.words.map((w) => w[0])
  const sameLessonEs = lesson.words.map((w) => w[1])

  // Prefiere distractores de la misma lección (más difíciles), completa con el resto del curso
  const optsFrom = (local, pool, answer) => {
    const near = distractors(local, answer, 3)
    const far = distractors(pool.filter((x) => !near.includes(x)), answer, 3 - near.length)
    return shuffle([answer, ...near, ...far])
  }

  const w = shuffle(lesson.words)
  const s = shuffle(lesson.sentences)
  const ex = []
  let k = 0
  const id = () => `${lesson.id}-${k++}`

  const choose = ([en, es]) => ({ id: id(), type: 'choose', prompt: `¿Cómo se dice «${es}»?`, options: optsFrom(sameLessonEn, poolEn, en), answer: en, say: en })
  const listen = ([en, es]) => ({ id: id(), type: 'listen', prompt: 'Escucha y elige lo que significa', say: en, options: optsFrom(sameLessonEs, poolEs, es), answer: es })
  const typeIt = ([en, es, alts = []]) => ({ id: id(), type: 'type', prompt: `Escribe en inglés: «${es}»`, answer: en, alts, say: en })
  const build = ([en, es]) => {
    const own = tokens(en)
    const ownNorm = own.map(normalize)
    const extra = shuffle(uniq(lessons.flatMap((l) => l.sentences.flatMap((x) => tokens(x[0])))))
      .filter((t) => !ownNorm.includes(normalize(t)))
      .slice(0, Math.min(3, Math.max(2, 8 - own.length)))
    return { id: id(), type: 'build', prompt: es, bank: shuffle([...own, ...extra]), answer: en, say: en }
  }
  const meaning = ([en, es]) => ({ id: id(), type: 'meaning', prompt: '¿Qué significa?', text: en, say: en, options: shuffle([es, ...distractors(poolSentEs, es, 2)]), answer: es })
  const match = (pairs) => ({ id: id(), type: 'match', prompt: 'Une cada palabra con su significado', pairs })

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
      return [ex.answer, ...(ex.alts || [])].some((a) => normalize(a) === normalize(response || ''))
    case 'match':
      return true
    default:
      return false
  }
}

// Texto de la respuesta correcta para mostrar cuando el usuario se equivoca
export const solution = (ex) => ex.answer
