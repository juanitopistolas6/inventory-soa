import { HttpStatus } from '@nestjs/common'

export interface FormateDataParams<T> {
  data?: T
  message: string
  status?: HttpStatus
  error?: boolean
}
