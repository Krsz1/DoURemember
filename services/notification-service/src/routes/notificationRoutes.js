import express from "express";
import {
  createNotification,
  testSendNotification,
  saveSchedule,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/create", createNotification);
router.post("/send-test", testSendNotification);
router.post("/schedule", saveSchedule);

export default router;

