const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

// =========================
// Register for Event
// =========================

router.post(
  "/",
  requireAuth,
  [body("eventId").isMongoId().withMessage("eventId must be a valid MongoId")],
  validate,
  registerForEvent,
);

// =========================
// My Registrations
// =========================

router.get("/my", requireAuth, getMyRegistrations);

// =========================
// Cancel Registration
// =========================

router.delete("/:id", requireAuth, cancelRegistration);

module.exports = router;
