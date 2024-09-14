import { type HttpStatus } from '@nestjs/common'

export interface IResponse<T> {
  status: HttpStatus
  message: string
  data: T | null
}

export interface FormateDataParams<D> {
  status?: HttpStatus
  error?: boolean
  data?: D | null
  message: string
}
