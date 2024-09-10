import { Document } from 'mongoose'

export interface User extends Document {
  _id: string
  user: string
  name: string
  readonly password: string
  type: string
  salt: string
  phone: string
  orders: []
}
