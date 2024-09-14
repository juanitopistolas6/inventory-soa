import { HttpStatus, Injectable } from '@nestjs/common'
import { FormateDataParams, IResponse } from '../interfaces'

@Injectable()
export class SomeService {
  async FormateData<D>({
    data,
    message,
    status = HttpStatus.OK,
    error = false,
  }: FormateDataParams<D>): Promise<IResponse<D>> {
    return {
      status,
      message,
      data: error ? null : data,
    }
  }
}
