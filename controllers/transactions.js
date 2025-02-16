import Transaction from "../models/transaction.js";
import asyncHandler from "express-async-handler";


export const getAllTransactions = asyncHandler(async(req, res) => {
  try {
		const transactions = await Transaction.find({}).sort({ createdAt: -1 });
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
		const transactions = await Transaction.find({user: req.user.id}).sort({ createdAt: -1 });
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

  // Adjust start date based on the period selected
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

  // Filter transactions within the specified period
  const filteredTransactions = transactions.filter(
    (txn) => new Date(txn.date) >= startDate
  );

  // Group transactions by month and year
  const monthlyData = filteredTransactions.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM

    if (!acc[monthYear]) {
      acc[monthYear] = { inflow: 0, outflow: 0 };
    }

    if (txn.type === "inflow") {
      acc[monthYear].inflow += txn.amount;
    } else if (txn.type === "outflow") {
      acc[monthYear].outflow += Math.abs(txn.amount);
    }

    return acc;
  }, {});

  // Convert month-year format to 'MMM, YYYY' (e.g., "Feb, 2025")
  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split("-").map(Number);
    return `${new Date(year, month - 1).toLocaleString("en-US", { month: "short" })}, ${year}`;
  };

  // Get last 6 months of data
  const sortedLabels = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
  const last6Months = sortedLabels.slice(-6);

  // Prepare the labels and data arrays
  const labels = last6Months.map(formatMonthYear);
  const inflowData = last6Months.map((label) => monthlyData[label].inflow);
  const outflowData = last6Months.map((label) => monthlyData[label].outflow);

  return {
    labels,
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
