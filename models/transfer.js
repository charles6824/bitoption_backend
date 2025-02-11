import mongoose from "mongoose";

const transferSchema = mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		amount: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		reference: {
			type: String,
			required: true,
			unique: true,
		},
		accountNumber: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
