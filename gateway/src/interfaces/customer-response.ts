import { type HttpStatus } from '@nestjs/common'

export interface IResponse<T> {
  status: HttpStatus
  message: string
  data: T | null
}

export interface token {
  token: string
  id: string
}
