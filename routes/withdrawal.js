import express from "express";
import {
	approveWithdrawal,
	declineWithdrawal,
	getAllWithdrawals,
	getSingleWithdrawal,
	getUserWithdrawals,
	initiateWithdrawal,
	sendOTP,
} from "../controllers/withdrawal.js";
import { admin, protect, user } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Withdrawals
 *   description: Endpoints for managing withdrawals
 */

/**
 * @swagger
 * /api/withdrawal:
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
 * /api/withdrawal/{id}:
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
 * /api/withdrawal/{id}/approve:
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
router.put("/:id/approve", protect, admin, approveWithdrawal);

/**
 * @swagger
 * /api/withdrawal/{id}/decline:
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
router.put("/:id/decline", protect, admin, declineWithdrawal);

/**
 * @swagger
 * /api/withdrawal/initiate:
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
 *                       routing:
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
 * /api/withdrawal/user:
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
 * /api/withdrawal/user/verify-otp:
 *   get:
 *     summary: Verify OTP for Withdrawal
 *     tags: [Withdrawals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user withdrawals
 *       500:
 *         description: Server error
 */
router.put("/user/verify-otp", protect, user, sendOTP);

export default router;
