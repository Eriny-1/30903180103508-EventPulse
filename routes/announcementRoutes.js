const express = require("express");
const { body, param } = require("express-validator");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Create an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - text
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 64f0a1b2c3d4e5f678901234
 *               text:
 *                 type: string
 *                 example: The event starts at 10 AM.
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       422:
 *         description: Validation error
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("eventId").isMongoId().withMessage("eventId must be a valid MongoId"),
    body("text").trim().notEmpty().withMessage("Announcement text is required"),
  ],
  validate,
  createAnnouncement,
);

/**
 * @swagger
 * /api/announcements/{eventId}:
 *   get:
 *     summary: Get announcement history for an event
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event MongoDB ID
 *     responses:
 *       200:
 *         description: Announcement history returned successfully
 *       404:
 *         description: Event not found
 */
router.get(
  "/:eventId",
  [param("eventId").isMongoId().withMessage("Invalid event ID")],
  validate,
  getAnnouncements,
);

module.exports = router;
