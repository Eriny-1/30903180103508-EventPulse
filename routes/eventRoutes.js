const express = require("express");
const { body, param } = require("express-validator");

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events until this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of events per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, registrations]
 *           default: date
 *         description: Field used for sorting
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: Events returned successfully
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get one event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event MongoDB ID
 *     responses:
 *       200:
 *         description: Event returned successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - city
 *               - venue
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Workshop
 *               description:
 *                 type: string
 *                 example: Learn modern frontend development
 *               category:
 *                 type: string
 *                 example: 64f0a1b2c3d4e5f678901234
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-01T10:00:00.000Z
 *               city:
 *                 type: string
 *                 example: Cairo
 *               venue:
 *                 type: string
 *                 example: Cairo University
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       422:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event MongoDB ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Event not found
 */

// ==================== PUBLIC ROUTES ====================

router.get("/", getEvents);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid event ID")],
  validate,
  getEventById,
);

// ==================== ADMIN ROUTES ====================

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),

    body("category")
      .isMongoId()
      .withMessage("Category must be a valid MongoId"),

    body("date").isISO8601().withMessage("Date must be valid"),

    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive number"),
  ],
  validate,
  createEvent,
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  [param("id").isMongoId().withMessage("Invalid event ID")],
  validate,
  updateEvent,
);

router.delete("/:id", requireAuth, requireRole("admin"), deleteEvent);

module.exports = router;
