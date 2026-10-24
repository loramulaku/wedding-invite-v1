import { motion } from 'framer-motion'
import { Sprig, Swans } from './Ornaments'

const ease = [0.22, 1, 0.36, 1]
const rise = (delay) => ({
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, delay, ease } },
})

export default function Hero({ bride, groom, date, play }) {
  const state = play ? 'visible' : 'hidden'

  return (
    <section className="v1-paper relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-8 pt-16 pb-10 text-center">
      <Sprig className="absolute -top-2 -left-6 h-36 -rotate-12 text-(--v1-sage)/70" play={play} />
      <Sprig className="absolute -right-4 bottom-10 h-44 rotate-[200deg] text-(--v1-sage)/70" play={play} />

      <motion.p className="v1-caps text-(--v1-ink-soft)" variants={rise(0.2)} initial="hidden" animate={state}>
        Together with their families
      </motion.p>

      <Swans className="mt-8 w-[62%] max-w-[260px] text-(--v1-gold)" play={play} />

      <motion.h1 className="mt-6 text-(--v1-ink)" initial="hidden" animate={state}>
        <motion.span className="v1-script block text-[clamp(3.6rem,17vw,5.2rem)]" variants={rise(0.6)}>
          {bride}
        </motion.span>
        <motion.span className="block py-1 text-3xl font-light text-(--v1-gold) italic" variants={rise(0.9)}>
          &
        </motion.span>
        <motion.span className="v1-script block text-[clamp(3.6rem,17vw,5.2rem)]" variants={rise(1.1)}>
          {groom}
        </motion.span>
      </motion.h1>

      <motion.p
        className="mt-8 max-w-[18rem] text-lg leading-snug text-(--v1-ink-soft) italic"
        variants={rise(1.4)}
        initial="hidden"
        animate={state}
      >
        request the pleasure of your company as they begin their forever
      </motion.p>

      <motion.p className="v1-caps mt-6 text-(--v1-gold)" variants={rise(1.6)} initial="hidden" animate={state}>
        {date.weekday} · {date.day} {date.month} {date.year}
      </motion.p>

      <motion.div
        className="mt-12 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        aria-hidden="true"
      >
        <span className="v1-caps text-[0.55rem] text-(--v1-ink-soft)">Scroll</span>
        <span className="v1-scroll-cue block h-10 w-px bg-(--v1-gold)" />
      </motion.div>
    </section>
  )
}
