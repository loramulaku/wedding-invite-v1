import "dotenv/config";
import express from "express";
import cors from "cors";
import inviteRoutes from "./routes/inviteRoutes.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/invite", inviteRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Express 5 forwards async errors here automatically.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
