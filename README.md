# Wedding Invites

A mobile-first digital wedding invitation platform. Every invitation gets a personal link (`/i/<code>`) and renders one of several designs, chosen per invitation.

- **client/**: React + Vite, Tailwind v4, shadcn/ui, framer-motion, GSAP, Lenis
- **server/**: Express 5, Prisma 6, MySQL

## Setup

Requires Node 20+ and MySQL running on `localhost:3306`.

```bash
# Backend
cd server
npm install
cp .env.example .env          # set DATABASE_URL and ADMIN_KEY
npx prisma migrate dev        # creates the wedding_invites database + tables
npm run db:seed               # optional: demo invites /i/demo01 (v1), /i/demo02 (v2)
npm run dev                   # http://localhost:5000

# Frontend (second terminal)
cd client
npm install
npm run dev                   # http://localhost:5173
```

In dev, Vite proxies `/api` to the server, so no client env is needed.

Admin panel: http://localhost:5173/admin. Enter the `ADMIN_KEY` from `server/.env` to create invites, copy their links and view RSVPs.

## API

| Method | Path | Access | |
| --- | --- | --- | --- |
| GET | `/api/health` | public | `{ status: "ok" }` |
| GET | `/api/invite/:code` | public | invite data + template |
| POST | `/api/invite/:code/rsvp` | public | `{ name, attending, guests, message? }` |
| POST | `/api/invite` | admin | create invite → `{ invite, link }` |
| GET | `/api/invite` | admin | list invites with RSVP counts |
| PATCH | `/api/invite/:code` | admin | edit an invite (the same link shows the update) |
| GET | `/api/invite/:code/rsvps` | admin | RSVPs + summary |

Admin endpoints require the `x-admin-key` header.

## Adding a design

1. Create `client/src/templates/vN/Invite.jsx`. It receives `data` (the invite) as its only prop.
2. Add one line to the `templates` map in `client/src/App.jsx`.
3. Add `"vN"` to `TEMPLATES` in `server/src/controllers/inviteController.js` (and to the admin dropdown in `client/src/pages/Admin.jsx`).

Keep everything a design needs inside its own folder: styles, fonts and components. Shared logic lives in `client/src/hooks` (`useRsvp`, `useLenis`, `useCountdown`) and `client/src/lib`. Because designs don't touch each other's files, people can build them in parallel branches (`feature/v3-design`, `feature/backend-rsvp`, …) and merge through pull requests without conflicts.
