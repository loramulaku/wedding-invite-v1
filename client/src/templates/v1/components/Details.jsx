import { calendarUrl, mapsUrl } from '@/lib/format'
import { useCountdown } from '@/hooks/useCountdown'
import { Divider, Sprig } from './Ornaments'
import Reveal from './Reveal'

export default function Details({ bride, groom, rawDate, date, venue }) {
  return (
    <section className="v1-paper relative overflow-hidden px-8 py-28 text-center">
      <Sprig className="absolute top-10 -right-6 h-36 rotate-[160deg] text-(--v1-sage)/60" />

      <Reveal as="p" className="v1-caps text-(--v1-gold)">
        The celebration
      </Reveal>

      <Reveal className="mt-10 flex items-center justify-center gap-5" delay={0.1}>
        <span className="w-20 border-y border-(--v1-gold)/50 py-2 text-right text-lg tracking-wide italic sm:w-24">
          {date.month}
        </span>
        <span className="text-[5.5rem] leading-none font-light">{date.day}</span>
        <span className="w-20 border-y border-(--v1-gold)/50 py-2 text-left text-lg tracking-wide italic sm:w-24">
          {date.year}
        </span>
      </Reveal>

      <Reveal as="p" className="v1-caps mt-6 text-(--v1-ink-soft)" delay={0.2}>
        {date.weekday} · {date.time}
      </Reveal>

      <Divider className="mx-auto my-14 w-36 text-(--v1-gold)" />

      <Reveal as="p" className="v1-caps text-(--v1-gold)">
        The venue
      </Reveal>
      <Reveal as="p" className="mx-auto mt-4 max-w-xs text-3xl leading-tight font-light" delay={0.1}>
        {venue}
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap justify-center gap-3" delay={0.2}>
        <a href={mapsUrl(venue)} target="_blank" rel="noreferrer" className={buttonClass}>
          Open in Maps
        </a>
        <a
          href={calendarUrl({ title: `${bride} & ${groom} · Wedding`, date: rawDate, venue })}
          target="_blank"
          rel="noreferrer"
          className={buttonClass}
        >
          Add to calendar
        </a>
      </Reveal>

      <Divider className="mx-auto my-14 w-36 text-(--v1-gold)" />

      <Countdown target={rawDate} />
    </section>
  )
}

const buttonClass =
  'v1-caps rounded-full border border-(--v1-ink)/25 px-5 py-3 text-[0.6rem] transition-colors hover:border-(--v1-gold) hover:bg-(--v1-gold) hover:text-(--v1-paper)'

function Countdown({ target }) {
  const t = useCountdown(target)

  if (t.done) {
    return (
      <Reveal as="p" className="text-2xl italic">
        Today is the day.
      </Reveal>
    )
  }

  const cells = [
    ['Days', t.days],
    ['Hours', t.hours],
    ['Minutes', t.minutes],
    ['Seconds', t.seconds],
  ]

  return (
    <Reveal>
      <p className="v1-caps text-(--v1-gold)">Counting down</p>
      <div className="mt-6 grid grid-cols-4 divide-x divide-(--v1-gold)/30" role="timer" aria-live="off">
        {cells.map(([label, value]) => (
          <div key={label} className="px-1">
            <p className="text-[2.6rem] leading-none font-light lining-nums tabular-nums">{String(value).padStart(2, '0')}</p>
            <p className="v1-caps mt-2 text-[0.5rem] text-(--v1-ink-soft)">{label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
