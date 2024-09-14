import { IProductSqueme } from './product'

export interface ICart {
  _id: string
  idCustomer: string
  cart: IProductSqueme[]
}
