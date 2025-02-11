import express from "express";
import { getAccountDetails, getAccountDetailsByAccountNumber, getBalance } from "../controllers/account.js";
import { protect, user } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account Management
 *   description: account management is a module that allows users see their current balance, get Account information and generate more accounts
 */


/**
 * @swagger
 * /api/accounts/balance:
 *   get:
 *     summary: Fetch user's balance
 *     tags: [Account Management]
 *     description: Fetches the balance of the currently logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current balance of the user
 *       400:
 *         description: Bad request (e.g., missing or invalid token)
 *       401:
 *         description: Unauthorized (e.g., invalid or expired token)
 */
router.get("/balance", protect, user, getBalance);

/**
 * @swagger
 * /api/accounts/details:
 *   get:
 *     summary: Fetch user's account details
 *     tags: [Account Management]
 *     description: Fetches the account details of the currently logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountNumber:
 *                   type: string
 *                   description: The account number of the user
 *                 accountType:
 *                   type: string
 *                   description: The type of account (e.g., savings, current)
 *                 balance:
 *                   type: number
 *                   description: The current balance of the user
 *       400:
 *         description: Bad request (e.g., missing or invalid token)
 *       401:
 *         description: Unauthorized (e.g., invalid or expired token)
 */
router.get("/details", protect, user, getAccountDetails); 

/**
 * @swagger
 * /api/accounts/{accountNumber}:
 *   get:
 *     summary: Get a single package
 *     tags: [Account Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The Account number
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *       404:
 *         description: Account not found
 */
router.get("/:accountNumber", protect, getAccountDetailsByAccountNumber)



export default router;
