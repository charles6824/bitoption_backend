import Transaction from "../models/transaction.js";
import asyncHandler from "express-async-handler";


export const getAllTransactions = asyncHandler(async(req, res) => {
  try {
		const transactions = await Transaction.find({});
		if (transactions) {
			res.json({ data: transactions, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve transactions",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching transactions", error });
	}
})
export const getUserTransactions = asyncHandler(async(req, res) => {
  try {
		const transactions = await Transaction.find({user: req.user.id});
		if (transactions) {
			res.json({ data: transactions, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve transactions",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching transactions", error });
	}
})