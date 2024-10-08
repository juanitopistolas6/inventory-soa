export interface IProductParam {
  name: string
  banner: string
  category: string
  price: number
  suplier: string
  units: number
}

export interface IProduct extends IProductParam {
  _id: string
}
