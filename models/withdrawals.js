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
    mode: { type: String, enum: ["crypto", "bank"], required: true },
    description: { type: String },
    cryptoWallet: { type: String, required: function () { return this.mode === "crypto"; } },
    bankDetails: {
      accountNumber: { type: String, required: function () { return this.mode === "bank"; } },
      accountName: { type: String, required: function () { return this.mode === "bank"; } },
      bankName: { type: String, required: function () { return this.mode === "bank"; } },
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;