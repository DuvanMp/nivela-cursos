// Normaliza respuestas para compararlas sin importar mayúsculas, tildes,
// signos de puntuación ni contracciones ("I'm" = "I am").
const CONTRACCIONES = {
  "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is',
  "we're": 'we are', "they're": 'they are', "don't": 'do not', "doesn't": 'does not',
  "isn't": 'is not', "aren't": 'are not', "what's": 'what is', "i've": 'i have', "can't": 'cannot',
}

const cache = new Map()
export function normalize(s) {
  const key = String(s)
  if (cache.has(key)) return cache.get(key)
  const out = key
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, ''))
    .map((w) => CONTRACCIONES[w] || w)
    .join(' ')
    .replace(/[^a-z0-9' ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (cache.size < 5000) cache.set(key, out)
  return out
}

// Palabras de una frase para el banco de palabras (sin signos de puntuación)
export const tokens = (s) => s.replace(/[.,!?¿¡]/g, '').split(/\s+/).filter(Boolean)
