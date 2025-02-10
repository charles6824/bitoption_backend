import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Deposit from "../models/deposit.js";
import { createTransaction } from "../utils/transactions.js";
import Transaction from "../models/transaction.js";

// Fund Wallet (Admin)
export const fundWallet = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload; // Extracting payload
		const { amount, accountName, accountNumber, narration, method } = formData;
		const reference = uuidv4();
		const userId = req.user.id;

		const newDeposit = new Deposit({
			amount,
			accountName,
			accountNumber,
			narration,
			user: userId,
			method,
			reference,
			status: "approved", // Admin funding, auto-approved
		});

		await newDeposit.save();
		await createTransaction({
			user: userId,
			amount: amount,
			description: `Deposit/247BO/${narration ? narration : accountNumber}`,
			reference: reference,
			status: "completed",
			type: "inflow",
		});
		return res
			.status(201)
			.json({ message: "Wallet funded successfully", deposit: newDeposit });
	} catch (error) {
		return res.status(500).json({ message: "Error funding wallet", error });
	}
});

// Fund with Bank (User)
export const fundWithBank = async (req, res) => {
	try {
		const formData = req.body.payload;
		const userId = req.user.id;
		const { amount, accountName, accountNumber, narration } = formData;
		const reference = uuidv4();

		const newDeposit = new Deposit({
			amount,
			accountName,
			accountNumber,
			narration,
			user: userId,
			method: "bank",
			reference,
			status: "pending",
		});

		await newDeposit.save();
		await createTransaction({
			user: userId,
			amount: amount,
			description: `Deposit/247BO/${
				narration ? narration : accountNumber
			} bank`,
			reference: reference,
			status: "pending",
			type: "inflow",
		});
		return res
			.status(201)
			.json({ message: "Deposit request created", deposit: newDeposit });
	} catch (error) {
		return res.status(500).json({ message: "Error processing deposit", error });
	}
};

// Fund with Crypto (User)
export const fundWithCrypto = async (req, res) => {
	try {
		const formData = req.body.payload;
		const { amount, narration } = formData;
		const reference = uuidv4();
		const userId = req.user.id;

		const newDeposit = new Deposit({
			amount,
			user: userId,
			method: "crypto",
			reference,
			narration,
			status: "pending",
		});

		await newDeposit.save();
		await createTransaction({
			user: userId,
			amount: amount,
			description: `Deposit/247BO/${
				narration ? narration : accountNumber
			} crypto`,
			reference: reference,
			status: "pending",
			type: "inflow",
		});
		return res.json({
			message: "Crypto deposit request created",
			data: newDeposit,
			status: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error processing crypto deposit",
			data: error,
			status: false,
		});
	}
};

// Approve Funding (Admin)
export const approveFunding = async (req, res) => {
	try {
		const { depositId } = req.params;

		const transactionDeposit = await Deposit.findById(depositId);
		const deposit = await Deposit.findByIdAndUpdate(
			depositId,
			{ status: "approved" },
			{ new: true }
		);

		const transaction = await Transaction.findOne({
			reference: transactionDeposit.reference,
		});
		if (!deposit)
			return res.json({
				message: "Deposit not found",
				status: false,
				data: null,
			});

		await Transaction.findByIdAndUpdate(
			transaction._id,
			{ status: "completed" },
			{ new: true }
		);
		return res.status(200).json({
			message: "Deposit approved successfully",
			data: deposit,
			status: true,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error approving deposit", data: error, status: false });
	}
};

// Decline Funding (Admin)
export const declineFunding = async (req, res) => {
	try {
		const { depositId } = req.params;

		const transactionDeposit = await Deposit.findById(depositId);
		const deposit = await Deposit.findByIdAndUpdate(
			depositId,
			{ status: "declined" },
			{ new: true }
		);

		const transaction = await Transaction.findOne({
			reference: transactionDeposit.reference,
		});
		if (!deposit) return res.status(404).json({ message: "Deposit not found" });

		await Transaction.findByIdAndUpdate(
			transaction._id,
			{ status: "failed" },
			{ new: true }
		);
		return res
			.status(200)
			.json({ message: "Deposit declined successfully", deposit });
	} catch (error) {
		return res.status(500).json({ message: "Error declining deposit", error });
	}
};
