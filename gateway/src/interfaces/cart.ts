import { IProductSqueme } from './product-squeme'

export interface ICart {
  _id: string
  idCustomer: string
  cart: IProductSqueme[]
}
