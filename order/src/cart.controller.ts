import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CART_MESSAGES } from './types'

@Controller()
export class CartController {
  @MessagePattern(CART_MESSAGES.GET_CART)
  getCart(cartParams: { id: string }) {}
}
