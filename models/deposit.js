import mongoose from 'mongoose'

const depositSchema = mongoose.Schema(
  {
    amount: { type: Number, required: true },
    accountName: { type: String },
    accountNumber: { type: String },
    narration: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    method: { type: String, enum: ["bank", "crypto"], required: true },
    reference: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Deposit = mongoose.model('Deposit', depositSchema)

export default Deposit