import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    reference: {
			type: String,
			required: true,
			unique: true,
		},
    mode: { type: String, enum: ["crypto", "bank"], required: true },
    description: { type: String },
    cryptoWallet: { type: String },
    bankDetails: {
      accountNumber: { type: String },
      accountName: { type: String },
      bankName: { type: String },
      routing: { type: String },
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;