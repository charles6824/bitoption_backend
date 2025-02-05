import mongoose from 'mongoose'

const packageSchema = mongoose.Schema(
  {
    name: {type: String, required: true},
    price: {type: Number, required: true},
    interest: {type: Number, required: true},
    period: {type: Number, required: true},
},
{
    timestamps: true
}
);

const Package = mongoose.model('Package', packageSchema)

export default Package