import mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface IProductSqueme extends mongoose.Document {
  _id: string
  name: string
  banner: string
  category: string
  price: number
  suplier: string
  units: number
}

export const productSchema = new Schema({
  name: { type: String },
  description: { type: String },
  banner: { type: String },
  category: { type: String },
  price: { type: Number },
  suplier: { type: String },
  units: { type: Number },
})
