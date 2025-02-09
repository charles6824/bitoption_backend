import express from "express"
import { admin, protect, user } from "../middleware/authMiddleware.js";
import { createInvestment } from "../controllers/investment.js";
const router = express.Router()

/**
 * @swagger
 * /api/investments:
 *   post:
 *     summary: Create a new investment
 *     description: Allows a user to invest in a package if they have sufficient balance.
 *     tags:
 *       - Investments
 *     security:
 *       - BearerAuth: []
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
 *                   userId:
 *                     type: string
 *                     description: The ID of the user making the investment.
 *                   packageId:
 *                     type: string
 *                     description: The ID of the investment package.
 *             required:
 *               - payload
 *     responses:
 *       201:
 *         description: Investment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Investment created successfully
 *                 investment:
 *                   type: object
 *       400:
 *         description: Insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insufficient balance
 *       404:
 *         description: Package or user account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Package not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating investment
 */
 router.post("/", protect, user, createInvestment)


export default router