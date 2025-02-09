import mongoose from "mongoose";
import Package from "../models/packages.js";
import { v4 as uuidv4 } from "uuid";
import Account from "../models/account.js";
import Investment from "../models/investment.js"
import asyncHandler from "express-async-handler";


// Create Investment
export const createInvestment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {packageId } = req.body.payload;

    // Validate package
    const investmentPackage = await Package.findById(packageId);
    if (!investmentPackage) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Package not found" });
    }

    // Fetch user's account
    const userAccount = await Account.findOne({ user: req.user.id }).session(session);
    if (!userAccount) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User account not found" });
    }

    // Check if balance is sufficient
    if (userAccount.balance < investmentPackage.price) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    userAccount.balance -= investmentPackage.price;
    await userAccount.save({ session });

    // Calculate expected return and daily increment
    const amountToReceive = investmentPackage.price + (investmentPackage.price * (investmentPackage.interest / 100));
    const periodInDays = investmentPackage.period; // Assuming package has a duration field
    const dailyIncrease = (amountToReceive - investmentPackage.price) / periodInDays;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + periodInDays);

    // Create investment
    const newInvestment = new Investment({
      user: req.user.id,
      package: packageId,
      paid: true,
      transactionID: uuidv4(),
      paymentDate: new Date(),
      amount: investmentPackage.price,
      amountToReceive,
      updatedPrice: 0, // Starts at 0
      dailyIncrease,
      completionDate,
      completed: false,
      collectedPayment: false,
    });

    await newInvestment.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Investment created successfully",
      investment: newInvestment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Error creating investment", error });
  }
};
export const getAllInvestments = asyncHandler(async(req, res) => {
  try {
		const investments = await Investment.find({});
		if (investments) {
			res.json({ data: investments, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve investments",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching investments", error });
	}
})
export const getUserInvestments = asyncHandler(async(req, res) => {
  try {
		const investments = await Investment.find({user: req.user.id});
		if (investments) {
			res.json({ data: investments, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve investments",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching investments", error });
	}
})
export const getSingleInvestments = asyncHandler(async(req, res) => {
  try {
		const investment = await Withdrawal.findById(req.params.id);
		if (investment) {
			res.json({ data: investment, message: "Retrieved", status: true });
		} else {
			res.json({
				data: null,
				message: "unable to retrieve investment",
				status: false,
			});
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching investments", error });
	}
})


