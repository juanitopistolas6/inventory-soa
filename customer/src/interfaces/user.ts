export interface User {
  _id: string
  name: string
  user: string
  type: string
  orders?: Array<any>
}
