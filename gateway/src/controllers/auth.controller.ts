import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CredentialsDto } from '../dto'
import { firstValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import { MessagesAuth } from '../types'
import { IResponse, token, User } from '../interfaces'
import { AuthGuard } from 'src/guards/auth.guard'
import { Authorization, GetUser } from 'src/decorators'

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
  ) {}

  @Post('login')
  @Authorization(false)
  async logIn(@Body() loginDto: CredentialsDto): Promise<IResponse<token>> {
    const loginResponse: IResponse<token> = await firstValueFrom(
      this.customerServiceClient.send(MessagesAuth.LOGIN, loginDto),
    )

    if (loginResponse.status !== HttpStatus.OK)
      throw new BadRequestException(loginResponse.message)

    return loginResponse
  }

  @Post('verify')
  @Authorization(true)
  async verifyToken(@GetUser() user: User) {
    return user
  }
}
