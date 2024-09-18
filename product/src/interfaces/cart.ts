import { IProductObject } from './product'

export interface ICart {
  _id: string
  idCustomer: string
  cart: IProductObject[]
}
