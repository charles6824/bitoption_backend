import express from "express";
import { admin, protect, user } from "../middleware/authMiddleware.js";
import {
	getAllTransactions,
	getCashflowAnalysis,
	getUserTransactions,
} from "../controllers/transactions.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for managing Transactions
 */

/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: Get all transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *       500:
 *         description: Server error
 */
router.get("/", protect, admin, getAllTransactions);

/**
 * @swagger
 * /api/transaction/user:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user transactions
 *       500:
 *         description: Server error
 */
router.get("/user", protect, user, getUserTransactions);

router.get("/cashflow", protect, getCashflowAnalysis);

export default router;
