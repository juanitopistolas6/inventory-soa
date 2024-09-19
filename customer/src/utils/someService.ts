import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { IResponse, FormateDataParams } from '../interfaces'

@Injectable()
export class SomeService {
  constructor(private Config: ConfigService) {}

  async GenerateSalt() {
    return await bcrypt.genSalt()
  }

  async GeneratePassword(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }

  async VerifyPassword(
    inputPassword: string,
    dbPassword: string,
    salt: string,
  ) {
    return (await this.GeneratePassword(inputPassword, salt)) === dbPassword
  }

  async GenerateSignature(payload: object) {
    return await jwt.sign(payload, this.Config.get('SECRET_KEY'), {
      expiresIn: '1d',
    })
  }

  async FormateData<D>({
    data,
    message,
    status = HttpStatus.OK,
    error = false,
  }: FormateDataParams<D>): Promise<IResponse<D>> {
    return {
      status: error ? HttpStatus.BAD_REQUEST : status,
      message,
      data: error ? null : data,
    }
  }
}
