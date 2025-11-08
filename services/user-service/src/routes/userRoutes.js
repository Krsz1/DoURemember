import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  getUsersWithEvaluationsAndAudits,
  getMyPatients,
} from "../controllers/userController.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { authenticate, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect routes: require authentication for reads; only admins can create/update users
router.post("/", authenticate, requireRole(["admin"]), validate(createUserSchema), createUser);
router.get("/", authenticate, getUsers);
router.get("/audit", getUsersWithEvaluationsAndAudits);
// List patients assigned to a doctor (public for now - no tokens). Pass doctorId as path param.
router.get("/my-patients/:doctorId", getMyPatients);
router.get("/:uid", authenticate, getUser);
router.put("/:userId", authenticate, requireRole(["admin"]), validate(updateUserSchema), updateUser);

export default router;
