import asyncHandler from "express-async-handler";
import Account from "../models/account.js";
import User from "../models/user.js";

export const getBalance = asyncHandler(async (req, res) => {
	try {
		// console.log(req.headers.authorization);
		const account = await Account.findOne({ user: req.user.id });
		// console.log(account);
		if (account) {
			res.status(200).json({ balance: account.availableBalance, totalBalance: account.balance, status: true, message: "balance retrieved "});
		} else {
			res.json({
				status: false,
				message: "Account not found for the authenticated user",
				balance: 0,
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export const getAccountDetailsByAccountNumber = asyncHandler(
	async (req, res) => {
		try {
			const account = await User.findOne({
				accountNumber: req.params.accountNumber,
			});
			if (account) {
				res.json({
					data: account.fullName,
					message: "Account Retrieved",
					status: true,
				});
			} else {
				res.json({
					data: null,
					message: "Account not found for the authenticated user",
					status: false,
				});
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
);

export const getAccountDetails = asyncHandler(async (req, res) => {
	try {
		const account = await Account.findOne({ user: req.user._id });
		if (account) {
			res.status(200).json(account);
		} else {
			res.status(404);
			throw new Error("Account not found for the authenticated user");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//this can be crypto or normal foreign bank(US) account
export const addMoreAccount = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});

export const deleteAnAccount = asyncHandler(async (req, res) => {
	try {
	} catch (error) {}
});
