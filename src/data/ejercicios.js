// Biblioteca de ejercicios del Reto Militar: cómo se hacen, con qué material
// de la casa y la figura animada (dos posiciones que se alternan).
// Cada pose usa coordenadas en un lienzo de 100 × 100 (el piso está en y = 90).
// video: pega aquí un enlace de YouTube cuando grabes el ejercicio (opcional).

const stand = {
  head: [50, 16], neck: [50, 24], hip: [50, 52],
  kneeA: [52, 71], footA: [52, 90], kneeB: [48, 71], footB: [48, 90],
  elbowA: [53, 38], handA: [53, 51], elbowB: [47, 38], handB: [47, 51],
}
const p = (changes) => ({ ...stand, ...changes })

export const EJERCICIOS = {
  sentadilla: {
    name: 'Sentadilla',
    material: 'Sin material',
    how: ['Pies al ancho de los hombros y puntas un poco hacia afuera.', 'Baja como si te sentaras en una silla, con el pecho arriba.', 'Las rodillas siguen la dirección de los pies.', 'Sube empujando el piso con los talones.'],
    safety: 'No dejes que las rodillas se vayan hacia adentro.',
    frames: [
      p({ elbowA: [60, 30], handA: [70, 30], elbowB: [58, 31], handB: [68, 31] }),
      p({ head: [56, 34], neck: [53, 41], hip: [38, 64], kneeA: [58, 68], footA: [52, 90], kneeB: [56, 69], footB: [50, 90], elbowA: [63, 44], handA: [75, 44], elbowB: [61, 45], handB: [73, 45] }),
    ],
  },
  flexion: {
    name: 'Flexión de pecho',
    material: 'Sin material (más fácil: manos apoyadas en una silla firme)',
    how: ['Manos un poco más abiertas que los hombros.', 'Cuerpo recto de la cabeza a los talones.', 'Baja el pecho hasta casi tocar el piso.', 'Sube empujando fuerte, exhalando.'],
    safety: 'No dejes caer la cadera ni levantes la cola.',
    frames: [
      { head: [84, 50], neck: [77, 55], hip: [46, 67], kneeA: [30, 75], footA: [14, 84], kneeB: [30, 75], footB: [14, 84], elbowA: [77, 71], handA: [77, 88], elbowB: [75, 71], handB: [75, 88] },
      { head: [84, 72], neck: [77, 76], hip: [46, 80], kneeA: [30, 83], footA: [14, 86], kneeB: [30, 83], footB: [14, 86], elbowA: [66, 72], handA: [77, 88], elbowB: [64, 72], handB: [75, 88] },
    ],
  },
  flexionRodillas: {
    name: 'Flexión con rodillas apoyadas',
    material: 'Toalla doblada bajo las rodillas',
    how: ['Rodillas en el piso sobre una toalla.', 'Cuerpo recto de la cabeza a las rodillas.', 'Baja el pecho controlando.', 'Sube empujando y exhalando.'],
    safety: 'Mantén el abdomen firme para no arquear la espalda.',
    frames: [
      { head: [82, 52], neck: [75, 57], hip: [48, 72], kneeA: [32, 88], footA: [18, 80], kneeB: [32, 88], footB: [18, 80], elbowA: [75, 72], handA: [75, 88], elbowB: [73, 72], handB: [73, 88] },
      { head: [82, 72], neck: [75, 76], hip: [48, 82], kneeA: [32, 88], footA: [18, 80], kneeB: [32, 88], footB: [18, 80], elbowA: [64, 73], handA: [75, 88], elbowB: [62, 73], handB: [73, 88] },
    ],
  },
  zancada: {
    name: 'Zancada',
    material: 'Sin material (más difícil: una botella en cada mano)',
    how: ['Da un paso largo hacia adelante.', 'Baja hasta que ambas rodillas formen un ángulo recto.', 'El tronco va derecho.', 'Vuelve empujando con la pierna de adelante y cambia de lado.'],
    safety: 'La rodilla de adelante no debe pasar mucho la punta del pie.',
    frames: [
      p({ elbowA: [56, 40], handA: [51, 50], elbowB: [44, 40], handB: [49, 50] }),
      p({ head: [50, 28], neck: [50, 36], hip: [50, 62], kneeA: [65, 64], footA: [66, 90], kneeB: [40, 84], footB: [27, 90], elbowA: [56, 50], handA: [51, 60], elbowB: [44, 50], handB: [49, 60] }),
    ],
  },
  plancha: {
    name: 'Plancha',
    material: 'Toalla o tapete',
    how: ['Antebrazos en el piso, codos bajo los hombros.', 'Cuerpo recto, abdomen y glúteos apretados.', 'Respira normal y aguanta el tiempo indicado.'],
    safety: 'Si te duele la espalda baja, apoya las rodillas.',
    frames: [
      { head: [82, 70], neck: [75, 74], hip: [45, 78], kneeA: [29, 83], footA: [13, 88], kneeB: [29, 83], footB: [13, 88], elbowA: [75, 88], handA: [88, 88], elbowB: [73, 88], handB: [86, 88] },
      { head: [82, 69], neck: [75, 73], hip: [45, 76], kneeA: [29, 82], footA: [13, 88], kneeB: [29, 82], footB: [13, 88], elbowA: [75, 88], handA: [88, 88], elbowB: [73, 88], handB: [86, 88] },
    ],
  },
  fondos: {
    name: 'Fondos en silla',
    material: 'Una silla firme apoyada contra la pared',
    how: ['Manos en el borde de la silla, dedos hacia adelante.', 'Piernas dobladas y pies firmes en el piso.', 'Baja doblando los codos hacia atrás.', 'Sube estirando los brazos.'],
    safety: 'Usa una silla que no se mueva. Nunca una con ruedas.',
    prop: 'chair',
    frames: [
      { head: [50, 30], neck: [48, 38], hip: [46, 60], kneeA: [66, 62], footA: [70, 90], kneeB: [64, 62], footB: [68, 90], elbowA: [42, 49], handA: [38, 60], elbowB: [41, 49], handB: [37, 60] },
      { head: [50, 42], neck: [48, 50], hip: [46, 72], kneeA: [66, 66], footA: [70, 90], kneeB: [64, 66], footB: [68, 90], elbowA: [32, 52], handA: [38, 60], elbowB: [31, 52], handB: [37, 60] },
    ],
  },
  escalador: {
    name: 'Escalador',
    material: 'Sin material',
    how: ['Posición de flexión con brazos estirados.', 'Lleva una rodilla al pecho y regrésala.', 'Alterna las piernas rápido, como si corrieras.'],
    safety: 'Mantén la cadera baja y las manos firmes bajo los hombros.',
    frames: [
      { head: [84, 50], neck: [77, 55], hip: [48, 64], kneeA: [62, 76], footA: [52, 86], kneeB: [32, 74], footB: [16, 84], elbowA: [77, 71], handA: [77, 88], elbowB: [75, 71], handB: [75, 88] },
      { head: [84, 50], neck: [77, 55], hip: [48, 64], kneeA: [32, 74], footA: [16, 84], kneeB: [62, 76], footB: [52, 86], elbowA: [77, 71], handA: [77, 88], elbowB: [75, 71], handB: [75, 88] },
    ],
  },
  tijera: {
    name: 'Saltos de tijera',
    material: 'Sin material',
    how: ['De pie, piernas juntas y brazos abajo.', 'Salta abriendo piernas y subiendo los brazos.', 'Salta de nuevo para volver a la posición inicial.'],
    safety: 'Cae suave, en la punta de los pies. Si no puedes saltar, abre una pierna a la vez.',
    frames: [
      p({ kneeA: [52, 71], footA: [52, 90], kneeB: [48, 71], footB: [48, 90], elbowA: [56, 38], handA: [57, 51], elbowB: [44, 38], handB: [43, 51] }),
      p({ kneeA: [58, 71], footA: [64, 90], kneeB: [42, 71], footB: [36, 90], elbowA: [60, 16], handA: [66, 6], elbowB: [40, 16], handB: [34, 6] }),
    ],
  },
  burpee: {
    name: 'Burpee',
    material: 'Sin material',
    how: ['Desde de pie, baja y apoya las manos en el piso.', 'Lleva los pies atrás a posición de flexión.', 'Regresa los pies y salta con los brazos arriba.'],
    safety: 'Si es muy intenso, no saltes y camina los pies hacia atrás.',
    frames: [
      p({ head: [50, 12], neck: [50, 20], hip: [50, 48], kneeA: [52, 67], footA: [52, 84], kneeB: [48, 67], footB: [48, 84], elbowA: [54, 10], handA: [55, 0], elbowB: [46, 10], handB: [45, 0] }),
      { head: [84, 50], neck: [77, 55], hip: [46, 67], kneeA: [30, 75], footA: [14, 84], kneeB: [30, 75], footB: [14, 84], elbowA: [77, 71], handA: [77, 88], elbowB: [75, 71], handB: [75, 88] },
    ],
  },
  puente: {
    name: 'Puente de glúteo',
    material: 'Toalla o tapete',
    how: ['Acostado boca arriba, rodillas dobladas y pies en el piso.', 'Sube la cadera apretando los glúteos.', 'Aguanta un segundo arriba y baja despacio.'],
    safety: 'Empuja con los talones, no con la espalda.',
    frames: [
      { head: [18, 84], neck: [25, 85], hip: [50, 86], kneeA: [64, 68], footA: [72, 88], kneeB: [62, 68], footB: [70, 88], elbowA: [35, 88], handA: [45, 88], elbowB: [34, 88], handB: [44, 88] },
      { head: [18, 84], neck: [25, 84], hip: [50, 68], kneeA: [66, 64], footA: [72, 88], kneeB: [64, 64], footB: [70, 88], elbowA: [35, 88], handA: [45, 88], elbowB: [34, 88], handB: [44, 88] },
    ],
  },
  pressBotellas: {
    name: 'Press de hombros con botellas',
    material: 'Dos botellas de agua llenas',
    how: ['De pie, una botella en cada mano a la altura de los hombros.', 'Empuja hacia arriba hasta estirar los brazos.', 'Baja despacio.'],
    safety: 'No arquees la espalda: aprieta el abdomen.',
    prop: 'bottles',
    frames: [
      p({ elbowA: [62, 34], handA: [60, 24], elbowB: [38, 34], handB: [40, 24] }),
      p({ elbowA: [58, 14], handA: [56, 3], elbowB: [42, 14], handB: [44, 3] }),
    ],
  },
  remoMochila: {
    name: 'Remo con mochila',
    material: 'Una mochila con libros',
    how: ['Inclina el tronco hacia adelante con la espalda recta.', 'Sostén la mochila con los brazos estirados.', 'Tira la mochila hacia el abdomen llevando los codos atrás.', 'Baja despacio.'],
    safety: 'Espalda recta siempre: dobla un poco las rodillas.',
    prop: 'backpack',
    frames: [
      { head: [74, 38], neck: [68, 43], hip: [44, 56], kneeA: [48, 72], footA: [46, 90], kneeB: [46, 72], footB: [44, 90], elbowA: [67, 57], handA: [66, 71], elbowB: [65, 57], handB: [64, 71] },
      { head: [74, 38], neck: [68, 43], hip: [44, 56], kneeA: [48, 72], footA: [46, 90], kneeB: [46, 72], footB: [44, 90], elbowA: [54, 46], handA: [62, 58], elbowB: [52, 46], handB: [60, 58] },
    ],
  },
  talones: {
    name: 'Elevación de talones',
    material: 'Sin material (apóyate en una pared si lo necesitas)',
    how: ['De pie, pies al ancho de la cadera.', 'Sube en la punta de los pies.', 'Aguanta un segundo y baja despacio.'],
    safety: 'Hazlo lento y controlado.',
    frames: [
      stand,
      Object.fromEntries(Object.entries(stand).map(([k, [x, y]]) => [k, k.startsWith('foot') ? [x + 3, y] : [x, y - 4]])),
    ],
  },
  pared: {
    name: 'Sentadilla en la pared',
    material: 'Una pared',
    how: ['Espalda apoyada en la pared.', 'Baja hasta que las rodillas formen un ángulo recto.', 'Aguanta el tiempo indicado.'],
    safety: 'Si te molesta la rodilla, no bajes tanto.',
    prop: 'wall',
    frames: [
      { head: [26, 34], neck: [26, 42], hip: [28, 64], kneeA: [50, 64], footA: [50, 90], kneeB: [48, 64], footB: [48, 90], elbowA: [34, 50], handA: [30, 56], elbowB: [33, 50], handB: [29, 56] },
      { head: [26, 33], neck: [26, 41], hip: [28, 63], kneeA: [50, 63], footA: [50, 90], kneeB: [48, 63], footB: [48, 90], elbowA: [34, 49], handA: [30, 55], elbowB: [33, 49], handB: [29, 55] },
    ],
  },
  abdominal: {
    name: 'Abdominal corto',
    material: 'Toalla o tapete',
    how: ['Acostado boca arriba, rodillas dobladas.', 'Manos detrás de la cabeza sin jalar el cuello.', 'Sube los hombros del piso apretando el abdomen.', 'Baja despacio.'],
    safety: 'La fuerza sale del abdomen, no del cuello.',
    frames: [
      { head: [20, 82], neck: [27, 84], hip: [52, 86], kneeA: [64, 70], footA: [74, 88], kneeB: [62, 70], footB: [72, 88], elbowA: [24, 74], handA: [18, 80], elbowB: [23, 74], handB: [17, 80] },
      { head: [30, 66], neck: [35, 73], hip: [52, 86], kneeA: [64, 70], footA: [74, 88], kneeB: [62, 70], footB: [72, 88], elbowA: [34, 62], handA: [28, 68], elbowB: [33, 62], handB: [27, 68] },
    ],
  },
  rodillasArriba: {
    name: 'Rodillas arriba (trote en el sitio)',
    material: 'Sin material',
    how: ['Trota en el mismo lugar.', 'Sube las rodillas a la altura de la cadera.', 'Mueve los brazos al ritmo.'],
    safety: 'Pisa suave con la punta de los pies.',
    frames: [
      p({ kneeA: [62, 54], footA: [58, 72], elbowA: [58, 34], handA: [64, 26], elbowB: [44, 40], handB: [40, 50] }),
      p({ kneeB: [60, 54], footB: [56, 72], elbowB: [56, 34], handB: [62, 26], elbowA: [44, 40], handA: [40, 50] }),
    ],
  },
}
