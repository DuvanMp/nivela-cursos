import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourse } from '../lib/useCourse.js'
import { buildLesson, check, shuffle } from '../lib/exercises.js'
import { completeLesson, lessonState, starsFor, xpFor } from '../lib/progress.js'
import { allLessons, EXAM_MAX_MISTAKES } from '../lib/courseUtils.js'
import { canSpeak, sounds, speak } from '../lib/media.js'
import Blocks from '../components/Blocks.jsx'

const PASSIVE = ['tip', 'read', 'dialogue']

export default function Lesson() {
  const { slug, lessonId } = useParams()
  const { content, progress, save, status } = useCourse(slug)

  if (status === 'no-course') return <Navigate to="/" replace />
  if (status === 'no-access') return <Navigate to={`/curso/${slug}`} replace />
  if (status === 'no-content') return <Navigate to={`/aprender/${slug}`} replace />
  if (status === 'error') return <main className="wrap empty"><h1>No pudimos cargar la lección</h1><Link to={`/aprender/${slug}`} className="btn">Volver</Link></main>
  if (status !== 'ready') return <p className="loading">Cargando lección…</p>

  const lessons = allLessons(content)
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson || lessonState(lessons.map((l) => l.id), progress, lessonId) === 'locked') {
    return <Navigate to={`/aprender/${slug}`} replace />
  }
  return <LessonPlayer key={lessonId} slug={slug} course={content} lesson={lesson} progress={progress} save={save} />
}

