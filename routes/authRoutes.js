const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { register, login } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sara Ahmed
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sara@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data or email already exists
 *       422:
 *         description: Validation error
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sara@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       422:
 *         description: Validation error
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login,
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Authentication required
 */
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      userId: req.user.userId,
      role: req.user.role,
    },
  });
});

module.exports = router;
