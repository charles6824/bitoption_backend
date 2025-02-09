import asyncHandler from "express-async-handler";
import Withdrawal from "../models/withdrawals.js";
import Account from "../models/account.js";

export const initiateWithdrawal = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const userId = req.user.id;

		const userAccount = await Account.findOne({ user: userId }).session(
			session
		);

		if (!formData.amount || formData.amount <= userAccount.balance) {
			return res.status(400).json({ message: "Invalid withdrawal amount" });
		}

		const withdrawal = new Withdrawal({
			user: userId,
			amount: formData.amount,
			mode: formData.mode,
			description: formData.description,
			cryptoWallet:
				formData.mode === "crypto" ? formData.cryptoWallet : undefined,
			bankDetails: formData.mode === "bank" ? formData.bankDetails : undefined,
		});

		await withdrawal.save();
		res.status(201).json({ message: "Withdrawal request created", withdrawal });
	} catch (error) {
		res.status(500).json({ message: "Error initiating withdrawal", error });
	}
});

export const getAllWithdrawals = async (req, res) => {
	try {
		const withdrawals = await Withdrawal.find({});
		if (withdrawals) {
			res.json({ data: withdrawals, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve withdrawals",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching withdrawals", error });
	}
};

export const getUserWithdrawals = async (req, res) => {
	try {
		const withdrawals = await Withdrawal.find({ user: req.user.id });
		if (withdrawals) {
			res.json({
				data: withdrawals,
				message: "User withdrawal Retrieved",
				status: true,
			});
		} else {
			res.json({
				data: null,
				message: "unable to retrieve withdrawals",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching withdrawals", error });
	}
};

export const getSingleWithdrawal = async (req, res) => {
	try {
		const withdrawals = await Withdrawal.findById(req.params.id);
		if (withdrawals) {
			res.json({
				data: withdrawals,
				message: "Single withdrawal Retrieved",
				status: true,
			});
		} else {
			res.json({
				data: null,
				message: "unable to retrieve withdrawal",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching withdrawals", error });
	}
};

export const approveWithdrawal = async (req, res) => {
	try {
		const withdrawal = await Withdrawal.findById(req.params.id);
		if (!withdrawal || withdrawal.status !== "pending") {
			return res.status(400).json({ message: "Invalid withdrawal request" });
		}
		withdrawal.status = "approved";
		await withdrawal.save();
		res.status(200).json({ message: "Withdrawal approved", withdrawal });
	} catch (error) {
		res.status(500).json({ message: "Error approving withdrawal", error });
	}
};

export const declineWithdrawal = async (req, res) => {
	try {
		const withdrawal = await Withdrawal.findById(req.params.id);
		if (!withdrawal || withdrawal.status !== "pending") {
			return res.status(400).json({ message: "Invalid withdrawal request" });
		}
		withdrawal.status = "declined";
		await withdrawal.save();
		res.status(200).json({ message: "Withdrawal declined", withdrawal });
	} catch (error) {
		res.status(500).json({ message: "Error declining withdrawal", error });
	}
};