function LessonPlayer({ slug, course, lesson, progress, save }) {
  const navigate = useNavigate()
  const original = useMemo(() => buildLesson(lesson, course), [lesson, course])
  const [queue, setQueue] = useState(original)
  const [i, setI] = useState(0)
  const [response, setResponse] = useState(null)
  const [result, setResult] = useState(null) // null | 'right' | 'wrong'
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState(0)
  const [retried] = useState(() => new Set())
  const [finished, setFinished] = useState(null)
  const [saveError, setSaveError] = useState('')

  const ex = queue[i]
  if (import.meta.env.DEV) window.__ex = ex // solo para pruebas automáticas en desarrollo
  const ready = ex && (ex.type === 'build' ? response?.length > 0 : ex.type === 'type' ? !!response?.trim() : response != null)

  const doCheck = () => {
    if (!ready || result) return
    const ok = check(ex, ex.type === 'build' ? response.map((n) => ex.bank[n]) : response)
    setResult(ok ? 'right' : 'wrong')
    if (ok) { sounds.right(); if (ex.say && ex.type !== 'listen') speak(ex.say) } else { sounds.wrong(); setMistakes((m) => m + 1) }
  }

  const next = () => {
    const base = ex.id.replace(/-r$/, '')
    let q = queue
    // Un error vuelve a aparecer al final, una sola vez
    if (result === 'wrong' && !lesson.exam && ex.type !== 'quiz' && !retried.has(base)) {
      retried.add(base)
      q = [...queue, { ...ex, id: `${base}-r`, options: ex.options && shuffle(ex.options), bank: ex.bank && shuffle(ex.bank) }]
      setQueue(q)
    } else {
      setDone((d) => d + 1)
    }
    setResponse(null)
    setResult(null)
    if (i + 1 >= q.length) finish()
    else setI(i + 1)
  }

  const finish = async () => {
    // En el examen se aprueba con EXAM_MAX_MISTAKES errores o menos; si no, no se guarda
    if (lesson.exam && mistakes > EXAM_MAX_MISTAKES) {
      sounds.wrong()
      setFinished({ failed: true, mistakes })
      return
    }
    sounds.done()
    const updated = completeLesson(progress, lesson.id, mistakes)
    setFinished({ mistakes, stars: starsFor(mistakes), xp: xpFor(mistakes), total: original.length })
    try { await save(updated) } catch (e) { setSaveError(e.message) }
  }

  // Teclado: Enter comprueba / continúa; 1-4 eligen opción
  const keyRef = useRef()
  keyRef.current = (e) => {
    if (finished) return
    if (e.key === 'Enter') { if (e.target.classList?.contains('btn-check') || e.target.tagName === 'SUMMARY' || e.target.closest?.('.b-prompt, .b-check, .speak')) return; e.preventDefault(); result || PASSIVE.includes(ex.type) ? next() : doCheck(); return }
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') return
    if (e.target.tagName === 'INPUT' || result) return
    const n = Number(e.key)
    if (ex?.options && n >= 1 && n <= ex.options.length) setResponse(ex.options[n - 1])
  }
  useEffect(() => {
    const h = (e) => keyRef.current(e)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  if (finished?.failed) {
    return (
      <main className="lesson-end">
        <div className="end-card">
          <h1>Te faltó poco</h1>
          <p className="lead">Tuviste {finished.mistakes} errores. Para aprobar el examen necesitas {EXAM_MAX_MISTAKES} o menos. Repasa las unidades y vuelve a intentarlo.</p>
          <button className="btn btn-block btn-mango" autoFocus onClick={() => window.location.reload()}>Intentar otra vez</button>
          <button className="btn btn-block btn-ghost-dark" onClick={() => navigate(`/aprender/${slug}`)}>Volver al curso</button>
        </div>
      </main>
    )
  }

  if (finished) {
    return (
      <main className="lesson-end">
        <div className="end-card">
          <div className="end-stars" aria-label={`${finished.stars} de 3 estrellas`}>
            {[1, 2, 3].map((s) => <i key={s} className={s <= finished.stars ? 'on' : ''} style={{ animationDelay: `${s * 0.15}s` }} />)}
          </div>
          <h1>{lesson.exam ? '¡Aprobaste el examen!' : '¡Lección completada!'}</h1>
          <p className="lead">{lesson.title}</p>
          <dl className="end-stats">
            <div><dt>Puntos</dt><dd>+{finished.xp} XP</dd></div>
            <div><dt>Errores</dt><dd>{finished.mistakes}</dd></div>
          </dl>
          {saveError && <p className="error">No se pudo guardar el progreso: {saveError}</p>}
          {lesson.exam ? (
            <button className="btn btn-block btn-mango" autoFocus onClick={() => navigate(`/aprender/${slug}/certificado`)}>Ver mi certificado</button>
          ) : (
            <button className="btn btn-block btn-mango" autoFocus onClick={() => navigate(`/aprender/${slug}`)}>Continuar</button>
          )}
        </div>
      </main>
    )
  }

  const pct = Math.round((done / original.length) * 100)

  return (
    <main className={`lesson lesson-${ex.type} ${lesson.kind === 'read' ? 'lesson-reading' : ''}`}>
      <div className="lesson-top">
        <Link to={`/aprender/${slug}`} className="close" aria-label="Salir de la lección">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </Link>
        <div className="lesson-bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="lesson-body" key={ex.id}>
        {lesson.exam && <p className="retry">Examen final: errores {mistakes} de {EXAM_MAX_MISTAKES} permitidos</p>}
        {ex.id.endsWith('-r') && <p className="retry">Repasemos esta</p>}
        <Exercise ex={ex} value={response} setValue={setResponse} locked={!!result} onMatched={(m) => { setMistakes((x) => x + m); setResult('right'); sounds.right() }} />
      </div>

      <div className={`check-bar ${result || ''}`}>
        <div className="check-inner">
          {result && (
            <div className="feedback" role="status">
              {result === 'right' ? <strong>¡Bien hecho!</strong> : (
                <>
                  <strong>Respuesta correcta:</strong>
                  <span>{ex.answer}</span>
                </>
              )}
              {ex.meaning && <span className="fb-extra">«{ex.meaning}»</span>}
              {ex.explain && <span className="fb-extra">{ex.explain}</span>}
            </div>
          )}
          {PASSIVE.includes(ex.type) ? (
            <button className="btn btn-check" onClick={next} autoFocus>
              {ex.type === 'tip' ? 'Empezar' : ex.type === 'read' ? (queue.length > 1 ? 'Hacer la prueba' : 'Terminar lección') : 'Continuar'}
            </button>
          ) : result ? (
            <button className="btn btn-check" onClick={next} autoFocus>Continuar</button>
          ) : ex.type !== 'match' ? (
            <button className="btn btn-check" onClick={doCheck} disabled={!ready}>Comprobar</button>
          ) : null}
        </div>
      </div>
    </main>
  )
}

function SpeakButton({ text, big }) {
  if (!canSpeak()) return null
  return (
    <span className="speak">
      <button type="button" className={`speak-btn ${big ? 'big' : ''}`} onClick={() => speak(text)} aria-label="Escuchar">
        <svg viewBox="0 0 24 24" width={big ? 34 : 22} height={big ? 34 : 22} aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      {big && <button type="button" className="speak-btn slow" onClick={() => speak(text, { slow: true })} aria-label="Escuchar despacio">Despacio</button>}
    </span>
  )
}

function Options({ ex, value, setValue, locked }) {
  return (
    <div className="options">
      {ex.options.map((o, n) => {
        const state = locked ? (o === ex.answer ? 'is-right' : o === value ? 'is-wrong' : '') : o === value ? 'is-picked' : ''
        return (
          <button key={o} type="button" className={`opt ${state}`} onClick={() => !locked && setValue(o)} aria-pressed={o === value}>
            <kbd>{n + 1}</kbd>{o}
          </button>
        )
      })}
    </div>
  )
}

function Exercise({ ex, value, setValue, locked, onMatched }) {
  useEffect(() => {
    if (ex.type === 'listen' || ex.type === 'meaning') {
      const t = setTimeout(() => speak(ex.say), 300)
      return () => clearTimeout(t)
    }
  }, [ex.id])

  switch (ex.type) {
    case 'tip':
      return (
        <div className="tip">
          <span className="tip-label">Antes de empezar</span>
          <h1 className="q">{ex.title}</h1>
          <p className="tip-body">{ex.body}</p>
          <ul className="tip-examples">
            {ex.examples.map(([en, es]) => (
              <li key={en}><SpeakButton text={en} /><span><strong>{en}</strong><em>{es}</em></span></li>
            ))}
          </ul>
        </div>
      )
    case 'read':
      return (
        <article className="reading">
          <h1 className="q">{ex.title}</h1>
          <Blocks blocks={ex.blocks} />
        </article>
      )
    case 'quiz':
      return (
        <>
          <span className="tip-label">Comprueba lo aprendido</span>
          <h1 className="q">{ex.prompt}</h1>
          <Options ex={ex} value={value} setValue={setValue} locked={locked} />
        </>
      )
    case 'dialogue':
      return (
        <>
          <span className="tip-label">Conversación</span>
          <h1 className="q">Lee y escucha la conversación</h1>
          <Conversation lines={ex.lines} showMeaning />
        </>
      )
    case 'reply':
      return (
        <>
          <h1 className="q">{ex.prompt}</h1>
          <Conversation lines={ex.lines} pending={ex.speaker} />
          <Options ex={ex} value={value} setValue={setValue} locked={locked} />
        </>
      )
    case 'choose':
      return (
        <>
          <h1 className="q">{ex.prompt}</h1>
          <Options ex={ex} value={value} setValue={setValue} locked={locked} />
        </>
      )
    case 'listen':
      return (
        <>
          <h1 className="q">{ex.prompt}</h1>
          <div className="listen-row">
            {canSpeak() ? <SpeakButton text={ex.say} big /> : <p className="said">«{ex.say}»</p>}
          </div>
          <Options ex={ex} value={value} setValue={setValue} locked={locked} />
        </>
      )
    case 'meaning':
      return (
        <>
          <h1 className="q">{ex.prompt}</h1>
          <p className="phrase"><SpeakButton text={ex.say} /> {ex.text}</p>
          <Options ex={ex} value={value} setValue={setValue} locked={locked} />
        </>
      )
    case 'type':
      return (
        <>
          <h1 className="q">{ex.prompt}</h1>
          <input
            className="type-input"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            readOnly={locked}
            autoFocus
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            placeholder="Escribe aquí"
            aria-label="Tu respuesta en inglés"
          />
        </>
      )
    case 'build':
      return <Build ex={ex} value={value} setValue={setValue} locked={locked} />
    case 'match':
      return <Match ex={ex} onDone={onMatched} />
    default:
      return null
  }
}

// Conversación tipo chat: A a la izquierda, B a la derecha
function Conversation({ lines, showMeaning, pending }) {
  return (
    <div className="convo">
      {lines.map(([who, en, es], i) => (
        <div key={i} className={`c-line ${who === 'B' ? 'right' : 'left'}`}>
          <span className="c-who" aria-hidden="true">{who}</span>
          <div className="c-bubble">
            <p><SpeakButton text={en} /> <span>{en}</span></p>
            {showMeaning && <em>{es}</em>}
          </div>
        </div>
      ))}
      {pending && (
        <div className={`c-line ${pending === 'B' ? 'right' : 'left'}`}>
          <span className="c-who" aria-hidden="true">{pending}</span>
          <div className="c-bubble pending" aria-label="Respuesta por elegir">…</div>
        </div>
      )}
    </div>
  )
}

// Armar la frase tocando palabras del banco
function Build({ ex, value, setValue, locked }) {
  const picked = value || [] // índices del banco
  const add = (n) => !locked && setValue([...picked, n])
  const remove = (pos) => !locked && setValue(picked.filter((_, k) => k !== pos))
  return (
    <>
      <h1 className="q">Escribe esto en inglés</h1>
      <p className="phrase es">{ex.prompt}</p>
      <div className="answer-line" aria-label="Tu frase">
        {picked.map((n, pos) => (
          <button key={`${n}-${pos}`} type="button" className="chip" onClick={() => remove(pos)}>{ex.bank[n]}</button>
        ))}
      </div>
      <div className="bank" aria-label="Palabras disponibles">
        {ex.bank.map((w, n) => (
          <button key={n} type="button" className={`chip ${picked.includes(n) ? 'used' : ''}`} disabled={picked.includes(n) || locked} onClick={() => add(n)}>{w}</button>
        ))}
      </div>
    </>
  )
}

// Unir parejas inglés-español
function Match({ ex, onDone }) {
  const left = useMemo(() => shuffle(ex.pairs.map((p) => p[0])), [ex.id])
  const right = useMemo(() => shuffle(ex.pairs.map((p) => p[1])), [ex.id])
  const [sel, setSel] = useState({ l: null, r: null })
  const [ok, setOk] = useState([]) // palabras en inglés ya unidas
  const [bad, setBad] = useState(null)
  const misses = useRef(0)

  const tryPair = (l, r) => {
    const pair = ex.pairs.find((p) => p[0] === l)
    if (pair[1] === r) {
      speak(l)
      const nextOk = [...ok, l]
      setOk(nextOk)
      setSel({ l: null, r: null })
      if (nextOk.length === ex.pairs.length) setTimeout(() => onDone(misses.current), 250)
    } else {
      misses.current += 1
      sounds.wrong()
      setBad({ l, r })
      setTimeout(() => { setBad(null); setSel({ l: null, r: null }) }, 500)
    }
  }
  const pick = (side, v) => {
    if (bad) return
    const s = { ...sel, [side]: v }
    setSel(s)
    if (s.l && s.r) tryPair(s.l, s.r)
  }
  const doneEs = ok.map((en) => ex.pairs.find((p) => p[0] === en)[1])
  const cls = (side, v, matched) =>
    `opt match-opt ${matched ? 'is-matched' : ''} ${sel[side] === v ? 'is-picked' : ''} ${bad?.[side] === v ? 'is-wrong' : ''}`

  return (
    <>
      <h1 className="q">{ex.prompt}</h1>
      <div className="match">
        <div className="match-col">
          {left.map((v) => <button key={v} type="button" className={cls('l', v, ok.includes(v))} disabled={ok.includes(v)} onClick={() => pick('l', v)}>{v}</button>)}
        </div>
        <div className="match-col">
          {right.map((v) => <button key={v} type="button" className={cls('r', v, doneEs.includes(v))} disabled={doneEs.includes(v)} onClick={() => pick('r', v)}>{v}</button>)}
        </div>
      </div>
    </>
  )
}
