import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { Authorization, GetUser } from '../decorators'
import { AuthGuard } from '../guards/auth.guard'
import { IResponse, IOrder } from '../interfaces'
import { PRODUCT_MESSAGES, ORDER_MESSAGES } from '../types'

@Controller('order')
@UseGuards(AuthGuard)
export class OrderContoller {
  constructor(
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('SHOPPING_SERVICE') private shoppingClient: ClientProxy,
  ) {}

  @Get()
  @Authorization(true)
  async getOrders(@GetUser('_id') id: string) {
    const orderResponse: IResponse<IOrder[]> = await firstValueFrom(
      this.shoppingClient.send(ORDER_MESSAGES.GET_ORDERS, { id }),
    )

    if (orderResponse.status !== HttpStatus.OK)
      throw new BadRequestException(orderResponse.message)

    return orderResponse
  }

  @Get(':id')
  @Authorization(true)
  async getOrder(@Param('id') idOrder: string) {
    const orderResponse: IResponse<IOrder> = await firstValueFrom(
      this.shoppingClient.send(ORDER_MESSAGES.GET_ORDER, { idOrder }),
    )

    if (orderResponse.status !== HttpStatus.OK)
      throw new BadRequestException(orderResponse.message)

    return orderResponse
  }

  @Post()
  @Authorization(true)
  async createOrder(@GetUser('_id') id: string) {
    const cartResponse: IResponse<IOrder> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.CREATE_ORDER, { id }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }
}
