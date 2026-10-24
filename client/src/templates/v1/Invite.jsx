import { useEffect, useState } from 'react'
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/pinyon-script/400.css'
import './v1.css'
import { ScrollTrigger } from '@/lib/gsap'
import { dateParts, initials } from '@/lib/format'
import { useLenis } from '@/hooks/useLenis'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import Story from './components/Story'
import Details from './components/Details'
import Gallery from './components/Gallery'
import Rsvp from './components/Rsvp'
import Footer from './components/Footer'

// Design v1 — cinematic envelope reveal with swan & botanical line art.
export default function Invite({ data }) {
  const [opened, setOpened] = useState(false)
  const date = dateParts(data.date)
  const monogram = initials(data.brideName, data.groomName)
  const photos = Array.isArray(data.photos) ? data.photos : []

  useLenis(opened)

  // Keep the page locked under the envelope until it is opened.
  useEffect(() => {
    if (opened) {
      window.scrollTo(0, 0)
      ScrollTrigger.refresh()
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      return
    }
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previous
    }
  }, [opened])

  return (
    <div className="v1-root min-h-svh">
      <main className="relative mx-auto max-w-[480px] shadow-[0_0_80px_rgba(0,0,0,0.35)]">
        <Hero bride={data.brideName} groom={data.groomName} date={date} play={opened} />
        <Story />
        <Details bride={data.brideName} groom={data.groomName} rawDate={data.date} date={date} venue={data.venue} />
        <Gallery photos={photos} />
        <Rsvp code={data.code} />
        <Footer bride={data.brideName} groom={data.groomName} date={date} />
      </main>

      {!opened && (
        <Envelope
          bride={data.brideName}
          groom={data.groomName}
          monogram={monogram}
          dateLabel={`${date.day} · ${date.monthNum} · ${date.year}`}
          onOpen={() => setOpened(true)}
        />
      )}
    </div>
  )
}
