import mongoose from 'mongoose'
import { IProductSqueme } from '../interfaces'

const Schema = mongoose.Schema

export interface IOrderScheme extends mongoose.Document {
  _id: string
  userId: string
  amount: number
  items: IProductSqueme[]
}

export const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    items: [
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
      },
    },
  },
)
