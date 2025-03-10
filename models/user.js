import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    fullName: {type: String, required: true}, 
    email: {type: String, required: true},
    password: {type: String, required: true},
    otp: {type: String},
    accountNumber: {type: String},
    status: {type: String, default: "Active", required: true},
    lastLogin: { type: [Date], default: [new Date()] }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema)

export default User