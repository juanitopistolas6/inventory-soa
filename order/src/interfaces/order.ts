import { IProductSqueme } from './product'

export interface IOrder {
  _id: string
  userId: string
  amount: number
  items: IProductSqueme[]
}
