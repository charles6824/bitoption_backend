import mongoose from "mongoose";

const investmentSchema = mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		package: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Package" },
		paid: { type: Boolean, default: false, required: true },
		transactionID: { type: String },
		paymentDate: {
			type: Date,
		},
		amount: { type: Number },
		amountToReceive: { type: Number },
		completed: { type: Boolean, default: false, required: true },
		updatedPrice: { type: Number },
		dailyIncrease: { type: Number },
		collectedPayment: { type: Boolean, default: false, required: true },
		collectedDate: { type: Date },
	},
	{
		timestamps: true,
	}
);

const Investment = mongoose.model("Investment", investmentSchema); 

export default Investment;
