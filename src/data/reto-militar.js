// Reto Militar 21 días: entrenamiento en casa con objetos que todos tenemos.
// Se genera para dos versiones (hombres y mujeres) con la misma estructura:
// 3 semanas (Recluta, Soldado, Comando) que suben de intensidad.
// Lecciones de tipo "lectura": bloques (misión, calentamiento, circuito,
// enfriamiento, consejo) y una mini prueba de técnica y seguridad.

const SEMANAS = [
  { id: 's1', title: 'Semana 1 · Recluta', goal: 'Aprende la técnica y crea el hábito. Intensidad suave.', color: 'olive', factor: 1, rounds: 3, rest: 60 },
  { id: 's2', title: 'Semana 2 · Soldado', goal: 'Más rondas y menos descanso. Tu cuerpo ya se está adaptando.', color: 'sand', factor: 1.25, rounds: 4, rest: 45 },
  { id: 's3', title: 'Semana 3 · Comando', goal: 'La semana más exigente. Termina el reto y supera tu prueba inicial.', color: 'ink', factor: 1.5, rounds: 4, rest: 30 },
]

// Enfoque de cada día de la semana (el día 7 es recuperación)
const ENFOQUES = {
  A: { nombre: 'Cuerpo completo', mision: 'Hoy trabajamos todo el cuerpo. Es la base de un buen soldado: fuerza en piernas, pecho, espalda y abdomen.' },
  B: { nombre: 'Piernas y glúteos', mision: 'Piernas fuertes para marchar lejos. Hoy la misión es tren inferior: controla cada repetición.' },
  C: { nombre: 'Pecho, hombros y brazos', mision: 'Brazos y hombros listos para cargar el equipo. Usa botellas y la mochila como tu armamento.' },
  D: { nombre: 'Abdomen y cardio', mision: 'Un abdomen firme protege tu espalda. Hoy combinamos core y cardio para quemar energía.' },
  E: { nombre: 'Circuito de combate', mision: 'Circuito largo y continuo. Mantén el ritmo y no te detengas más de lo indicado.' },
  F: { nombre: 'Intervalos de alta intensidad', mision: 'Trabajo corto e intenso. Da todo en cada intervalo y respira en los descansos.' },
}

const PLANES = {
  hombres: {
    A: [['sentadilla', 15], ['flexion', 10], ['remoMochila', 12], ['plancha', '30s'], ['tijera', 30]],
    B: [['zancada', '10c'], ['sentadilla', 20], ['puente', 15], ['talones', 20], ['pared', '30s']],
    C: [['flexion', 12], ['fondos', 12], ['pressBotellas', 15], ['remoMochila', 15], ['plancha', '30s']],
    D: [['abdominal', 15], ['escalador', 20], ['plancha', '40s'], ['rodillasArriba', '30s'], ['tijera', 30]],
    E: [['burpee', 8], ['sentadilla', 15], ['flexion', 10], ['zancada', '8c'], ['escalador', 20]],
    F: [['rodillasArriba', '30s'], ['burpee', 6], ['tijera', '40s'], ['escalador', '30s']],
  },
  mujeres: {
    A: [['sentadilla', 15], ['flexionRodillas', 8], ['remoMochila', 12], ['plancha', '25s'], ['tijera', 30]],
    B: [['zancada', '10c'], ['puente', 20], ['sentadilla', 15], ['pared', '30s'], ['talones', 20]],
    C: [['flexionRodillas', 10], ['fondos', 10], ['pressBotellas', 12], ['remoMochila', 12], ['plancha', '25s']],
    D: [['abdominal', 15], ['escalador', 16], ['plancha', '30s'], ['rodillasArriba', '30s'], ['puente', 15]],
    E: [['burpee', 6], ['sentadilla', 15], ['zancada', '8c'], ['flexionRodillas', 8], ['escalador', 16]],
    F: [['rodillasArriba', '30s'], ['burpee', 5], ['tijera', '40s'], ['escalador', '25s']],
  },
}

const CALENTAMIENTO = [['rodillasArriba', '60s'], ['tijera', 20], ['sentadilla', 10]]

const CONSEJOS = [
  ['Hidratación', 'Toma agua antes, durante y después de entrenar. Ten una botella cerca durante el circuito.'],
  ['Sueño', 'Dormir entre 7 y 9 horas es cuando tu cuerpo repara el músculo. El descanso también es entrenamiento.'],
  ['Comida real', 'Llena la mitad del plato con verduras, una porción de proteína (huevo, pollo, fríjol, pescado) y una de carbohidrato.'],
  ['Constancia', 'Vale más entrenar 20 minutos todos los días que 2 horas una vez a la semana.'],
  ['Postura', 'Si la técnica se daña por cansancio, haz menos repeticiones bien hechas. La calidad gana.'],
  ['Bebidas', 'Cambia gaseosas y jugos de caja por agua. Es de los cambios que más se notan.'],
  ['Respiración', 'Exhala en el esfuerzo (al subir) e inhala al bajar. Nunca aguantes la respiración.'],
  ['Pasos', 'Camina más en el día: escaleras en vez de ascensor, bájate una parada antes del bus.'],
  ['Antojos', 'Si te da hambre entre comidas, elige fruta, un huevo duro o un puñado de maníes.'],
  ['Registro', 'Anota cada día cómo te sentiste. Ver tu progreso escrito te motiva a seguir.'],
  ['Estiramiento', 'Estira 5 minutos después de entrenar: reduce la rigidez del día siguiente.'],
  ['Dolor normal', 'Sentir los músculos cansados al otro día es normal. Un dolor agudo en una articulación no lo es: para y consulta.'],
]

