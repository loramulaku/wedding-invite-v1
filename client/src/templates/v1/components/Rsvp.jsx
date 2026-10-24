import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRsvp } from '@/hooks/useRsvp'
import { Sprig } from './Ornaments'
import Reveal from './Reveal'

export default function Rsvp({ code }) {
  const { status, error, submit, reset } = useRsvp(code)
  const [form, setForm] = useState({ name: '', attending: null, guests: 1, message: '' })

  const canSubmit = form.name.trim() && form.attending !== null && status !== 'submitting'

  return (
    <section id="rsvp" className="v1-night relative overflow-hidden px-8 py-28">
      <Sprig className="absolute -top-4 -left-6 h-40 rotate-[20deg] text-(--v1-gold)/40" />

      <Reveal as="p" className="v1-caps text-center text-(--v1-gold)">
        Kindly reply
      </Reveal>
      <Reveal as="h2" className="v1-script mt-4 text-center text-6xl" delay={0.1}>
        RSVP
      </Reveal>
      <Reveal as="p" className="mt-4 text-center text-lg text-(--v1-paper)/70 italic" delay={0.2}>
        We would be grateful for your answer
      </Reveal>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="thanks"
            className="mt-14 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg viewBox="0 0 52 52" className="mx-auto size-14 text-(--v1-gold)" aria-hidden="true">
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
              <motion.path d="M16 27 L23 34 L37 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
            </svg>
            <p className="mt-6 text-3xl font-light">
              {form.attending ? 'We can’t wait to celebrate with you.' : 'You will be missed.'}
            </p>
            <p className="mt-3 text-(--v1-paper)/60 italic">Thank you for letting us know, {form.name.split(' ')[0]}.</p>
            <button
              type="button"
              className="v1-caps mt-10 text-[0.6rem] text-(--v1-gold) underline underline-offset-8"
              onClick={() => {
                setForm({ name: '', attending: null, guests: 1, message: '' })
                reset()
              }}
            >
              Reply for someone else
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="mx-auto mt-14 grid max-w-sm gap-9"
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => {
              e.preventDefault()
              if (canSubmit) submit({ ...form, name: form.name.trim() })
            }}
          >
            <label className="grid gap-1">
              <span className="v1-caps text-[0.55rem] text-(--v1-paper)/60">Your name</span>
              <input
                className="v1-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                autoComplete="name"
                maxLength={120}
                required
              />
            </label>

            <fieldset className="grid gap-3">
              <legend className="v1-caps mb-3 text-[0.55rem] text-(--v1-paper)/60">Will you attend?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [true, 'Joyfully accept'],
                  [false, 'Regretfully decline'],
                ].map(([value, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={form.attending === value}
                    onClick={() => setForm({ ...form, attending: value })}
                    className={`rounded-full border px-2 py-3.5 text-[1.05rem] whitespace-nowrap transition-all duration-500 ${
                      form.attending === value
                        ? 'border-(--v1-gold) bg-(--v1-gold) text-(--v1-night)'
                        : 'border-(--v1-paper)/25 text-(--v1-paper)/80 hover:border-(--v1-paper)/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {form.attending && (
                <motion.div
                  className="grid gap-3 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="v1-caps text-[0.55rem] text-(--v1-paper)/60">Number of guests (including you)</span>
                  <div className="flex items-center justify-between border-b border-(--v1-paper)/30 pb-2">
                    <StepButton label="Fewer guests" onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}>
                      −
                    </StepButton>
                    <span className="text-4xl font-light lining-nums tabular-nums" aria-live="polite">
                      {form.guests}
                    </span>
                    <StepButton label="More guests" onClick={() => setForm({ ...form, guests: Math.min(10, form.guests + 1) })}>
                      +
                    </StepButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="grid gap-1">
              <span className="v1-caps text-[0.55rem] text-(--v1-paper)/60">A note for the couple (optional)</span>
              <textarea
                className="v1-input resize-none"
                rows={2}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Wishes, dietary needs…"
                maxLength={2000}
              />
            </label>

            {error && <p className="text-center text-[#e8a5a5]">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="v1-caps mt-2 rounded-full bg-(--v1-paper) py-4 text-(--v1-night) transition-opacity disabled:opacity-35"
            >
              {status === 'submitting' ? 'Sending…' : 'Send reply'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  )
}

function StepButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-(--v1-paper)/25 text-2xl transition-colors hover:border-(--v1-gold)"
    >
      {children}
    </button>
  )
}
