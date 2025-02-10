import asyncHandler from "express-async-handler";
import Withdrawal from "../models/withdrawals.js";
import Account from "../models/account.js";
import User from "../models/user.js";
import randomstring from "randomstring";
import { withdrawalOTP } from "../utils/message.js";
import sendMail from "../services/sendMail.js";
import { createTransaction } from "../utils/transactions.js";
import { v4 as uuidv4 } from "uuid";

export const initiateWithdrawal = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const userId = req.user.id;

		const userAccount = await User.findOne({ _id: userId });
		const account = await Account.findOne({ user: userId });
		console.log(userAccount);

		if (!formData.amount || formData.amount > userAccount.balance) {
			return res.json({
				message: "Invalid withdrawal amount",
				status: false,
				data: null,
			});
		}

		if (userAccount.otp != formData.otp) {
			return res.json({ message: "Invalid OTP", status: false, data: null });
		}

    const reference = uuidv4()

		const withdrawal = new Withdrawal({
			user: userId,
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
				},
				{ new: true, useFindAndModify: false }
			);
			createTransaction(
				userId,
				formData.amount,
				`Withdrawal/247BO/${
					formData.description ? formData.description : account.accountNumber
				}`,
				reference,
				"pending"
			);
			res.status(201).json({
				message: "Withdrawal request created",
				data: withdrawal,
				status: true,
			});
		}else{
      createTransaction(
				userId,
				formData.amount,
				`Withdrawal/247BO/${
					formData.description ? formData.description : account.accountNumber
				}`,
				reference,
				"failed"
			);
    }
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error initiating withdrawal",
			data: error,
			status: false,
		});
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

export const sendOTP = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
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
		console.log("email: ", user.email);
		await sendMail(
			user.email,
			"OTP Verification For Withdrawal",
			withdrawalOTP(user.fullName, otp)
		);
		res.json({ status: true, message: "OTP sent via email", data: null });
	} catch (error) {
		res.status(500).json({ message: "Error declining withdrawal", error });
	}
};
