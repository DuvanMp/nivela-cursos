// Pronunciación con la voz del navegador y sonidos cortos de acierto/error.

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text, { slow = false } = {}) {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = slow ? 0.6 : 0.9
  const voice = synth.getVoices().find((v) => v.lang?.startsWith('en-US')) || synth.getVoices().find((v) => v.lang?.startsWith('en'))
  if (voice) u.voice = voice
  synth.speak(u)
}

let ctx
function tone(freqs, dur = 0.12) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const start = t0 + i * dur
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.18, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      o.connect(g).connect(ctx.destination)
      o.start(start)
      o.stop(start + dur + 0.02)
    })
  } catch { /* sin audio */ }
}

export const sounds = {
  right: () => tone([660, 880]),
  wrong: () => tone([300, 220], 0.16),
  done: () => tone([523, 659, 784, 1047], 0.11),
}
