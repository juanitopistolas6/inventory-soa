import { Document } from 'mongoose'

export interface User extends Document {
  user: string
  name: string
  readonly password: string
  type: string
  salt: string
  phone: string
  orders: []
}
