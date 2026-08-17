const express = require("express");
const { body, param } = require("express-validator");

const router = express.Router();

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Register for an event
 *     tags: [Registrations]
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
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 64f0a1b2c3d4e5f678901234
 *     responses:
 *       201:
 *         description: Registration created successfully
 *       400:
 *         description: Already registered or event is full
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Event not found
 *       422:
 *         description: Validation error
 */
router.post(
  "/",
  requireAuth,
  [body("eventId").isMongoId().withMessage("eventId must be a valid MongoId")],
  validate,
  registerForEvent,
);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     summary: Get my registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User registrations returned successfully
 *       401:
 *         description: Authentication required
 */
router.get("/my", requireAuth, getMyRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration MongoDB ID
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Cannot cancel another user's registration
 *       404:
 *         description: Registration not found
 */
router.delete(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Invalid registration ID")],
  validate,
  cancelRegistration,
);

module.exports = router;
