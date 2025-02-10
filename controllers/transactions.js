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


const getDataForPeriod = (transactions, period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "1D":
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case "1W":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "1M":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "3M":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "6M":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "1Y":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return { labels: [], inflowData: [], outflowData: [] };
  }

  const filteredTransactions = transactions.filter(
    (txn) => new Date(txn.date) >= startDate
  );

  const inflowData = filteredTransactions
    .filter((txn) => txn.type == "inflow")
    .map((txn) => txn.amount);
  const outflowData = filteredTransactions
    .filter((txn) => txn.type == "outflow")
    .map((txn) => Math.abs(txn.amount));

  return {
    labels: filteredTransactions.map((txn) => txn.date.toISOString().split("T")[0]),
    inflowData,
    outflowData,
  };
};

// Get cashflow analysis for a user
export const getCashflowAnalysis = asyncHandler(async (req, res) => {
  try {
    const { period } = req.query; // Example: "1D", "1W", "1M", etc.
    const transactions = await Transaction.find({ user: req.user.id });

    if (!transactions || transactions.length === 0) {
      return res.json({ message: "No transactions found", status: false });
    }

    const cashflowData = getDataForPeriod(transactions, period || "1M");
    res.json({ data: cashflowData, message: "Cashflow retrieved", status: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cashflow data", error });
  }
});