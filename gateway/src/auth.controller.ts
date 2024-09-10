import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { firstValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import { MessagesAuth } from './types'
import { IResponse, token } from './interfaces'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
  ) {}

  @Post('login')
  async logIn(@Body() loginDto: LoginDto) {
    const loginResponse: IResponse<token> = await firstValueFrom(
      this.customerServiceClient.send(MessagesAuth.LOGIN, loginDto),
    )

    if (loginResponse.status !== HttpStatus.OK)
      throw new BadRequestException(loginResponse.message)

    return loginResponse
  }
}
