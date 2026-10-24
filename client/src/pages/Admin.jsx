import { useCallback, useEffect, useState } from 'react'
import { api, errorMessage } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const TEMPLATE_OPTIONS = [
  { value: 'v1', label: 'v1 · Cinematic envelope' },
  { value: 'v2', label: 'v2 · Minimal editorial' },
]
const KEY_STORAGE = 'wedding-admin-key'
const emptyForm = { brideName: '', groomName: '', date: '', venue: '', template: 'v1', photos: '' }

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) ?? '')
  const [keyDraft, setKeyDraft] = useState('')
  const [invites, setInvites] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [selected, setSelected] = useState(null)

  const headers = { 'x-admin-key': adminKey }

  const loadInvites = useCallback(async () => {
    if (!adminKey) return
    try {
      const { data } = await api.get('/invite', { headers: { 'x-admin-key': adminKey } })
      setInvites(data)
      setLoadError(null)
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.removeItem(KEY_STORAGE)
        setAdminKey('')
      }
      setLoadError(errorMessage(err))
    }
  }, [adminKey])

  useEffect(() => {
    loadInvites()
  }, [loadInvites])

  if (!adminKey) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin access</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                sessionStorage.setItem(KEY_STORAGE, keyDraft)
                setAdminKey(keyDraft)
              }}
            >
              <Label htmlFor="admin-key">Admin key</Label>
              <Input id="admin-key" type="password" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} required />
              {loadError && <p className="text-sm text-destructive">{loadError}</p>}
              <Button type="submit">Continue</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-muted/40 p-4 sm:p-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[380px_1fr]">
        <CreateInvite headers={headers} onCreated={loadInvites} />

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitations ({invites.length})</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {loadError && <p className="text-sm text-destructive">{loadError}</p>}
              {invites.length === 0 && !loadError && <p className="text-sm text-muted-foreground">No invitations yet.</p>}
              {invites.map((invite) => (
                <InviteRow
                  key={invite.code}
                  invite={invite}
                  active={selected === invite.code}
                  onSelect={() => setSelected(invite.code)}
                />
              ))}
            </CardContent>
          </Card>

          {selected && <RsvpList key={selected} code={selected} headers={headers} />}
        </div>
      </div>
    </main>
  )
}

function CreateInvite({ headers, onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState({ state: 'idle' })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setStatus({ state: 'saving' })
    try {
      const { data } = await api.post(
        '/invite',
        {
          ...form,
          date: new Date(form.date).toISOString(),
          photos: form.photos
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean),
        },
        { headers },
      )
      setStatus({ state: 'done', link: data.link })
      setForm(emptyForm)
      onCreated()
    } catch (err) {
      setStatus({ state: 'error', message: errorMessage(err) })
    }
  }

  return (
    <Card className="content-start self-start">
      <CardHeader>
        <CardTitle>New invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-3">
            <Field id="brideName" label="Bride">
              <Input id="brideName" value={form.brideName} onChange={set('brideName')} required />
            </Field>
            <Field id="groomName" label="Groom">
              <Input id="groomName" value={form.groomName} onChange={set('groomName')} required />
            </Field>
          </div>
          <Field id="date" label="Date & time">
            <Input id="date" type="datetime-local" value={form.date} onChange={set('date')} required />
          </Field>
          <Field id="venue" label="Venue">
            <Input id="venue" value={form.venue} onChange={set('venue')} required />
          </Field>
          <Field id="template" label="Design">
            <select
              id="template"
              value={form.template}
              onChange={set('template')}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {TEMPLATE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="photos" label="Photo URLs (one per line, optional)">
            <Textarea id="photos" rows={3} value={form.photos} onChange={set('photos')} />
          </Field>

          <Button type="submit" disabled={status.state === 'saving'}>
            {status.state === 'saving' ? 'Creating…' : 'Create & get link'}
          </Button>

          {status.state === 'error' && <p className="text-sm text-destructive">{status.message}</p>}
          {status.state === 'done' && (
            <div className="grid gap-2 rounded-md bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Personal link:</span>
              <a href={status.link} target="_blank" rel="noreferrer" className="font-medium break-all underline">
                {status.link}
              </a>
              <CopyButton text={status.link} />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

function InviteRow({ invite, active, onSelect }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border p-3 text-sm ${active ? 'border-foreground/40 bg-muted' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {invite.brideName} & {invite.groomName}
          <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{invite.template}</span>
        </p>
        <p className="text-muted-foreground">
          {formatDate(invite.date, { dateStyle: 'medium', timeStyle: 'short' })} · {invite.venue}
        </p>
        <a href={invite.link} target="_blank" rel="noreferrer" className="text-xs break-all underline">
          {invite.link}
        </a>
      </div>
      <div className="flex gap-2">
        <CopyButton text={invite.link} />
        <Button size="sm" variant={active ? 'default' : 'outline'} onClick={onSelect}>
          RSVPs ({invite.rsvpCount})
        </Button>
      </div>
    </div>
  )
}

function RsvpList({ code, headers }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const adminKey = headers['x-admin-key']

  useEffect(() => {
    let cancelled = false
    api
      .get(`/invite/${code}/rsvps`, { headers: { 'x-admin-key': adminKey } })
      .then(({ data }) => !cancelled && setData(data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [code, adminKey])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses · {code}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        {error && <p className="text-destructive">{error}</p>}
        {!data && !error && <p className="text-muted-foreground">Loading…</p>}
        {data && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Responses" value={data.summary.responses} />
              <Stat label="Attending" value={data.summary.attending} />
              <Stat label="Declined" value={data.summary.declined} />
              <Stat label="Total guests" value={data.summary.totalGuests} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4 font-normal">Name</th>
                    <th className="py-2 pr-4 font-normal">Attending</th>
                    <th className="py-2 pr-4 font-normal">Guests</th>
                    <th className="py-2 pr-4 font-normal">Message</th>
                    <th className="py-2 font-normal">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.map((r) => (
                    <tr key={r.id} className="border-t align-top">
                      <td className="py-2 pr-4 font-medium">{r.name}</td>
                      <td className="py-2 pr-4">{r.attending ? 'Yes' : 'No'}</td>
                      <td className="py-2 pr-4">{r.guests}</td>
                      <td className="py-2 pr-4 whitespace-pre-wrap text-muted-foreground">{r.message}</td>
                      <td className="py-2 whitespace-nowrap text-muted-foreground">
                        {formatDate(r.createdAt, { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.rsvps.length === 0 && <p className="py-4 text-muted-foreground">No responses yet.</p>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Field({ id, label, children }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? 'Copied' : 'Copy link'}
    </Button>
  )
}
