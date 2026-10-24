// Minimal shared-secret guard for admin endpoints. Send the key as the
// `x-admin-key` header. Replace with real auth before going to production.
export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return res.status(500).json({ error: "ADMIN_KEY is not configured on the server" });
  }
  if (req.get("x-admin-key") !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
