import mongoose from 'mongoose'

const adminSchema = mongoose.Schema(
  {
    fullName: {type: String, required: true}, 
    email: {type: String, required: true},
    password: {type: String, required: true},
    lastLogin: { type: [Date], default: [new Date()] }
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema)

export default Admin