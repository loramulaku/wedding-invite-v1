import { useState } from 'react'
import { motion } from 'framer-motion'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import { calendarUrl, dateParts, mapsUrl } from '@/lib/format'
import { useLenis } from '@/hooks/useLenis'
import { useRsvp } from '@/hooks/useRsvp'

// Design v2 — minimal editorial: black on white, oversized serif, hairline rules.
const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" }
const ease = [0.22, 1, 0.36, 1]

function Rise({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export default function Invite({ data }) {
  const date = dateParts(data.date)
  useLenis(true)

  return (
    <div className="min-h-svh bg-neutral-100 text-neutral-950">
      <main className="mx-auto max-w-[480px] bg-white">
        <section className="flex min-h-svh flex-col justify-between px-7 pt-10 pb-12">
          <div className="flex justify-between text-[0.65rem] tracking-[0.25em] uppercase">
            <span>Save the date</span>
            <span>
              {date.day}.{date.monthNum}.{date.year}
            </span>
          </div>

          <h1 style={serif} className="text-[clamp(4rem,22vw,6.5rem)] leading-[0.85] font-normal">
            {[data.brideName, '&', data.groomName].map((word, i) => (
              <motion.span
                key={i}
                className={`block ${i === 1 ? 'pl-[18%] italic' : ''} ${i === 2 ? 'text-right' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.18, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="max-w-[16rem] text-sm leading-relaxed text-neutral-500">
            Are getting married and would love for you to celebrate with them.
          </p>
        </section>

        <section className="border-t border-neutral-200 px-7 py-20">
          <Rise>
            <dl className="grid gap-10">
              <Row label="When" value={`${date.weekday}, ${date.day} ${date.month} ${date.year}`} sub={date.time} />
              <Row label="Where" value={data.venue} />
            </dl>
          </Rise>
          <Rise delay={0.1} className="mt-10 flex gap-6 text-xs tracking-[0.2em] uppercase underline underline-offset-8">
            <a href={mapsUrl(data.venue)} target="_blank" rel="noreferrer">
              Map
            </a>
            <a
              href={calendarUrl({ title: `${data.brideName} & ${data.groomName} · Wedding`, date: data.date, venue: data.venue })}
              target="_blank"
              rel="noreferrer"
            >
              Calendar
            </a>
          </Rise>
        </section>

        {Array.isArray(data.photos) && data.photos.length > 0 && (
          <section className="grid gap-2 px-2">
            {data.photos.map((src) => (
              <Rise key={src}>
                <img src={src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover grayscale" />
              </Rise>
            ))}
          </section>
        )}

        <RsvpForm code={data.code} />
      </main>
    </div>
  )
}

function Row({ label, value, sub }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] items-baseline gap-4">
      <dt className="text-[0.65rem] tracking-[0.25em] text-neutral-400 uppercase">{label}</dt>
      <dd style={serif} className="text-3xl leading-tight">
        {value}
        {sub && <span className="mt-1 block text-lg text-neutral-500 italic">{sub}</span>}
      </dd>
    </div>
  )
}

function RsvpForm({ code }) {
  const { status, error, submit } = useRsvp(code)
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(null)
  const [guests, setGuests] = useState(1)

  return (
    <section className="border-t border-neutral-200 px-7 py-20">
      <h2 style={serif} className="text-5xl">
        RSVP
      </h2>
      {status === 'success' ? (
        <p style={serif} className="mt-8 text-2xl italic">
          Thank you — your reply has been received.
        </p>
      ) : (
        <form
          className="mt-10 grid gap-6"
          onSubmit={(e) => {
            e.preventDefault()
            submit({ name: name.trim(), attending, guests })
          }}
        >
          <input
            className="border-b border-neutral-300 py-2 text-lg outline-none focus:border-neutral-950"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 border border-neutral-950 text-xs tracking-[0.2em] uppercase">
            {[
              [true, 'Attending'],
              [false, 'Not attending'],
            ].map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={attending === value}
                onClick={() => setAttending(value)}
                className={`py-4 transition-colors ${attending === value ? 'bg-neutral-950 text-white' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
          {attending && (
            <label className="flex items-center justify-between text-sm">
              Guests (including you)
              <input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                className="w-16 border-b border-neutral-300 py-1 text-center text-lg outline-none"
              />
            </label>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!name.trim() || attending === null || status === 'submitting'}
            className="bg-neutral-950 py-4 text-xs tracking-[0.25em] text-white uppercase disabled:opacity-30"
          >
            {status === 'submitting' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </section>
  )
}
