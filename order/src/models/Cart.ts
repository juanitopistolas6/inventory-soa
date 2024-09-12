import mongoose from 'mongoose'
import { IProductSqueme } from 'src/interfaces'

const Schema = mongoose.Schema

export interface ICartSqueme extends mongoose.Document {
  _id: string
  idCustomer: string
  cart: IProductSqueme[]
}

export const CartSchema = new Schema(
  {
    idCustomer: { type: String, unique: true, required: true },
    cart: [
      {
        _id: false,
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          description: { type: String },
          banner: { type: String },
          category: { type: String },
          price: { type: Number },
          suplier: { type: String },
          units: { type: Number },
        },
        units: { type: Number, required: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        delete ret.cart._id
      },
    },
  },
)
