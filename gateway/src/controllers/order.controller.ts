import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { Authorization, GetUser } from 'src/decorators'
import { ManageCartDto } from 'src/dto/manageCart.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { ICart, IResponse } from 'src/interfaces'
import { PRODUCT_MESSAGES } from 'src/types/product-service'

@Controller('order')
@UseGuards(AuthGuard)
export class OrderContoller {
  constructor(@Inject('PRODUCT_SERVICE') private productClient: ClientProxy) {}

  @Put('add-cart')
  @Authorization(true)
  async addToCart(
    @GetUser('_id') idClient: string,
    @Body() manageCartDto: ManageCartDto,
  ) {
    const { id, units } = manageCartDto

    console.log(idClient)

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

  @Put('remove-cart')
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

  @Post(':id')
  @Authorization(true)
  async createOrder(@GetUser('_id') id: string) {
    const cartResponse: IResponse<ICart> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.CREATE_ORDER, { id }),
    )

    if (cartResponse.status !== HttpStatus.OK)
      throw new BadRequestException(cartResponse.message)

    return cartResponse
  }
}
