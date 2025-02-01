import mongoose from 'mongoose'

const withdrawalSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema)

export default Withdrawal