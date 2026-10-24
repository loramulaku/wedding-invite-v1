import { useState } from 'react'
import { motion, useAnimate, useReducedMotion } from 'framer-motion'
import { Sprig, WaxSeal } from './Ornaments'
import Petals from './Petals'

const ease = [0.65, 0, 0.35, 1]

// Full-screen cover: a sealed envelope. Tapping the seal plays
// seal break → flap opens → letter rises → cover dissolves, then calls onOpen.
export default function Envelope({ bride, groom, monogram, dateLabel, onOpen }) {
  const [scope, animate] = useAnimate()
  const [opening, setOpening] = useState(false)
  const reduceMotion = useReducedMotion()

  async function open() {
    if (opening) return
    setOpening(true)

    if (reduceMotion) {
      await animate(scope.current, { opacity: 0 }, { duration: 0.4 })
      return onOpen()
    }

    animate('[data-hint]', { opacity: 0, y: 8 }, { duration: 0.4 })
    // Clear the stage above the envelope for the flap and letter.
    animate('[data-title]', { opacity: 0, y: -16 }, { duration: 0.8, ease })
    await animate(
      '[data-seal]',
      { scale: [1, 1.12, 0.4], rotate: [0, -8, 14], opacity: [1, 1, 0] },
      { duration: 0.7, ease: 'easeInOut' },
    )
    await animate('[data-flap]', { rotateX: 180 }, { duration: 0.9, ease })
    // Once flipped open, the flap must sit behind the rising letter.
    scope.current.querySelector('[data-flap]').style.zIndex = 1
    await animate('[data-letter]', { y: '-56%' }, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
    await animate(scope.current, { opacity: 0, scale: 1.06 }, { duration: 0.9, ease, delay: 0.5 })
    onOpen()
  }

  return (
    <motion.div
      ref={scope}
      className="v1-paper fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Petals />

      <motion.div
        data-title
        className="relative text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease }}
      >
        <p className="v1-caps text-(--v1-gold)">The wedding of</p>
        <h1 className="mt-3 text-[2.1rem] leading-tight font-light">
          {bride} <span className="text-(--v1-gold) italic">&</span> {groom}
        </h1>
      </motion.div>

      <motion.div
        className="relative mt-14 aspect-[1.42] w-[min(84vw,360px)] cursor-pointer"
        style={{ perspective: 1400 }}
        onClick={open}
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
      >
        {/* Inside of the envelope */}
        <div className="absolute inset-0 rounded-[3px] bg-[#d6c7aa] shadow-[0_30px_60px_-20px_rgba(38,48,42,0.45),0_8px_20px_-8px_rgba(38,48,42,0.3)]" />

        {/* The letter */}
        <div
          data-letter
          className="v1-paper absolute inset-x-[6%] top-[5%] bottom-[5%] z-[2] flex flex-col items-center justify-start rounded-[2px] pt-[9%] shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
        >
          <Sprig className="h-10 text-(--v1-sage)" play />
          <p className="v1-script mt-2 text-3xl text-(--v1-ink)">{monogram.split('').join(' & ')}</p>
          <p className="v1-caps mt-2 text-[0.55rem] text-(--v1-ink-soft)">{dateLabel}</p>
        </div>

        {/* Front pocket */}
        <svg viewBox="0 0 142 100" preserveAspectRatio="none" className="absolute inset-0 z-[3] size-full" aria-hidden="true">
          <path d="M0 0 L71 55 L0 100 Z" fill="#e4d8c0" />
          <path d="M142 0 L71 55 L142 100 Z" fill="#e4d8c0" />
          <path d="M0 100 L71 47 L142 100 Z" fill="#ebe1cc" />
          <path d="M0 100 L71 47 L142 100" fill="none" stroke="#26302a" strokeOpacity="0.07" strokeWidth="0.4" />
        </svg>

        {/* Top flap — rotates open around its top edge */}
        <div
          data-flap
          className="absolute inset-x-0 top-0 z-[4] h-[58%] origin-top drop-shadow-[0_3px_3px_rgba(38,48,42,0.18)]"
        >
          <div className="size-full bg-gradient-to-b from-[#ece2cd] to-[#e0d2b6] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </div>

        {/* Seal */}
        <button
          type="button"
          data-seal
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
          aria-label="Open the invitation"
          className="absolute top-[58%] left-1/2 z-[5] size-[76px] -translate-x-1/2 -translate-y-1/2 rounded-full drop-shadow-[0_6px_8px_rgba(77,18,28,0.35)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--v1-gold)"
        >
          <WaxSeal monogram={monogram.split('').join('&')} className="size-full" />
        </button>
      </motion.div>

      <motion.p
        data-hint
        className="v1-caps relative mt-14 text-(--v1-ink-soft)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="v1-breathe">Tap the seal to open</span>
      </motion.p>
    </motion.div>
  )
}
