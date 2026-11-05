import { useId } from 'react'

// Ilustraciones de portada de cada curso (SVG propio, sin imágenes externas).
// Todo lo importante queda en el centro (x 140–500) para que se vea bien
// recortado en horizontal (16:9), 4:3 y cuadrado.
const F = { fontFamily: 'var(--display)', fontWeight: 800 }
const Sparkle = ({ x, y, s = 1, fill = '#fff', o = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-22C2-8 8-2 22 0 8 2 2 8 0 22-2 8-8 2-22 0-8-2-2-8 0-22Z" fill={fill} opacity={o} />
)
const Bubble = ({ x, y, w, h, fill, tail = 'left', r = 30 }) => {
  const tx = tail === 'left' ? x + 34 : x + w - 34
  const dir = tail === 'left' ? -1 : 1
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
      <path d={`M${tx} ${y + h - 2} l${dir * 4} 30 l${dir * 30} -30 z`} fill={fill} />
    </g>
  )
}

function Frame({ id, from, to, glow, children }) {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" className="cover-art" focusable="false">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <filter id={`${id}blur`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38" /></filter>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity=".28" /></filter>
      </defs>
      <rect width="640" height="360" fill={`url(#${id}bg)`} />
      {glow.map(([cx, cy, r, c, o], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={c} opacity={o} filter={`url(#${id}blur)`} />)}
      {children}
    </svg>
  )
}

// Fondo de camuflaje (manchas orgánicas)
const Camo = ({ a, b, c }) => (
  <g>
    <path d="M-20 60C40 20 90 70 140 40S230 10 250 60 200 130 130 120 20 130-20 110Z" fill={a} opacity=".55" />
    <path d="M380 -10C450 30 520 -20 600 20S690 70 650 130 540 150 470 110 340 60 380 -10Z" fill={b} opacity=".5" />
    <path d="M-30 230C30 200 100 250 160 230S250 270 230 330 120 390 40 360-60 290-30 230Z" fill={b} opacity=".5" />
    <path d="M430 250C490 210 570 240 640 220S700 330 640 380 500 400 440 350 380 290 430 250Z" fill={a} opacity=".55" />
    <path d="M250 300C300 270 360 300 400 320S390 390 320 380 220 340 250 300Z" fill={c} opacity=".35" />
  </g>
)

