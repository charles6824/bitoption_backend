import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
import { authUser, registerUser, validateAccount } from "../controllers/user.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with an associated account number
 *     consumes:
 *       - application/json
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
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountDetails:
 *                       type: object
 *                     userDetails:
 *                       type: object
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email, or password too weak)
 *
 * /api/users/auth:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user and returns an authentication token
 *     consumes:
 *       - application/json
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
 *                   accountNumber:
 *                     type: string
 *                     example: 0101234567
 *                   password:
 *                     type: string
 *                     example: StrongPassword123!
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *                     userDetails:
 *                       type: object
 *                     accountDetails:
 *                       type: object
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       404:
 *         description: User not found
 * /api/users/validate-account:
 *   post:
 *     summary: Validate user account and send OTP
 *     description: Validates a user's account using their email and sends a one-time password (OTP) via email.
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
 *                     format: email
 *                     example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent via email"
 *                 data:
 *                   type: "null"
 *       404:
 *         description: User not found or unable to update OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 data:
 *                   type: "null"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/validate-account", validateAccount);

export default router;
