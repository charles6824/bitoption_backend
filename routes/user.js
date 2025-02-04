import express from "express";
import {
  authUser,
  logout,
  registerUser,
  resetPassword,
  validateAccount,
  verifyOtp,
} from "../controllers/user.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Creates a new user account with an associated account number
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
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email, or weak password)
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     description: Logs in a user and returns an authentication token
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
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       404:
 *         description: User not found
 */
router.post("/auth", authUser);

/**
 * @swagger
 * /api/users/validate-account:
 *   post:
 *     summary: Validate user account and send OTP
 *     tags: [Users]
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
 *                     example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found or unable to update OTP
 *       500:
 *         description: Server error
 */
router.post("/validate-account", validateAccount);

/**
 * @swagger
 * /api/users/verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Users]
 *     description: Verifies the OTP sent to the user’s email
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
 *                     example: user@example.com
 *                   otp:
 *                     type: string
 *                     example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 *       404:
 *         description: User not found
 */
router.post("/verifyOtp", verifyOtp);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     description: Allows users to reset their password using a valid OTP
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
 *                     example: user@example.com
 *                   otp:
 *                     type: string
 *                     example: 123456
 *                   newPassword:
 *                     type: string
 *                     example: NewStrongPassword@1
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or weak password
 *       404:
 *         description: User not found
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     description: Logs out the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", logout);

export default router;
