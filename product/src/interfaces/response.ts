import { type HttpStatus } from '@nestjs/common'

export interface IResponse<T> {
  data: T | null
  status: HttpStatus
  message: string
}
