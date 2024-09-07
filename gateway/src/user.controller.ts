import { Controller, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { messagesCustomer } from './types'

@Controller('user')
export class AppController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
  ) {}

  @Get()
  async getAll() {
    return await this.customerServiceClient.send(messagesCustomer.GET_ALL, {})
  }
}
