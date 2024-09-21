import {
  BadRequestException,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { Authorization, GetUser } from 'src/decorators'
import { AuthGuard } from 'src/guards/auth.guard'
import { IResponse, IOrder } from '../interfaces'
import { PRODUCT_MESSAGES } from 'src/types/product-service'

@Controller('order')
@UseGuards(AuthGuard)
export class OrderContoller {
  constructor(@Inject('PRODUCT_SERVICE') private productClient: ClientProxy) {}

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