const Chevrons = ({ color, x = 320, y = 40 }) => (
  <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${x} ${y})`}>
    <path d="M-34 0 0 -16 34 0" /><path d="M-34 18 0 2 34 18" /><path d="M-34 36 0 20 34 36" />
  </g>
)

const ART = {
  'ingles-a1': (id) => (
    <Frame id={id} from="#4A56FF" to="#241C9E" glow={[[540, 40, 120, '#FFB020', 0.55], [90, 340, 130, '#12B886', 0.4], [320, 180, 110, '#8A5BFF', 0.35]]}>
      {[0, 1, 2, 3, 4].map((i) => [0, 1, 2, 3].map((j) => <circle key={`${i}${j}`} cx={470 + i * 26} cy={255 + j * 26} r="3.2" fill="#fff" opacity=".28" />))}
      <g filter={`url(#${id}sh)`}>
        <Bubble x={150} y={62} w={270} h={112} fill="#fff" tail="left" r={38} />
        <text x="285" y="140" textAnchor="middle" fontSize="70" fill="#2D3BE3" style={F}>Hello!</text>
        <Bubble x={262} y={196} w={238} h={96} fill="#FFB020" tail="right" r={34} />
        <text x="381" y="260" textAnchor="middle" fontSize="54" fill="#15173A" style={F}>Hola</text>
      </g>
      <Sparkle x={470} y={86} s={1.1} fill="#FFB020" />
      <Sparkle x={165} y={250} s={0.8} fill="#fff" o={0.9} />
      <Sparkle x={505} y={175} s={0.55} fill="#fff" o={0.8} />
    </Frame>
  ),
  'ingles-m2': (id) => (
    <Frame id={id} from="#19D3A0" to="#0A6F66" glow={[[80, 30, 130, '#B6FFE9', 0.5], [560, 330, 140, '#2D3BE3', 0.4], [330, 180, 90, '#FFB020', 0.25]]}>
      <g filter={`url(#${id}sh)`}>
        <Bubble x={140} y={58} w={360} h={104} fill="#fff" tail="left" r={36} />
        <text x="320" y="126" textAnchor="middle" fontSize="46" fill="#0B6B55" style={F}>How are you?</text>
        <Bubble x={236} y={182} w={264} h={92} fill="#15173A" tail="right" r={32} />
        <text x="368" y="243" textAnchor="middle" fontSize="46" fill="#7DF5CF" style={F}>I’m fine!</text>
        <rect x="150" y="262" width="92" height="50" rx="25" fill="#fff" opacity=".95" />
        {[184, 196, 208].map((cx, i) => <circle key={cx} cx={cx - 2 + 10} cy="287" r="6" fill="#0B8A64" opacity={0.45 + i * 0.25} />)}
      </g>
      <Sparkle x={490} y={70} s={0.9} fill="#fff" />
      <Sparkle x={160} y={190} s={0.55} fill="#B6FFE9" />
    </Frame>
  ),
  'ingles-m3': (id) => (
    <Frame id={id} from="#FFB020" to="#6A2BD6" glow={[[320, 40, 150, '#FFE08A', 0.7], [80, 330, 130, '#F0506E', 0.55], [580, 280, 130, '#F0506E', 0.4]]}>
      <circle cx="320" cy="300" r="132" fill="#FF6B6B" opacity=".5" />
      <circle cx="320" cy="300" r="92" fill="#FFB020" opacity=".7" />
      <path d="M150 262Q250 70 470 96" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" opacity=".9" />
      <g transform="translate(470 96) rotate(-12)" filter={`url(#${id}sh)`}>
        <path d="M0 0 82 -34 52 30Z" fill="#fff" />
        <path d="M52 30 38 -2 82 -34Z" fill="#DCE2FF" />
      </g>
      <g filter={`url(#${id}sh)`}>
        <rect x="150" y="146" width="340" height="128" rx="28" fill="#fff" />
        <circle cx="150" cy="210" r="16" fill="#8B3FD9" opacity=".55" />
        <circle cx="490" cy="210" r="16" fill="#8B3FD9" opacity=".55" />
        <text x="320" y="244" textAnchor="middle" fontSize="66" fill="#15173A" style={F}>Let’s go!</text>
        <text x="320" y="182" textAnchor="middle" fontSize="16" letterSpacing="6" fill="#C12F4D" style={F}>BOARDING PASS</text>
      </g>
      <Sparkle x={185} y={96} s={0.7} fill="#fff" />
      <Sparkle x={510} y={290} s={0.8} fill="#FFE08A" />
    </Frame>
  ),
  'reto-militar-hombres': (id) => (
    <Frame id={id} from="#33401A" to="#1B2209" glow={[[320, 160, 160, '#8A9F4B', 0.28]]}>
      <Camo a="#566B2C" b="#0F1505" c="#7C8F47" />
      <Chevrons color="#CDB57E" y={34} />
      <text x="320" y="118" textAnchor="middle" fontSize="30" letterSpacing="14" fill="#CDB57E" style={F}>MISIÓN</text>
      <text x="320" y="272" textAnchor="middle" fontSize="178" fill="#F2E3B5" stroke="#0F1505" strokeWidth="6" paintOrder="stroke" style={F}>21</text>
      <rect x="160" y="290" width="320" height="42" rx="21" fill="#0F1505" opacity=".88" />
      <text x="320" y="318" textAnchor="middle" fontSize="20" letterSpacing="6" fill="#FF8A1F" style={F}>DÍAS · HOMBRES</text>
      <Sparkle x={168} y={190} s={0.5} fill="#CDB57E" o={0.8} />
      <Sparkle x={474} y={170} s={0.5} fill="#CDB57E" o={0.8} />
    </Frame>
  ),
  'reto-militar-mujeres': (id) => (
    <Frame id={id} from="#EBDCAF" to="#B79C5E" glow={[[320, 160, 160, '#FFF6D6', 0.7]]}>
      <Camo a="#C8AE72" b="#8F7A45" c="#6F7F3D" />
      <Chevrons color="#2F3A17" y={34} />
      <text x="320" y="118" textAnchor="middle" fontSize="30" letterSpacing="14" fill="#2F3A17" style={F}>MISIÓN</text>
      <text x="320" y="272" textAnchor="middle" fontSize="178" fill="#3C4A1C" stroke="#F5ECCB" strokeWidth="6" paintOrder="stroke" style={F}>21</text>
      <rect x="160" y="290" width="320" height="42" rx="21" fill="#2F3A17" />
      <text x="320" y="318" textAnchor="middle" fontSize="20" letterSpacing="6" fill="#FFB3C0" style={F}>DÍAS · MUJERES</text>
      <Sparkle x={168} y={190} s={0.5} fill="#2F3A17" o={0.6} />
      <Sparkle x={474} y={170} s={0.5} fill="#2F3A17" o={0.6} />
    </Frame>
  ),
  'ventas-whatsapp': (id) => (
    <Frame id={id} from="#0F6B52" to="#06281F" glow={[[560, 40, 130, '#2EE6A6', 0.5], [60, 320, 130, '#12B886', 0.45]]}>
      <g filter={`url(#${id}sh)`}>
        <Bubble x={150} y={56} w={250} h={72} fill="#fff" tail="left" r={30} />
        <text x="275" y="104" textAnchor="middle" fontSize="31" fill="#334" style={F}>¿Cuánto vale?</text>
        <Bubble x={170} y={158} w={330} h={110} fill="#D9FDD3" tail="right" r={34} />
        <text x="335" y="222" textAnchor="middle" fontSize="42" fill="#0B3D2E" style={F}>¿Te lo separo?</text>
        <text x="476" y="256" textAnchor="end" fontSize="24" fill="#3B82F6" style={F}>✓✓</text>
      </g>
      <g transform="translate(168 292) rotate(-6)" filter={`url(#${id}sh)`}>
        <rect width="170" height="42" rx="21" fill="#FFB020" />
        <text x="85" y="29" textAnchor="middle" fontSize="23" letterSpacing="2" fill="#15173A" style={F}>¡VENDIDO!</text>
      </g>
      <Sparkle x={500} y={96} s={0.8} fill="#7DF5CF" />
      <Sparkle x={160} y={160} s={0.45} fill="#fff" o={0.8} />
    </Frame>
  ),
  'ia-desde-cero': (id) => (
    <Frame id={id} from="#161440" to="#0A0B22" glow={[[120, 40, 140, '#7C3AED', 0.75], [540, 320, 150, '#22D3EE', 0.55], [330, 200, 90, '#F0506E', 0.25]]}>
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} y1={60 * i + 20} x2={640} y2={60 * i + 20} stroke="#fff" opacity=".04" />)}
      <g filter={`url(#${id}sh)`}>
        <rect x="140" y="64" width="360" height="232" rx="26" fill="#0E1030" stroke="#7C6CFF" strokeOpacity=".55" strokeWidth="2" />
        <circle cx="172" cy="94" r="7" fill="#F0506E" /><circle cx="194" cy="94" r="7" fill="#FFB020" /><circle cx="216" cy="94" r="7" fill="#12B886" />
        <text x="168" y="168" fontSize="56" fill="#7DF0FF" style={F}>Prompt:</text>
        <rect x="398" y="124" width="22" height="52" rx="4" fill="#7DF0FF" />
        <rect x="168" y="204" width="260" height="14" rx="7" fill="#fff" opacity=".18" />
        <rect x="168" y="232" width="200" height="14" rx="7" fill="#fff" opacity=".12" />
        <rect x="168" y="260" width="150" height="14" rx="7" fill="#7C6CFF" opacity=".55" />
      </g>
      <Sparkle x={500} y={70} s={1.15} fill="#22D3EE" />
      <Sparkle x={148} y={300} s={0.8} fill="#A78BFA" />
      <Sparkle x={530} y={250} s={0.5} fill="#fff" o={0.85} />
    </Frame>
  ),
  'redes-digitales': (id) => (
    <Frame id={id} from="#FF5F7E" to="#8E2DE2" glow={[[70, 60, 130, '#FFB020', 0.7], [580, 320, 140, '#FFB020', 0.45], [330, 330, 120, '#4A56FF', 0.35]]}>
      <g filter={`url(#${id}sh)`}>
        <rect x="236" y="38" width="168" height="296" rx="30" fill="#15173A" />
        <rect x="246" y="56" width="148" height="262" rx="22" fill="#fff" />
        <rect x="288" y="44" width="64" height="9" rx="4.5" fill="#15173A" />
        <circle cx="270" cy="88" r="14" fill="#FF5F7E" /><rect x="292" y="80" width="64" height="9" rx="4.5" fill="#CBD0E6" /><rect x="292" y="94" width="40" height="7" rx="3.5" fill="#E1E4EF" />
        <rect x="258" y="118" width="124" height="96" rx="12" fill="#FFB020" />
        <path d="M258 196 300 160 330 186 360 150 382 176V214H258Z" fill="#FF5F7E" opacity=".85" />
        <circle cx="352" cy="140" r="12" fill="#fff" opacity=".9" />
        <rect x="258" y="228" width="60" height="50" rx="10" fill="#DCE2FF" /><rect x="324" y="228" width="58" height="50" rx="10" fill="#C9F5E6" />
        <rect x="258" y="286" width="124" height="14" rx="7" fill="#E1E4EF" />
      </g>
      <g filter={`url(#${id}sh)`}>
        <g transform="translate(350 76) rotate(5)"><rect width="168" height="50" rx="25" fill="#fff" /><circle cx="26" cy="25" r="11" fill="#12B886" /><text x="48" y="34" fontSize="26" fill="#15173A" style={F}>+1 venta</text></g>
        <g transform="translate(130 226) rotate(-6)"><rect width="128" height="48" rx="24" fill="#15173A" /><text x="22" y="33" fontSize="24" fill="#FF8FA3" style={F}>♥</text><text x="48" y="33" fontSize="24" fill="#fff" style={F}>1.284</text></g>
      </g>
      <Sparkle x={160} y={96} s={0.8} fill="#fff" />
      <Sparkle x={505} y={290} s={0.7} fill="#FFE08A" />
    </Frame>
  ),
}

export const hasArt = (slug) => slug in ART
export default function CoverArt({ slug }) {
  const id = 'c' + useId().replace(/[^a-zA-Z0-9]/g, '')
  return ART[slug](id)
}
