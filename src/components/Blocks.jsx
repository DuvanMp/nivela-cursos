import { useState } from 'react'
import { EJERCICIOS } from '../data/ejercicios.js'
import ExerciseFigure from './ExerciseFigure.jsx'

// Contenido de las lecciones de lectura: texto, pasos, listas, avisos,
// conversaciones de ejemplo, plantillas para copiar, rutinas y video.
export default function Blocks({ blocks }) {
  return <div className="blocks">{blocks.map((b, i) => <Block key={i} b={b} />)}</div>
}

function Block({ b }) {
  switch (b.type) {
    case 'text':
      return (
        <section className="b-text">
          {b.title && <h2>{b.title}</h2>}
          {(Array.isArray(b.body) ? b.body : [b.body]).map((p, i) => <p key={i}>{p}</p>)}
        </section>
      )
    case 'steps':
      return (
        <section className="b-steps">
          {b.title && <h2>{b.title}</h2>}
          <ol>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ol>
        </section>
      )
    case 'checklist':
      return <Checklist b={b} />
    case 'note':
      return (
        <aside className={`b-note ${b.tone === 'safety' ? 'safety' : 'tip'}`}>
          <strong>{b.title}</strong>
          <p>{b.body}</p>
        </aside>
      )
    case 'chat':
      return (
        <section className="b-chat">
          {b.title && <h2>{b.title}</h2>}
          <div className="wa">
            {b.lines.map(([who, text], i) => (
              <p key={i} className={`bubble ${who === 'tu' ? 'me' : 'them'}`}><span>{who === 'tu' ? 'Tú' : 'Cliente'}</span>{text}</p>
            ))}
          </div>
        </section>
      )
    case 'prompt':
      return <PromptBox b={b} />
    case 'workout':
      return <Workout b={b} />
    case 'video':
      return b.url ? (
        <section className="b-video">
          <iframe src={b.url} title={b.title || 'Video de la lección'} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />
        </section>
      ) : null
    default:
      return null
  }
}

function Checklist({ b }) {
  const [done, setDone] = useState([])
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  return (
    <section className="b-check">
      {b.title && <h2>{b.title}</h2>}
      <ul>
        {b.items.map((t, i) => (
          <li key={i}>
            <label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /><span>{t}</span></label>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PromptBox({ b }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(b.text); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* sin permiso */ }
  }
  return (
    <section className="b-prompt">
      <div className="b-prompt-head">
        <strong>{b.title}</strong>
        <button type="button" className="btn btn-sm btn-light" onClick={copy}>{copied ? 'Copiado' : 'Copiar'}</button>
      </div>
      <p>{b.text}</p>
    </section>
  )
}

function Workout({ b }) {
  return (
    <section className="b-workout">
      <div className="wk-head">
        <h2>{b.title}</h2>
        <span className="wk-meta">{b.rounds > 1 ? `${b.rounds} rondas` : '1 ronda'}{b.rest ? ` · ${b.rest} s de descanso entre rondas` : ''}</span>
      </div>
      <ol className="wk-list">
        {b.items.map((it, i) => {
          const e = EJERCICIOS[it.ex]
          return (
            <li key={i} className="wk-item">
              <ExerciseFigure exercise={e} size={88} />
              <div className="wk-info">
                <strong>{e.name}</strong>
                <span className="wk-amount">{it.amount}</span>
                <details>
                  <summary>Cómo se hace</summary>
                  <ol>{e.how.map((h, k) => <li key={k}>{h}</li>)}</ol>
                  <p className="wk-material">Material: {e.material}</p>
                  <p className="wk-safety">{e.safety}</p>
                </details>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
