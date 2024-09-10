import { Controller, Get, Inject, Param, Put, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { messagesCustomer } from './types'
import { AuthGuard } from './guards/auth.guard'
import { GetUser } from './decorators/get-user'
import { UpdatePassword } from './dto'
import { firstValueFrom } from 'rxjs'
import { User } from './interfaces'
import { Authorization } from './decorators'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
  ) {}

  @Get()
  @Authorization(true)
  async getAll() {
    return await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.GET_ALL, {}),
    )
  }

  @Get(':id')
  @Authorization(true)
  async getCustomer(@Param('id') id: string) {
    return await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.GET_CUSTOMER, { id }),
    )
  }

  @Put('updatePassword')
  @Authorization(true)
  async updatePassword(@GetUser() user: User, updatePassword: UpdatePassword) {
    return this.customerServiceClient.send(messagesCustomer.UPDATE_CUSTOMER, {
      id: user._id,
      password: updatePassword.password,
    })
  }
}