const PREGUNTAS = [
  { q: '¿Hacia dónde deben apuntar las rodillas en la sentadilla?', options: ['En la misma dirección de los pies', 'Hacia adentro', 'No importa'], answer: 'En la misma dirección de los pies', explain: 'Si las rodillas se van hacia adentro, se cargan las articulaciones y puedes lesionarte.' },
  { q: 'En la plancha, ¿cómo debe estar la cadera?', options: ['Alineada con hombros y talones', 'Bien arriba, en forma de V', 'Caída hacia el piso'], answer: 'Alineada con hombros y talones', explain: 'El cuerpo debe formar una línea recta, con abdomen y glúteos apretados.' },
  { q: '¿Cuándo se exhala en una flexión?', options: ['Al subir, en el esfuerzo', 'Al bajar', 'Se aguanta la respiración'], answer: 'Al subir, en el esfuerzo', explain: 'Exhalar en el esfuerzo te da más estabilidad y evita marearte.' },
  { q: 'Si sientes un dolor agudo o mareo, ¿qué haces?', options: ['Paro y descanso; si sigue, consulto al médico', 'Sigo hasta terminar la ronda', 'Lo hago más rápido para acabar'], answer: 'Paro y descanso; si sigue, consulto al médico', explain: 'Cansancio es normal; dolor agudo o mareo son señales para detenerse.' },
  { q: '¿Qué silla sirve para los fondos?', options: ['Una silla firme apoyada contra la pared', 'Una silla con ruedas', 'Cualquier silla plegable'], answer: 'Una silla firme apoyada contra la pared', explain: 'La silla no se puede mover: tu peso va sobre ella.' },
  { q: 'En la zancada, la rodilla de adelante…', options: ['No pasa mucho la punta del pie', 'Va lo más adelante posible', 'Se gira hacia adentro'], answer: 'No pasa mucho la punta del pie', explain: 'Así repartes el peso entre cadera y rodilla y la proteges.' },
  { q: '¿Para qué sirve el día de recuperación?', options: ['Para que el músculo se repare y se fortalezca', 'Para perder el ritmo', 'No sirve para nada'], answer: 'Para que el músculo se repare y se fortalezca', explain: 'El músculo se fortalece mientras descansa, no solo mientras entrenas.' },
  { q: '¿Por qué se calienta antes de entrenar?', options: ['Prepara músculos y articulaciones y reduce lesiones', 'Para cansarse antes', 'No es necesario'], answer: 'Prepara músculos y articulaciones y reduce lesiones', explain: 'Cinco minutos de calentamiento suben la temperatura del cuerpo y lo preparan.' },
  { q: '¿Cómo levantas la mochila en el remo?', options: ['Espalda recta, llevando los codos hacia atrás', 'Con la espalda curvada', 'Jalando con el cuello'], answer: 'Espalda recta, llevando los codos hacia atrás', explain: 'La fuerza sale de la espalda y los brazos, nunca de la espalda baja curvada.' },
  { q: 'Si una repetición te sale con mala técnica por cansancio…', options: ['Hago menos repeticiones, pero bien hechas', 'Sigo igual para cumplir el número', 'Lo hago más rápido'], answer: 'Hago menos repeticiones, pero bien hechas', explain: 'La técnica correcta es lo que da resultados y evita lesiones.' },
]

function cantidad(base, factor) {
  if (typeof base === 'number') return `${Math.round(base * factor)} repeticiones`
  const n = Number(base.replace(/\D/g, ''))
  if (base.endsWith('s')) return `${Math.round((n * factor) / 5) * 5} segundos`
  return `${Math.round(n * factor)} por pierna`
}

const circuito = (lista, factor) => lista.map(([ex, base]) => ({ ex, amount: cantidad(base, factor) }))

function preguntas(i) {
  return [PREGUNTAS[i % PREGUNTAS.length], PREGUNTAS[(i + 3) % PREGUNTAS.length]]
}

const ORDEN = ['A', 'B', 'C', 'D', 'E', 'F']

