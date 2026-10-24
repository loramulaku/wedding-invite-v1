import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  createInvite,
  getInvite,
  listInvites,
  listRsvps,
  submitRsvp,
  updateInvite,
} from "../controllers/inviteController.js";

const router = Router();

// Admin
router.get("/", requireAdmin, listInvites);
router.post("/", requireAdmin, createInvite);
router.patch("/:code", requireAdmin, updateInvite);
router.get("/:code/rsvps", requireAdmin, listRsvps);

// Public
router.get("/:code", getInvite);
router.post("/:code/rsvp", submitRsvp);

export default router;
