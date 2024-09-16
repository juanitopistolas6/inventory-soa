import { Controller } from '@nestjs/common'
import { ProductService } from './services/product.service'
import { MessagePattern } from '@nestjs/microservices'
import { PRODUCT_MESSAGES } from './types/product-messages'

@Controller()
export class ProductController {
  constructor(private readonly appService: ProductService) {}

  @MessagePattern(PRODUCT_MESSAGES.CREATE_PRODUCT)
  async createProduct() {}

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCT)
  async getProduct() {}

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCTS)
  async getProducts() {}

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCT_ARRAY)
  async getProductsArray() {}

  @MessagePattern(PRODUCT_MESSAGES.PRODUCT_CATEGORY)
  async getProducsCategory() {}
}