function briefing(version) {
  return {
    id: 'briefing',
    title: 'Instrucciones de la misión',
    kind: 'read',
    blocks: [
      { type: 'text', title: 'Bienvenido al reto', body: [
        'Durante 21 días vas a entrenar como en un campamento militar, pero desde tu casa y con objetos que ya tienes. Cada día tiene una misión de 20 a 35 minutos.',
        'El reto sube de intensidad cada semana: Recluta, Soldado y Comando. Los días 7 y 14 son de recuperación, y el día 1 y el 21 haces una prueba para comparar tu avance.',
      ] },
      { type: 'checklist', title: 'Tu equipo', items: ['Una silla firme (sin ruedas), apoyada contra la pared', 'Dos botellas de agua llenas de 1 a 1,5 litros', 'Una mochila con 3 o 4 libros', 'Una toalla o tapete', 'Una botella de agua para hidratarte', 'Ropa cómoda y tenis'] },
      { type: 'note', tone: 'safety', title: 'Antes de empezar', body: 'Si tienes una condición médica, una lesión, estás embarazada o llevas mucho tiempo sin hacer ejercicio, consulta a tu médico antes de iniciar. Si sientes dolor agudo, mareo o falta de aire fuera de lo normal, detente.' },
      { type: 'text', title: 'Cómo funciona cada día', body: [
        'Calentamiento de 3 ejercicios, después el circuito: haces cada ejercicio seguido, descansas al final y repites las rondas indicadas.',
        version === 'mujeres'
          ? 'Esta versión empieza las flexiones con rodillas apoyadas y le da más trabajo a piernas y glúteos. Si un ejercicio te queda fácil, haz la versión más difícil que se indica.'
          : 'Esta versión usa flexiones completas, fondos y burpees desde el principio. Si un ejercicio te queda muy difícil, haz la versión más fácil que se indica.',
      ] },
    ],
    quiz: [PREGUNTAS[3], PREGUNTAS[7]],
  }
}

function dia(n, semana, letra, version) {
  const enfoque = ENFOQUES[letra]
  const consejo = CONSEJOS[(n - 1) % CONSEJOS.length]
  const prueba = n === 1 || n === 21
  const blocks = [
    { type: 'text', title: `Misión del día ${n}`, body: [enfoque.mision] },
  ]
  if (prueba) {
    blocks.push({ type: 'checklist', title: n === 1 ? 'Prueba inicial: anota tus resultados' : 'Prueba final: compárala con el día 1', items: [
      `${version === 'mujeres' ? 'Flexiones con rodillas' : 'Flexiones'} seguidas en 1 minuto`,
      'Sentadillas en 1 minuto',
      'Segundos que aguantas la plancha',
      'Saltos de tijera en 1 minuto',
    ] })
  }
  blocks.push(
    { type: 'workout', title: 'Calentamiento', rounds: 1, rest: 0, items: circuito(CALENTAMIENTO, 1) },
    { type: 'workout', title: `Circuito: ${enfoque.nombre}`, rounds: semana.rounds, rest: semana.rest, items: circuito(PLANES[version][letra], semana.factor) },
    { type: 'text', title: 'Enfriamiento', body: ['Camina 2 minutos por la casa respirando profundo. Después estira piernas, pecho y espalda, 20 segundos cada uno.'] },
    { type: 'note', tone: 'tip', title: consejo[0], body: consejo[1] },
  )
  return { id: `dia-${n}`, title: prueba ? `Día ${n} · Prueba ${n === 1 ? 'inicial' : 'final'} y ${enfoque.nombre.toLowerCase()}` : `Día ${n} · ${enfoque.nombre}`, kind: 'read', workout: true, blocks, quiz: preguntas(n) }
}

function recuperacion(n) {
  return {
    id: `dia-${n}`,
    title: `Día ${n} · Recuperación activa`,
    kind: 'read',
    blocks: [
      { type: 'text', title: 'Misión: recuperar', body: ['Hoy no hay circuito. Camina de 20 a 30 minutos a paso rápido y luego estira con calma.', 'Revisa tu semana: ¿qué ejercicio te costó más? Mañana subimos de nivel.'] },
      { type: 'checklist', title: 'Estiramientos (30 segundos cada uno)', items: ['Cuádriceps: de pie, lleva el talón al glúteo', 'Isquiotibiales: pierna estirada en la silla, inclínate adelante', 'Pecho: mano en el marco de la puerta, gira el cuerpo', 'Espalda: de rodillas, estira los brazos adelante en el piso', 'Hombros: cruza un brazo frente al pecho'] },
      { type: 'note', tone: 'tip', title: 'Descansar también es entrenar', body: 'El músculo se fortalece mientras descansa. Duerme bien esta noche.' },
    ],
    quiz: [PREGUNTAS[6]],
  }
}

function crearReto(version) {
  let n = 0
  const units = SEMANAS.map((s, si) => {
    const lessons = []
    if (si === 0) lessons.push(briefing(version))
    for (let d = 0; d < 7; d++) {
      n++
      if (d === 6 && n !== 21) lessons.push(recuperacion(n))
      else lessons.push(dia(n, s, n === 21 ? 'A' : ORDEN[d], version))
    }
    return { id: s.id, title: s.title, goal: s.goal, color: s.color, lessons }
  })
  return {
    id: `reto-militar-${version}`,
    kind: 'standard',
    certNote: 'completando las 21 misiones de entrenamiento',
    units,
  }
}

export const retoHombres = crearReto('hombres')
export const retoMujeres = crearReto('mujeres')
