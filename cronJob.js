import cron from "node-cron";
import Investment from "./models/investment.js";

// Daily Update Job
cron.schedule("* * * * *", async () => {
  console.log("Running daily investment update...");
  try {
    const investments = await Investment.find({ completed: false });

    for (let investment of investments) {
      console.log("investment: ", investment)
      // Ensure updatedPrice and dailyIncrease are valid numbers
      const currentPrice = Number(investment.updatedPrice) || 0;
      const dailyIncrease = Number(investment.dailyIncrease) || 0;
      const amountToReceive = Number(investment.amountToReceive) || 0;

      // Perform the update
      investment.updatedPrice = currentPrice + dailyIncrease;

      // Mark as completed if fully paid
      if (investment.updatedPrice >= amountToReceive) {
        investment.completed = true;
        investment.updatedPrice = amountToReceive; // Ensure it doesn't exceed the expected amount
      }

      await investment.save();
    }

    console.log("Investment balances updated successfully.");
  } catch (error) {
    console.error("Error updating investments:", error);
  }
});
