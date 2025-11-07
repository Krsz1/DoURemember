import express from "express";
import { createAudit } from "../controllers/auditController.js";

const router = express.Router();

// Create audit entry (public endpoint)
router.post("/", createAudit);

export default router;
