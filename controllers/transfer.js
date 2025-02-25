import asyncHandler from "express-async-handler";
import Transfer from "../models/transfer.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import Account from "../models/account.js";
import { createTransaction } from "../utils/transactions.js";

export const createTransfer = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const { amount, accountNumber, description } = formData;

		const reference = uuidv4();

		const userAcc = await User.findOne({ accountNumber: accountNumber });
		const myAccount = await Account.findOne({ user: req.user.id });
		const userAccount = await Account.findOne({ accountNumber: accountNumber });

    if(myAccount.availableBalance < amount){
      return res.json({ message: "Insufficient available balance", data: null, status: false });
    }

		const newTransfer = await new Transfer({
			amount,
			accountNumber,
			description,
			user: req.user.id,
			status: "completed",
			reference: reference,
		});

		const saveTransfer = await newTransfer.save();
		const newBalance = Number(userAccount.balance) + Number(amount);
		const myBalance = Number(myAccount.balance) - Number(amount);
		const newAvailBalance = Number(userAccount.availableBalance) + Number(amount);
		const myAvailBalance = Number(myAccount.availableBalance) - Number(amount);
		if (saveTransfer) {
			await createTransaction({
				user: req.user.id,
				amount: amount,
				description: `Transfer/247BO/${
					formData.description ? formData.description : accountNumber
				}`,
				reference: reference,
				status: "completed",
				type: "outflow",
			});

			await createTransaction({
				user: userAcc._id,
				amount: amount,
				description: `Transfer/247BO/${
					formData.description ? formData.description : accountNumber
				}`,
				reference: uuidv4(),
				status: "completed",
				type: "inflow",
			});

			await Account.findByIdAndUpdate(
				myAccount._id,
				{ balance: myBalance, availableBalance: myAvailBalance },
				{ new: true, useFindAndModify: false }
			);

			await Account.findByIdAndUpdate(
				userAccount._id,
				{ balance: newBalance, availableBalance: newAvailBalance },
				{ new: true, useFindAndModify: false }
			);

			res.json({ status: true, message: "Transfer Successful", data: null });
		} else {
			res.json({
				data: null,
				status: false,
				message: "unable to process transfer",
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message, status: false, data: null }); 
	}
});
