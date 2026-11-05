// Pruebas de la lógica (sin navegador): npm test
import assert from 'node:assert/strict'
import { inglesA1, allLessons } from '../data/ingles-a1.js'
import { buildLesson, check } from './exercises.js'
import { normalize, tokens } from './text.js'
import { completeLesson, currentStreak, emptyProgress, lessonState, percent, starsFor } from './progress.js'

// Normalización
assert.equal(normalize("I'm fine!"), 'i am fine')
assert.equal(normalize('  Thank   You. '), 'thank you')
assert.equal(normalize('¿Cómo estás?'), 'como estas')
assert.equal(normalize("I don’t like milk"), 'i do not like milk')

// Cada lección arma ejercicios válidos (se repite por el azar)
const lessons = allLessons(inglesA1)
assert.equal(lessons.length, 12)
for (let round = 0; round < 40; round++) {
  for (const l of lessons) {
    assert.equal(l.words.length, 6, `${l.id} debe tener 6 palabras`)
    const ex = buildLesson(l, inglesA1)
    assert.ok(ex.length >= 10, `${l.id}: pocos ejercicios`)
    for (const e of ex) {
      if (e.options) {
        assert.ok(e.options.includes(e.answer), `${e.id}: falta la respuesta`)
        assert.equal(new Set(e.options.map(normalize)).size, e.options.length, `${e.id}: opciones repetidas ${e.options}`)
        assert.ok(e.options.length >= 3, `${e.id}: pocas opciones`)
        assert.ok(check(e, e.answer))
        assert.ok(!check(e, e.options.find((o) => o !== e.answer)))
      }
      if (e.type === 'build') {
        const need = tokens(e.answer)
        const bank = [...e.bank]
        for (const t of need) { const k = bank.indexOf(t); assert.ok(k >= 0, `${e.id}: falta "${t}" en el banco`); bank.splice(k, 1) }
        assert.ok(check(e, need))
        assert.ok(!check(e, [...need].reverse()) || need.length === 1)
      }
      if (e.type === 'type') {
        assert.ok(check(e, e.answer.toUpperCase() + ' '))
        assert.ok(!check(e, 'zzz'))
      }
      if (e.type === 'match') assert.equal(new Set(e.pairs.map((p) => p[1])).size, 4)
    }
  }
}

// Las palabras en español no se repiten dentro del curso (si no, una opción "incorrecta" sería correcta)
const es = lessons.flatMap((l) => l.words.map((w) => normalize(w[1])))
assert.equal(new Set(es).size, es.length, 'palabras en español repetidas')
const en = lessons.flatMap((l) => l.words.map((w) => normalize(w[0])))
assert.equal(new Set(en).size, en.length, 'palabras en inglés repetidas')

// Progreso, desbloqueo y racha
const ids = lessons.map((l) => l.id)
let p = emptyProgress()
assert.equal(lessonState(ids, p, ids[0]), 'current')
assert.equal(lessonState(ids, p, ids[1]), 'locked')
p = completeLesson(p, ids[0], 0, '2026-11-03')
assert.equal(p.completed[ids[0]].stars, 3)
assert.equal(p.xp, 15)
assert.equal(lessonState(ids, p, ids[1]), 'current')
p = completeLesson(p, ids[1], 4, '2026-11-04')
assert.equal(p.streak.count, 2)
assert.equal(p.completed[ids[1]].stars, 1)
p = completeLesson(p, ids[1], 0, '2026-11-04') // repetir mejora estrellas, misma racha
assert.equal(p.completed[ids[1]].stars, 3)
assert.equal(p.streak.count, 2)
assert.equal(currentStreak(p, '2026-11-05'), 2)
assert.equal(currentStreak(p, '2026-11-07'), 0)
p = completeLesson(p, ids[2], 0, '2026-11-08')
assert.equal(p.streak.count, 1)
assert.equal(percent(ids, p), 25)
assert.equal(starsFor(2), 2)

console.log('✓ Todas las pruebas pasaron')
