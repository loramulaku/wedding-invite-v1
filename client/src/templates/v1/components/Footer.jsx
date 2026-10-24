import { Swans } from './Ornaments'
import Reveal from './Reveal'

export default function Footer({ bride, groom, date }) {
  return (
    <footer className="v1-night border-t border-(--v1-paper)/10 px-8 pt-20 pb-[calc(4rem+env(safe-area-inset-bottom))] text-center">
      <Swans className="mx-auto w-24 text-(--v1-gold)/80" />
      <Reveal as="p" className="mt-6 text-lg text-(--v1-paper)/70 italic">
        With love,
      </Reveal>
      <Reveal as="p" className="v1-script mt-2 text-5xl" delay={0.1}>
        {bride} & {groom}
      </Reveal>
      <Reveal as="p" className="v1-caps mt-6 text-[0.55rem] text-(--v1-gold)" delay={0.2}>
        {date.day} · {date.monthNum} · {date.year}
      </Reveal>
    </footer>
  )
}
