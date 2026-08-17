const express = require("express");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Admin-only: create announcement
router.post("/", requireAuth, requireRole("admin"), createAnnouncement);

// Public: get announcement history
router.get("/:eventId", getAnnouncements);

module.exports = router;
