import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { Authorization, GetUser } from '../decorators'
import { ManageCartDto } from '../dto'
import { AuthGuard } from '../guards/auth.guard'
import { IResponse, ICart } from '../interfaces'
import { CART_MESSAGES, PRODUCT_MESSAGES } from '../types'

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(
    @Inject('SHOPPING_SERVICE') private shoppingClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  @Get()
  @Authorization(true)
  async getCart(@GetUser('id') id: string) {
    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.shoppingClient.send(CART_MESSAGES.GET_CART, { id }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }

  @Put()
  @Authorization(true)
  async addToCart(
    @GetUser('_id') idClient: string,
    @Body() manageCartDto: ManageCartDto,
  ) {
    const { id, units } = manageCartDto

    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.ADD_CART, {
        idClient,
        id,
        units,
      }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }

  @Delete()
  @Authorization(true)
  async removeFromCart(
    @GetUser('_id') idClient: string,
    @Body() manageCartDto: ManageCartDto,
  ) {
    const { id, units } = manageCartDto

    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.REMOVE_FROM_CART, {
        id,
        units,
        idClient,
      }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }
}
