import { useState } from 'react'
import { api, errorMessage } from '@/lib/api'

// Shared RSVP logic; each template renders its own form UI on top of it.
export function useRsvp(code) {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState(null)

  async function submit({ name, attending, guests, message }) {
    setStatus('submitting')
    setError(null)
    try {
      await api.post(`/invite/${encodeURIComponent(code)}/rsvp`, {
        name,
        attending,
        guests: attending ? guests : 0,
        message: message || undefined,
      })
      setStatus('success')
    } catch (err) {
      setError(errorMessage(err))
      setStatus('error')
    }
  }

  return { status, error, submit, reset: () => setStatus('idle') }
}
