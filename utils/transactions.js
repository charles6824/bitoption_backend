import Transaction from "../models/transaction.js";

export const createTransaction = async ({ user, amount, description, reference, status }) => {
  try {
    const transaction = new Transaction({
      user,
      amount,
      description,
      reference,
      status,
      date: new Date(),
    });

    await transaction.save();
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error); 
    throw new Error("Transaction creation failed");
  }
};
