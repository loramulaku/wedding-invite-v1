import { customAlphabet } from "nanoid";
import { prisma } from "../lib/prisma.js";

// Lowercase + digits only: easy to read aloud and safe in any messenger.
const generateCode = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 6);

export const TEMPLATES = ["v1", "v2"];

const publicBaseUrl = () => (process.env.PUBLIC_BASE_URL || "http://localhost:5173").replace(/\/$/, "");
const linkFor = (code) => `${publicBaseUrl()}/i/${code}`;

// Shape returned to the public invite page — no internal ids.
const toPublic = (invite) => ({
  code: invite.code,
  template: invite.template,
  brideName: invite.brideName,
  groomName: invite.groomName,
  date: invite.date,
  venue: invite.venue,
  photos: invite.photos ?? [],
  updatedAt: invite.updatedAt,
});

function parseInviteBody(body, { partial = false } = {}) {
  const errors = [];
  const data = {};
  const str = (key) => {
    const value = body[key];
    if (value === undefined) {
      if (!partial) errors.push(`${key} is required`);
      return;
    }
    if (typeof value !== "string" || !value.trim()) return errors.push(`${key} must be a non-empty string`);
    data[key] = value.trim();
  };

  str("brideName");
  str("groomName");
  str("venue");

  if (body.template !== undefined || !partial) {
    const template = body.template ?? "v1";
    if (!TEMPLATES.includes(template)) errors.push(`template must be one of: ${TEMPLATES.join(", ")}`);
    else data.template = template;
  }

  if (body.date !== undefined) {
    const date = new Date(body.date);
    if (Number.isNaN(date.getTime())) errors.push("date must be a valid ISO date");
    else data.date = date;
  } else if (!partial) {
    errors.push("date is required");
  }

  if (body.photos !== undefined) {
    if (!Array.isArray(body.photos) || body.photos.some((p) => typeof p !== "string")) {
      errors.push("photos must be an array of URL strings");
    } else {
      data.photos = body.photos;
    }
  }

  return { data, errors };
}

export async function createInvite(req, res) {
  const { data, errors } = parseInviteBody(req.body ?? {});
  if (errors.length) return res.status(400).json({ errors });

  // A 6-char code from a 32-char alphabet gives ~1B combinations; retry on the rare collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const invite = await prisma.invite.create({ data: { ...data, code: generateCode() } });
      return res.status(201).json({ invite: toPublic(invite), link: linkFor(invite.code) });
    } catch (err) {
      if (err.code !== "P2002") throw err;
    }
  }
  res.status(500).json({ error: "Could not generate a unique code, please retry" });
}

export async function listInvites(_req, res) {
  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rsvps: true } } },
  });
  res.json(
    invites.map((invite) => ({ ...toPublic(invite), link: linkFor(invite.code), rsvpCount: invite._count.rsvps }))
  );
}

export async function getInvite(req, res) {
  const invite = await prisma.invite.findUnique({ where: { code: req.params.code } });
  if (!invite) return res.status(404).json({ error: "Invite not found" });
  res.json(toPublic(invite));
}

export async function updateInvite(req, res) {
  const { data, errors } = parseInviteBody(req.body ?? {}, { partial: true });
  if (errors.length) return res.status(400).json({ errors });

  try {
    const invite = await prisma.invite.update({ where: { code: req.params.code }, data });
    res.json({ invite: toPublic(invite), link: linkFor(invite.code) });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Invite not found" });
    throw err;
  }
}

export async function submitRsvp(req, res) {
  const { name, attending, guests, message } = req.body ?? {};
  const errors = [];
  if (typeof name !== "string" || !name.trim()) errors.push("name is required");
  if (typeof attending !== "boolean") errors.push("attending must be true or false");
  const guestCount = attending ? Number(guests ?? 1) : 0;
  if (!Number.isInteger(guestCount) || guestCount < 0 || guestCount > 20) errors.push("guests must be an integer 0–20");
  if (message !== undefined && message !== null && typeof message !== "string") errors.push("message must be a string");
  if (errors.length) return res.status(400).json({ errors });

  const invite = await prisma.invite.findUnique({ where: { code: req.params.code }, select: { id: true } });
  if (!invite) return res.status(404).json({ error: "Invite not found" });

  const rsvp = await prisma.rsvp.create({
    data: {
      inviteId: invite.id,
      name: name.trim().slice(0, 191),
      attending,
      guests: guestCount,
      message: message?.trim().slice(0, 2000) || null,
    },
  });
  res.status(201).json({ id: rsvp.id, name: rsvp.name, attending: rsvp.attending, guests: rsvp.guests });
}

export async function listRsvps(req, res) {
  const invite = await prisma.invite.findUnique({
    where: { code: req.params.code },
    include: { rsvps: { orderBy: { createdAt: "desc" } } },
  });
  if (!invite) return res.status(404).json({ error: "Invite not found" });

  const attending = invite.rsvps.filter((r) => r.attending);
  res.json({
    summary: {
      responses: invite.rsvps.length,
      attending: attending.length,
      declined: invite.rsvps.length - attending.length,
      totalGuests: attending.reduce((sum, r) => sum + r.guests, 0),
    },
    rsvps: invite.rsvps,
  });
}
