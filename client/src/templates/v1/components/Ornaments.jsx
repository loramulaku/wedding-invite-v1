import { motion } from 'framer-motion'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.15, duration: 1.8, ease: [0.65, 0, 0.35, 1] },
      opacity: { delay: i * 0.15, duration: 0.3 },
    },
  }),
}

// When `play` is given the drawing is controlled by the parent;
// otherwise it draws itself the first time it scrolls into view.
const playProps = (play) =>
  play === undefined
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.4 } }
    : { initial: 'hidden', animate: play ? 'visible' : 'hidden' }

const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }

// A single swan facing right with its head bowed; mirrored, the two necks
// form a heart — beaks meeting in the top cleft, chests at the point.
function SwanPaths({ offset = 0 }) {
  return (
    <>
      <motion.path
        variants={draw}
        custom={offset}
        {...stroke}
        strokeWidth="1.1"
        d="M99 66 C97 61 95 57 94 54 C98 48 95 40 88 41 C80 32 74 19 61 20 C45 22 38 42 45 63 C53 88 84 108 96 134 C101 148 90 160 68 162 C46 164 24 157 7 141 C22 143 34 139 42 128"
      />
      <motion.path
        variants={draw}
        custom={offset + 1}
        {...stroke}
        strokeWidth="0.9"
        d="M26 150 C40 143 49 129 47 113 C59 123 67 137 68 153 M37 154 C48 147 55 138 56 128"
      />
      <motion.circle variants={draw} custom={offset + 2} cx="91.5" cy="46" r="1" fill="currentColor" />
    </>
  )
}

export function Swans({ className, play }) {
  return (
    <motion.svg viewBox="0 0 200 175" className={className} aria-hidden="true" {...playProps(play)}>
      <SwanPaths />
      <g transform="translate(200 0) scale(-1 1)">
        <SwanPaths offset={0.5} />
      </g>
      <motion.path
        variants={draw}
        custom={3}
        {...stroke}
        strokeWidth="0.8"
        d="M20 168 C60 162 140 162 180 168 M50 173 C80 170 120 170 150 173"
        opacity="0.6"
      />
    </motion.svg>
  )
}

const LEAVES = [
  [59, 172, -150, 1],
  [61, 152, -28, 0.95],
  [60, 128, -155, 0.9],
  [61, 104, -24, 0.85],
  [58, 80, -150, 0.8],
  [57, 57, -34, 0.72],
  [60, 36, -145, 0.62],
  [66, 17, -40, 0.5],
]

export function Sprig({ className, play }) {
  return (
    <motion.svg viewBox="0 0 120 200" className={className} aria-hidden="true" {...playProps(play)}>
      <motion.path
        variants={draw}
        {...stroke}
        strokeWidth="1"
        d="M60 198 C58 150 66 110 58 62 C54 38 60 20 70 4"
      />
      {LEAVES.map(([x, y, r, s], i) => (
        <motion.path
          key={i}
          variants={draw}
          custom={0.6 + i * 0.25}
          {...stroke}
          strokeWidth={1 / s}
          d="M0 0 C8 -9 22 -9 30 0 C22 9 8 9 0 0 Z M0 0 L22 0"
          transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
        />
      ))}
    </motion.svg>
  )
}

export function Divider({ className }) {
  return (
    <motion.svg viewBox="0 0 160 16" className={className} aria-hidden="true" {...playProps()}>
      <motion.path variants={draw} {...stroke} strokeWidth="0.8" d="M2 8 H66 M94 8 H158" />
      <motion.path variants={draw} custom={1} {...stroke} strokeWidth="0.9" d="M80 1 L87 8 L80 15 L73 8 Z" />
    </motion.svg>
  )
}

// Irregular wax-seal outline, generated once.
const SEAL_PATH = (() => {
  const points = []
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2
    const r = 47 + 1.8 * Math.sin(t * 7) + 1.2 * Math.sin(t * 13 + 1) + 0.8 * Math.sin(t * 23 + 2)
    points.push(`${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`)
  }
  return `M${points.join(' L')} Z`
})()

export function WaxSeal({ monogram, className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="v1-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#a8394a" />
          <stop offset="55%" stopColor="#7b2230" />
          <stop offset="100%" stopColor="#4d121c" />
        </radialGradient>
      </defs>
      <path d={SEAL_PATH} fill="url(#v1-wax)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#4d121c" strokeOpacity="0.55" strokeWidth="2.4" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#c45a6a" strokeOpacity="0.35" strokeWidth="0.8" transform="translate(-0.8 -0.8)" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontStyle="italic"
        fill="#e8b7a8"
        fillOpacity="0.9"
        letterSpacing="1"
      >
        {monogram}
      </text>
    </svg>
  )
}
