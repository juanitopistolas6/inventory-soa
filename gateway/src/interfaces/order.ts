import { IProductSqueme } from '../interfaces'

export interface IOrder {
  _id: string
  userId: string
  amount: number
  items: IProductSqueme[]
}
