import { Controller, Get } from '@nestjs/common'
import { OrderService } from './services/order.service'

@Controller()
export class OrderController {
  constructor(private readonly appService: OrderService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
