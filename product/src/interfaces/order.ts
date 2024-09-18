import { IProductObject } from './product'

export interface IOrder {
  _id: string
  userId: string
  amount: number
  items: IProductObject[]
}
