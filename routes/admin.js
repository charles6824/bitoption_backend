import express from "express";
import { authAdmin, changePassword, createAdmin } from "../controllers/admin.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     description: Creates a new Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payload:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   password:
 *                     type: string
 *                     example: Password@2
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email, or weak password)
 */
router.post("/register", createAdmin);

/**
 * @swagger
 * /api/admin/auth:
 *   post:
 *     summary: Authenticate admin
 *     tags: [Admin]
 *     description: Logs in an admin and returns an authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payload:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   password:
 *                     type: string
 *                     example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       404:
 *         description: Admin not found
 */
router.post("/auth", authAdmin);

router.put("/change-password", protect, admin, changePassword)

export default router;
