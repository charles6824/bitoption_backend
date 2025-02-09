import cron from "node-cron";
import Investment from "./models/investment.js";

// Daily Update Job
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily investment update...");
  try {
    const investments = await Investment.find({ completed: false });

    for (let investment of investments) {
      investment.updatedPrice += investment.dailyIncrease;

      // Mark as completed if fully paid
      if (investment.updatedPrice >= investment.amountToReceive) {
        investment.completed = true;
        investment.updatedPrice = investment.amountToReceive;
      }

      await investment.save();
    }

    console.log("Investment balances updated successfully.");
  } catch (error) {
    console.error("Error updating investments:", error);
  }
});
