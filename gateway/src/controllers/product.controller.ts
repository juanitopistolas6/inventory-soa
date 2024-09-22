import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AuthGuard } from '../guards/auth.guard'
import { Authorization } from '../decorators'
import { IProduct, IResponse } from '../interfaces'
import { firstValueFrom } from 'rxjs'
import { PRODUCT_MESSAGES } from '../types'
import { ProductIdsDto, ProductDto, CategoryDto } from '../dto'

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCT_SERVICE') private productClient: ClientProxy) {}

  @Get('category')
  @Authorization(true)
  async byCategory(@Query() categoryDto: CategoryDto) {
    const { type: category } = categoryDto

    const productResponse: IResponse<IProduct[]> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.PRODUCT_CATEGORY, { category }),
    )

    if (productResponse.status !== HttpStatus.OK)
      throw new BadRequestException(productResponse.status)

    return productResponse
  }

  @Get()
  @Authorization(true)
  async getProducts() {
    const productResponse: IResponse<IProduct[]> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.GET_PRODUCTS, {}),
    )

    if (productResponse.status !== HttpStatus.OK)
      throw new BadRequestException(productResponse.message)

    return productResponse
  }

  @Get(':id')
  @Authorization(true)
  async getProduct(@Param('id') id: string) {
    const productResponse: IResponse<IProduct> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.GET_PRODUCT, { id }),
    )

    if (productResponse.status !== HttpStatus.OK)
      throw new BadRequestException(productResponse.status)

    return productResponse
  }

  @Post('selected')
  @Authorization(true)
  async selectedProducts(@Body() idArray: ProductIdsDto) {
    const { ids } = idArray

    const productResponse: IResponse<IProduct[]> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.GET_PRODUCT_ARRAY, { ids }),
    )

    if (productResponse.status !== HttpStatus.OK)
      throw new BadRequestException(productResponse.message)

    return productResponse
  }

  @Post()
  @Authorization(true)
  async createProduct(@Body() product: ProductDto) {
    const productResponse: IResponse<IProduct> = await firstValueFrom(
      this.productClient.send(PRODUCT_MESSAGES.CREATE_PRODUCT, { product }),
    )

    if (productResponse.status !== HttpStatus.CREATED)
      throw new BadRequestException(productResponse.message)

    return productResponse
  }
}
