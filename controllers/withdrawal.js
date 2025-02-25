import asyncHandler from "express-async-handler";
import Withdrawal from "../models/withdrawals.js";
import Account from "../models/account.js";
import User from "../models/user.js";
import randomstring from "randomstring";
import { withdrawalOTP } from "../utils/message.js";
import sendMail from "../services/sendMail.js";
import { createTransaction } from "../utils/transactions.js";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/transaction.js";

export const initiateWithdrawal = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const userId = req.user.id;

		const userAccount = await User.findOne({ _id: req.user.id });
		const account = await Account.findOne({ user: req.user.id });
		// console.log(userAccount);

		if (!formData.amount) {
			return res.json({
				message: "Invalid withdrawal amount",
				status: false,
				data: null,
			});
		}

		if (formData.amount > userAccount.availableBalance) {
			return res.json({
				message: "Insufficient available balance",
				status: false,
				data: null,
			});
		}

		if (userAccount.otp != formData.otp) {
			return res.json({ message: "Invalid OTP", status: false, data: null });
		}

		const reference = uuidv4();

		const withdrawal = new Withdrawal({
			user: req.user.id,
			amount: formData.amount,
			mode: formData.mode,
			reference: reference,
			description: formData.description,
			cryptoWallet:
				formData.mode === "crypto" ? formData.cryptoWallet : undefined,
			bankDetails: formData.mode === "bank" ? formData.bankDetails : undefined,
		});

		const saveWithdrawal = await withdrawal.save();
		if (saveWithdrawal) {
			await Account.findByIdAndUpdate(
				account._id,
				{
					balance: Number(account.balance) - Number(formData.amount),
					availableBalance: Number(account.availableBalance) - Number(formData.amount),
				},
				{ new: true, useFindAndModify: false }
			);
			await createTransaction({
				user: userId,
				amount: formData.amount,
				description: `Withdrawal/247BO/${
					formData.description ? formData.description : account.accountNumber
				}`,
				reference: reference,
				status: "pending",
        type: "outflow"
			});
			res.status(201).json({
				message: "Withdrawal request created",
				data: withdrawal,
				status: true,
			});
		} else {
			await createTransaction({
				user: userId,
				amount: formData.amount,
				description: `Withdrawal/247BO/${
					formData.description ? formData.description : account.accountNumber
				}`,
				reference: reference,
				status: "failed",
        type: "outflow"
			});
		}
	} catch (error) {
		// console.log(error);
		res.status(500).json({
			message: "Error initiating withdrawal",
			data: error,
			status: false,
		});
	}
});

export const getAllWithdrawals = async (req, res) => {
	try {
		const withdrawals = await Withdrawal.find({}).sort({ createdAt: -1 });;
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
		const withdrawals = await Withdrawal.find({ user: req.user.id }).sort({ createdAt: -1 });;
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
    console.log("withdrawal: ", withdrawal)

		if (!withdrawal || withdrawal.status !== "pending") {
			return res.json({ message: "Invalid withdrawal request", status: false, data: null });
		}

    if(withdrawal){}
    const transaction = await Transaction.findOne({
			reference: withdrawal.reference,
		});

    console.log("transaction: ", transaction)

		withdrawal.status = "approved";
		await withdrawal.save();
		await Transaction.findByIdAndUpdate(
			transaction._id,
			{ status: "completed" },
			{ new: true }
		);
		res.status(200).json({ message: "Withdrawal approved", data: null, status: true });
	} catch (error) {
		res.status(500).json({ message: "Error approving withdrawal", error });
	}
};

export const declineWithdrawal = async (req, res) => {
	try {
		const withdrawal = await Withdrawal.findById(req.params.id);
    const account = await Account.findOne({user: withdrawal.user})
		
		if (!withdrawal || withdrawal.status !== "pending") {
			return res.json({ message: "Invalid withdrawal request", status: false, data: null });
		}
    const transaction = await Transaction.findOne({
			reference: withdrawal.reference,
		});
		withdrawal.status = "declined";
		await withdrawal.save();
		await Transaction.findByIdAndUpdate(
			transaction._id,
			{ status: "failed" },
			{ new: true }
		);
		await Account.findByIdAndUpdate(
			account._id,
			{ balance: Number(account.balance) + Number(withdrawal.amount), availableBalance: Number(account.availableBalance) + Number(withdrawal.amount)},
			{ new: true }
		);

		res.status(200).json({ message: "Withdrawal declined", data: null, status: true });
	} catch (error) {
		res.status(500).json({ message: "Error declining withdrawal", error });
	}
};

export const sendOTP = async (req, res) => {
	try {
    console.log("user: ", req.user.id)
		const user = await User.findById(req.user.id);
    console.log("user: ", user)
		if (!user) {
			return res.json({ status: false, message: "User not found", data: null });
		}
		const otp = randomstring.generate({
			length: 6,
			charset: "numeric",
		});
		const updateOtp = await User.findByIdAndUpdate(
			user._id,
			{
				otp: otp,
			},
			{ new: true, useFindAndModify: false }
		);

		if (!updateOtp) {
			return res.json({
				status: false,
				message: "Unable to update OTP",
				data: null,
			});
		}
		// console.log("email: ", user.email);
		await sendMail(
			user.email,
			"OTP Verification For Withdrawal",
			withdrawalOTP(user.fullName, otp)
		);
		res.json({ status: true, message: "OTP sent via email", data: null });
	} catch (error) {
    console.log("object12222")
		res.status(500).json({ message: "Error declining withdrawal", error });
	}
};
