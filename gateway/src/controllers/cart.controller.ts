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
import { Authorization, GetUser } from 'src/decorators'
import { ProductPayloadDto } from 'src/dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { IResponse } from 'src/interfaces'
import { ICart } from 'src/interfaces/cart'
import { CART_MESSAGES } from 'src/types'

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(
    @Inject('SHOPPING_SERVICE') private shoppingClient: ClientProxy,
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
  async addItem(@GetUser('id') id: string) {
    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.shoppingClient.send(CART_MESSAGES.ADD_CART, { id }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }

  @Delete()
  @Authorization(true)
  async removeItem(
    @GetUser('id') id: string,
    @Body() productPayload: ProductPayloadDto,
  ) {
    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.shoppingClient.send(CART_MESSAGES.REMOVE_CART, {
        id,
        productPayload,
      }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }
}
