import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Soft petals drifting down behind the envelope.
export default function Petals({ count = 9 }) {
  const reduceMotion = useReducedMotion()
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        size: 7 + ((i * 5) % 7),
        duration: 11 + ((i * 3) % 8),
        delay: -((i * 2.3) % 12),
        drift: (i % 2 ? 1 : -1) * (18 + ((i * 7) % 24)),
        spin: (i % 2 ? 1 : -1) * 220,
      })),
    [count],
  )

  if (reduceMotion) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-6 rounded-[60%_0_60%_0] bg-gradient-to-br from-[#efd9d0] to-[#d9b5aa] opacity-60"
          style={{ left: p.left, width: p.size, height: p.size * 1.3 }}
          animate={{ y: ['0vh', '110vh'], x: [0, p.drift, 0], rotate: [0, p.spin] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
