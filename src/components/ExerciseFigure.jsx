// Figura animada de un ejercicio: alterna dos posiciones (como un GIF, pero en SVG).
// Con "reducir movimiento" activado muestra solo la primera posición.

const BONES = [
  ['neck', 'hip'],
  ['hip', 'kneeB'], ['kneeB', 'footB'], ['neck', 'elbowB'], ['elbowB', 'handB'],
  ['hip', 'kneeA'], ['kneeA', 'footA'], ['neck', 'elbowA'], ['elbowA', 'handA'],
]

function Pose({ pose, back }) {
  return (
    <g>
      {BONES.map(([a, b], i) => (
        <line key={i} x1={pose[a][0]} y1={pose[a][1]} x2={pose[b][0]} y2={pose[b][1]}
          className={i >= 1 && i <= 4 && back ? 'fig-back' : 'fig-limb'} />
      ))}
      <circle cx={pose.head[0]} cy={pose.head[1]} r="6.5" className="fig-head" />
    </g>
  )
}

function Prop({ type, pose }) {
  if (type === 'chair') return <g className="fig-prop"><rect x="22" y="58" width="20" height="4" rx="1" /><rect x="22" y="62" width="3" height="28" /><rect x="39" y="62" width="3" height="28" /><rect x="22" y="36" width="3" height="24" /></g>
  if (type === 'wall') return <rect x="14" y="10" width="5" height="80" className="fig-prop" />
  if (type === 'bottles') return <g className="fig-prop">{['handA', 'handB'].map((h) => <rect key={h} x={pose[h][0] - 2.5} y={pose[h][1] - 7} width="5" height="11" rx="2" />)}</g>
  if (type === 'backpack') return <rect x={pose.handA[0] - 6} y={pose.handA[1]} width="12" height="13" rx="3" className="fig-prop" />
  return null
}

export default function ExerciseFigure({ exercise, size = 96 }) {
  const [a, b] = exercise.frames
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="fig" role="img" aria-label={`Ilustración: ${exercise.name}`}>
      <line x1="4" y1="91" x2="96" y2="91" className="fig-floor" />
      <g className="fig-a"><Prop type={exercise.prop} pose={a} /><Pose pose={a} /></g>
      <g className="fig-b"><Prop type={exercise.prop} pose={b} /><Pose pose={b} /></g>
    </svg>
  )
}
