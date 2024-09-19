export interface IProductParam {
  name: string
  banner: string
  category: string
  price: string
  suplier: string
  units: number
}

export interface IProduct extends IProductParam {
  _id: string
}
