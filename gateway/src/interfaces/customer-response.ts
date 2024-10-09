import { type HttpStatus } from '@nestjs/common'
import { User } from './user'

export interface IResponse<T> {
  status: HttpStatus
  message: string
  data: T | null
}

export interface token {
  token: string
  user: User
}
