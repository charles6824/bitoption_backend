import express from "express"
import { admin, protect, user } from "../middleware/authMiddleware.js";
import { approveFunding, declineFunding, fundWallet, fundWithBank, fundWithCrypto, getAllDeposits } from "../controllers/deposit.js";
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Deposit Management
 *   description: Endpoints for funding wallets and managing deposits
 */

router.get("/", protect, admin, getAllDeposits)

/**
 * @swagger
 * /api/deposit/fund-wallet:
 *   post:
 *     summary: Fund a user's wallet (Admin only)
 *     tags: [Deposit Management]
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
 *                   accountName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *     responses:
 *       201:
 *         description: Wallet funded successfully
 *       500:
 *         description: Internal server error
 */
router.post("/fund-wallet", protect, admin, fundWallet);

/**
 * @swagger
 * /api/deposit/fund-bank:
 *   post:
 *     summary: Fund a wallet using bank deposit (User only)
 *     tags: [Deposit Management]
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
 *                   accountName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *                   narration:
 *                     type: string
 *     responses:
 *       201:
 *         description: Deposit request created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/fund-bank", protect, user, fundWithBank);

/**
 * @swagger
 * /api/deposit/fund-crypto:
 *   post:
 *     summary: Fund a wallet using cryptocurrency (User only)
 *     tags: [Deposit Management]
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
 *                   narration:
 *                     type: string
 *     responses:
 *       201:
 *         description: Crypto deposit request created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/fund-crypto", protect, user, fundWithCrypto);

/**
 * @swagger
 * /api/deposit/approve/{depositId}:
 *   put:
 *     summary: Approve a deposit (Admin only)
 *     tags: [Deposit Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: depositId
 *         required: true
 *         schema:
 *           type: string
 *         description: The deposit ID to approve
 *     responses:
 *       200:
 *         description: Deposit approved successfully
 *       404:
 *         description: Deposit not found
 *       500:
 *         description: Internal server error
 */
router.put("/approve/:depositId", protect, admin, approveFunding);

/**
 * @swagger
 * /api/deposit/decline/{depositId}:
 *   put:
 *     summary: Decline a deposit (Admin only)
 *     tags: [Deposit Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: depositId
 *         required: true
 *         schema:
 *           type: string
 *         description: The deposit ID to decline
 *     responses:
 *       200:
 *         description: Deposit declined successfully
 *       404:
 *         description: Deposit not found
 *       500:
 *         description: Internal server error
 */
router.put("/decline/:depositId", protect, admin, declineFunding);

export default router