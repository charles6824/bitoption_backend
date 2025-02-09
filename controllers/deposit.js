import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Deposit from "../models/deposit.js";

// Fund Wallet (Admin)
export const fundWallet = asyncHandler(async (req, res) => {
  try {
    const formData = req.body.payload; // Extracting payload
    const { amount, accountName, accountNumber, narration, userId, method } = formData;
    const reference = uuidv4();

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
    return res.status(201).json({ message: "Wallet funded successfully", deposit: newDeposit });
  } catch (error) {
    return res.status(500).json({ message: "Error funding wallet", error });
  }
});

// Fund with Bank (User)
export const fundWithBank = async (req, res) => {
  try {
    const formData = req.body.payload;
    const { amount, accountName, accountNumber, narration, userId } = formData;
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
    return res.status(201).json({ message: "Deposit request created", deposit: newDeposit });
  } catch (error) {
    return res.status(500).json({ message: "Error processing deposit", error });
  }
};

// Fund with Crypto (User)
export const fundWithCrypto = async (req, res) => {
  try {
    const formData = req.body.payload;
    const { amount, userId } = formData;
    const reference = uuidv4();

    const newDeposit = new Deposit({
      amount,
      user: userId,
      method: "crypto",
      reference,
      status: "pending",
    });

    await newDeposit.save();
    return res.status(201).json({ message: "Crypto deposit request created", deposit: newDeposit });
  } catch (error) {
    return res.status(500).json({ message: "Error processing crypto deposit", error });
  }
};

// Approve Funding (Admin)
export const approveFunding = async (req, res) => {
  try {
    const { depositId } = req.params;

    const deposit = await Deposit.findByIdAndUpdate(depositId, { status: "approved" }, { new: true });

    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    return res.status(200).json({ message: "Deposit approved successfully", deposit });
  } catch (error) {
    return res.status(500).json({ message: "Error approving deposit", error });
  }
};

// Decline Funding (Admin)
export const declineFunding = async (req, res) => {
  try {
    const { depositId } = req.params;

    const deposit = await Deposit.findByIdAndUpdate(depositId, { status: "declined" }, { new: true });

    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    return res.status(200).json({ message: "Deposit declined successfully", deposit });
  } catch (error) {
    return res.status(500).json({ message: "Error declining deposit", error });
  }
};
