import express from "express";
import { approveWithdrawal, declineWithdrawal, getAllWithdrawals, getSingleWithdrawal, getUserWithdrawals, initiateWithdrawal } from "../controllers/withdrawal.js";
import { admin, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Withdrawals
 *   description: Endpoints for managing withdrawals
 */

/**
 * @swagger
 * /api/withdrawals/initiate:
 *   post:
 *     summary: Initiate a withdrawal request
 *     tags: [Withdrawals]
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
 *                   mode:
 *                     type: string
 *                     enum: [crypto, bank]
 *                   description:
 *                     type: string
 *                   cryptoWallet:
 *                     type: string
 *                   bankDetails:
 *                     type: object
 *                     properties:
 *                       accountNumber:
 *                         type: string
 *                       accountName:
 *                         type: string
 *                       bankName:
 *                         type: string
 *     responses:
 *       201:
 *         description: Withdrawal request created successfully
 *       400:
 *         description: Invalid withdrawal amount
 *       500:
 *         description: Server error
 */
router.post("/initiate", protect, initiateWithdrawal);

/**
 * @swagger
 * /api/withdrawals:
 *   get:
 *     summary: Get all withdrawals (admin only)
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all withdrawals
 *       500:
 *         description: Server error
 */
router.get("/", protect, admin, getAllWithdrawals);

/**
 * @swagger
 * /api/withdrawals/user:
 *   get:
 *     summary: Get all withdrawals for the logged-in user
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user withdrawals
 *       500:
 *         description: Server error
 */
router.get("/user", protect, getUserWithdrawals);

/**
 * @swagger
 * /api/withdrawals/{id}:
 *   get:
 *     summary: Get a single withdrawal by ID
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdrawal ID
 *     responses:
 *       200:
 *         description: Withdrawal details
 *       404:
 *         description: Withdrawal not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, getSingleWithdrawal);

/**
 * @swagger
 * /api/withdrawals/{id}/approve:
 *   put:
 *     summary: Approve a withdrawal (admin only)
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdrawal ID
 *     responses:
 *       200:
 *         description: Withdrawal approved successfully
 *       400:
 *         description: Invalid withdrawal request
 *       500:
 *         description: Server error
 */
router.patch("/:id/approve", protect, admin, approveWithdrawal);

/**
 * @swagger
 * /api/withdrawals/{id}/decline:
 *   put:
 *     summary: Decline a withdrawal (admin only)
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdrawal ID
 *     responses:
 *       200:
 *         description: Withdrawal declined successfully
 *       400:
 *         description: Invalid withdrawal request
 *       500:
 *         description: Server error
 */
router.patch("/:id/decline", protect, admin, declineWithdrawal);

export default router;
