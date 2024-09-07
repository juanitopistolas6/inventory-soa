import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const userModel = new Schema(
  {
    user: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    phone: { type: String, required: true },
    type: {
      type: String,
      enum: ['Customer', 'Administrator'],
      default: 'Customer',
    },
    orders: [
      {
        type: { type: Schema.Types.ObjectId, ref: 'orders' },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.salt
        delete ret.__v
      },
    },
  },
)
