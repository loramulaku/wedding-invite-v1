import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import Home from '@/pages/Home'
import Admin from '@/pages/Admin'
import { InviteLoading, InviteMessage } from '@/pages/InviteStatus'

// One entry per design. Each design lives in its own folder and is code-split,
// so guests only download the template their invite uses.
// To add a design: create templates/vN/Invite.jsx and add one line here
// (and add "vN" to TEMPLATES in server/src/controllers/inviteController.js).
const templates = {
  v1: lazy(() => import('./templates/v1/Invite.jsx')),
  v2: lazy(() => import('./templates/v2/Invite.jsx')),
}

function InviteRoute() {
  const { code } = useParams()
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    api
      .get(`/invite/${encodeURIComponent(code)}`)
      .then(({ data }) => !cancelled && setState({ status: 'ready', invite: data }))
      .catch((err) => !cancelled && setState({ status: err.response?.status === 404 ? 'notfound' : 'error' }))
    return () => {
      cancelled = true
    }
  }, [code])

  useEffect(() => {
    if (state.status !== 'ready') return
    const { brideName, groomName } = state.invite
    document.title = `${brideName} & ${groomName} · Wedding Invitation`
  }, [state])

  if (state.status === 'loading') return <InviteLoading />
  if (state.status === 'notfound')
    return <InviteMessage title="Invitation not found" body="Please check the link you received and try again." />
  if (state.status === 'error')
    return <InviteMessage title="We couldn't load this invitation" body="Please check your connection and refresh." />

  const Design = templates[state.invite.template] ?? templates.v1
  return (
    <Suspense fallback={<InviteLoading />}>
      <Design data={state.invite} />
    </Suspense>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/i/:code" element={<InviteRoute />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<InviteMessage title="Page not found" body="This page doesn't exist." />} />
    </Routes>
  )
}
