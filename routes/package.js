import express from "express";
import {
	createPackage,
	deletePackage,
	getAllPackages,
	getSinglePackage,
	updatePackage,
} from "../controllers/packages.js";
import { admin, protect, user } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Package Management
 *   description: Package management allows users to create, retrieve, update, and delete packages
 */

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Package Management]
 *     description: Fetches all available packages.
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllPackages);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Package Management]
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
 *                   name:
 *                     type: string
 *                     example: "Package 1"
 *                   interest:
 *                     type: number
 *                     example: 10
 *                   price:
 *                     type: number
 *                     example: 200
 *                   period:
 *                     type: number
 *                     example: 1
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, admin, createPackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get a single package
 *     tags: [Package Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The package ID
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *       404:
 *         description: Package not found
 */
router.get("/:id", protect, user, getSinglePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update a package
 *     tags: [Package Management]
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
 *                   name:
 *                     type: string
 *                     example: "Package 1"
 *                   interest:
 *                     type: number
 *                     example: 10
 *                   price:
 *                     type: number
 *                     example: 200
 *                   period:
 *                     type: number
 *                     example: 1
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The package ID
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 */
router.put("/:id", protect, admin, updatePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Delete a package
 *     tags: [Package Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 */
router.delete("/:id", protect, admin, deletePackage);

export default router;
