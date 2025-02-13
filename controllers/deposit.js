import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Deposit from "../models/deposit.js";
import { createTransaction } from "../utils/transactions.js";
import Transaction from "../models/transaction.js";
import Account from "../models/account.js";
import User from "../models/user.js";

export const getAllDeposits = asyncHandler(async (req, res) => {
	try {
		const deposits = await Deposit.find({});
		if (deposits) {
			res.json({ data: deposits, message: "Deposits retrieved", status: true });
		} else {
			res.json({
				status: false,
				data: null,
				message: "unable to retrieve deposits",
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error, data: null, status: false });
	}
});

// Fund Wallet (Admin)
export const fundWallet = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload; // Extracting payload
		const { amount, accountName, accountNumber } = formData;
		const reference = uuidv4();
		console.log("formData: ", formData);
		const account = await Account.findOne({ accountNumber: accountNumber });
		const userId = account.user;
		console.log("account; ", userId);

		const newDeposit = await new Deposit({
			amount,
			accountName,
			accountNumber,
			narration: "From Admin",
			user: userId,
			method: "admin",
			reference,
			status: "approved", // Admin funding, auto-approved
		});

		const saveDeposit = await newDeposit.save();
		if (saveDeposit) {
			await Account.findByIdAndUpdate(
				account._id,
				{ balance: Number(account.balance) + Number(amount) },
				{ new: true }
			);
			await createTransaction({
				user: userId,
				amount: amount,
				description: `Deposit/247BO/From Admin`,
				reference: reference,
				status: "completed",
				type: "inflow",
			});
			res.json({
				message: "Wallet funded successfully",
				data: null,
				status: true,
			});
		} else {
			res.json({ message: "Failed to fund wallet", data: null, status: false });
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error funding wallet", data: null, status: false });
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
		const account = await Account.findOne({ user: transactionDeposit.user });
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

		await Account.findByIdAndUpdate(
			account._id,
			{ balance: Number(account.balance) + Number(transactionDeposit.amount) },
			{ new: true }
		);

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
			.json({
				message: "Deposit declined successfully",
				data: deposit,
				status: true,
			});
	} catch (error) {
		return res.status(500).json({ message: "Error declining deposit", error });
	}
};
