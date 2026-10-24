import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

const LINES = [
  'Some stories begin quietly —',
  'a glance, a hello, a walk that lasted longer than planned.',
  'Ours grew into a home, a promise, a life.',
  'Now we would love you beside us as we say forever.',
]

// Tall section with a sticky stage: words light up one by one as you scroll.
export default function Story() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        })
        .fromTo('[data-word]', { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none' })
        .fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="v1-paper relative h-[260svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-9">
        <span data-line className="mb-10 block h-20 w-px origin-top bg-(--v1-gold)" aria-hidden="true" />
        <p className="v1-caps mb-8 text-(--v1-gold)">Our story</p>
        <div className="space-y-5 text-center text-[1.65rem] leading-[1.25] font-light">
          {LINES.map((line, i) => (
            <p key={i} className={i === LINES.length - 1 ? 'italic' : undefined}>
              {line.split(' ').map((word, j) => (
                <span key={j} data-word className="inline-block whitespace-pre">
                  {word}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
