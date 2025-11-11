const express = require("express");
const {
  createNotification,
  testSendNotification,
  saveSchedule,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/create", createNotification);
router.post("/send-test", testSendNotification);
router.post("/schedule", saveSchedule);

module.exports = router;
