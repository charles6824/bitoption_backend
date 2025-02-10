import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		reference: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
