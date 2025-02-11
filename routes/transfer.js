import express from "express"
import { createTransfer } from "../controllers/transfer.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Transfer
 *   description: Endpoints for managing Transfers
 */
/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transfer to a Recipient
 *     description: Allows a user to transfer to a recipient within the Application.
 *     tags:
 *       - Transfer
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
 *                   amount:
 *                     type: number
 *                     description: The amount you wish to transfer
 *                   accountNumber:
 *                     type: string
 *                     description: The Recipient Account Number
 *                   description:
 *                     type: string
 *                     description: narration to be included
 *             required:
 *               - payload
 *     responses:
 *       201:
 *         description: Transfer sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transfer sent successfully
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Transferring fund
 */
router.post("/", protect, createTransfer)


export default router