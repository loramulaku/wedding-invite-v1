import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import Reveal from './Reveal'

// Staggered photo column with gentle parallax. Hidden when no photos are set.
export default function Gallery({ photos }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!photos.length || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [photos])

  if (!photos.length) return null

  return (
    <section ref={root} className="v1-paper px-6 pb-28">
      <Reveal as="p" className="v1-caps mb-10 text-center text-(--v1-gold)">
        Moments
      </Reveal>
      <div className="grid grid-cols-2 gap-3">
        {photos.map((src, i) => (
          <div
            key={src}
            className={`overflow-hidden rounded-[2px] ${i % 3 === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-[3/4]'} ${i % 3 === 2 ? 'mt-10' : ''}`}
          >
            <img
              data-parallax
              src={src}
              alt=""
              loading="lazy"
              className="h-[116%] w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
