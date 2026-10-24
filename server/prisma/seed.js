// Creates a demo invite with a fixed code so the client can be tried at /i/demo01
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = {
  template: "v1",
  brideName: "Elena",
  groomName: "Arben",
  date: new Date("2027-06-12T17:00:00Z"),
  venue: "Villa Gërmia, Prishtina",
  photos: [],
};

await prisma.invite.upsert({ where: { code: "demo01" }, update: data, create: { code: "demo01", ...data } });
await prisma.invite.upsert({
  where: { code: "demo02" },
  update: { ...data, template: "v2" },
  create: { code: "demo02", ...data, template: "v2" },
});
console.log("Seeded demo invites: /i/demo01 (v1), /i/demo02 (v2)");
await prisma.$disconnect();
