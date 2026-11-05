// Pruebas de la lógica (sin navegador): npm test
import assert from 'node:assert/strict'
import { inglesA1 } from '../data/ingles-a1.js'
import { allLessons } from './courseUtils.js'
import { buildLesson, check } from './exercises.js'
import { normalize, tokens } from './text.js'
import { completeLesson, currentStreak, emptyProgress, lessonState, percent, starsFor } from './progress.js'

// Normalización
assert.equal(normalize("I'm fine!"), 'i am fine')
assert.equal(normalize('  Thank   You. '), 'thank you')
assert.equal(normalize('¿Cómo estás?'), 'como estas')
assert.equal(normalize("I don’t like milk"), 'i do not like milk')

// Cada curso arma ejercicios válidos (se repite por el azar)
const { seedContent } = await import('../data/seedData.js')
for (const [slug, content] of Object.entries(seedContent)) {
  const all = allLessons(content)
  assert.equal(new Set(all.map((l) => l.id)).size, all.length, `${slug}: ids de lección repetidos`)
  const lang = all.filter((l) => l.words)
  for (const l of lang) {
    assert.equal(l.words.length, 6, `${l.id} debe tener 6 palabras`)
    assert.equal(l.sentences.length, 3, `${l.id} debe tener 3 frases`)
    if (l.dialogue) assert.ok(l.dialogue.length >= 3 && l.dialogue.every((d) => d.length === 3), `${l.id}: diálogo mal formado`)
  }
  // En un curso de idioma las palabras no se repiten (si no, una opción "incorrecta" sería correcta)
  const es = lang.flatMap((l) => l.words.map((w) => normalize(w[1])))
  assert.equal(new Set(es).size, es.length, `${slug}: palabras en español repetidas ${es.filter((x, i) => es.indexOf(x) !== i)}`)
  const en = lang.flatMap((l) => l.words.map((w) => normalize(w[0])))
  assert.equal(new Set(en).size, en.length, `${slug}: palabras en inglés repetidas ${en.filter((x, i) => en.indexOf(x) !== i)}`)

  const rounds = lang.length ? 8 : 2
  for (let round = 0; round < rounds; round++) {
    for (const l of all) {
      const ex = buildLesson(l, content)
      assert.ok(ex.length >= (l.words || l.review || l.exam ? 10 : 1), `${l.id}: pocos ejercicios`)
      if (l.tip) assert.equal(ex[0].type, 'tip')
      for (const e of ex) {
        if (e.options) {
          assert.ok(e.options.includes(e.answer), `${e.id}: falta la respuesta`)
          assert.equal(new Set(e.options.map(normalize)).size, e.options.length, `${e.id}: opciones repetidas ${e.options}`)
          assert.ok(e.options.length >= 2, `${e.id}: pocas opciones`)
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
  console.log(`  ${slug}: ${content.units.length} unidades, ${all.length} lecciones${lang.length ? `, ${lang.length * 6} palabras` : ''}`)
}

// Cada ejercicio de las rutinas existe en la biblioteca y tiene figura animada
const { EJERCICIOS } = await import('../data/ejercicios.js')
for (const [id, e] of Object.entries(EJERCICIOS)) assert.equal(e.frames.length, 2, `${id}: necesita 2 posiciones`)
for (const content of Object.values(seedContent)) {
  for (const l of allLessons(content)) {
    for (const b of l.blocks || []) {
      if (b.type === 'workout') for (const it of b.items) assert.ok(EJERCICIOS[it.ex], `${l.id}: ejercicio desconocido ${it.ex}`)
    }
    for (const q of l.quiz || []) assert.ok(q.options.includes(q.answer), `${l.id}: respuesta fuera de las opciones`)
  }
}

const lessons = allLessons(inglesA1).filter((l) => l.words)

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
assert.equal(percent(ids, p), Math.round((3 / ids.length) * 100))
assert.equal(starsFor(2), 2)

console.log('✓ Todas las pruebas pasaron')
