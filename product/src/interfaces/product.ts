export interface IProductObject {
  product: {
    _id: string
    name: string
    description: string
    banner: string
    category: string
    price: number
    supplier: string
    units: number
  }
  units: number
}
