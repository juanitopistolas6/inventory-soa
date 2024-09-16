import { type HttpStatus } from '@nestjs/common'

export interface FormateDataParams<D> {
  data?: D | null
  message: string
  status?: HttpStatus
  error?: boolean
}
