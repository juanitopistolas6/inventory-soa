import { Controller, HttpStatus, Inject } from '@nestjs/common'
import { ProductService } from './services/product.service'
import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { CART_MESSAGES, PRODUCT_MESSAGES } from './types'
import { IOrder, IProduct, IProductParam, IResponse } from './interfaces'
import { SomeService } from './services'
import { ICart } from './interfaces/cart'
import { firstValueFrom } from 'rxjs'
import { ORDER_MESSAGES } from './types/order-messages'

@Controller()
export class ProductController {
  constructor(
    private productService: ProductService,
    private someService: SomeService,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  @MessagePattern(PRODUCT_MESSAGES.CREATE_PRODUCT)
  async createProduct(productParams: {
    product: IProductParam
  }): Promise<IResponse<IProduct>> {
    const { product } = productParams

    const newProduct = await this.productService.createProduct(product)

    return await this.someService.FormateData<IProduct>({
      data: newProduct,
      message: 'PRODUCT_CREATED',
      status: HttpStatus.CREATED,
    })
  }

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCT)
  async getProduct(productParam: { id: string }): Promise<IResponse<IProduct>> {
    const { id } = productParam

    try {
      const product = await this.productService.Product(id)

      return await this.someService.FormateData<IProduct>({
        data: product,
        message: 'PRODUCT_FOUND',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCTS)
  async getProducts(): Promise<IResponse<IProduct[]>> {
    const products = await this.productService.Products()

    return await this.someService.FormateData<IProduct[]>({
      data: products,
      message: 'PRODUCTS_RETURNED',
    })
  }

  @MessagePattern(PRODUCT_MESSAGES.GET_PRODUCT_ARRAY)
  async getProductsArray(productParam: {
    ids: string[]
  }): Promise<IResponse<IProduct[]>> {
    const { ids } = productParam

    try {
      const products = await this.productService.selectedProducts(ids)

      return await this.someService.FormateData({
        data: products,
        message: 'PRODUCTS_FOUND',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(PRODUCT_MESSAGES.PRODUCT_CATEGORY)
  async getProducsCategory(productParam: {
    category: string
  }): Promise<IResponse<IProduct[]>> {
    const { category } = productParam

    try {
      const products = await this.productService.productsByCategory(category)

      return await this.someService.FormateData<IProduct[]>({
        data: products,
        message: 'PRODUCTS_FOUND',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(PRODUCT_MESSAGES.ADD_CART)
  async addCart(productParams: {
    idClient: string
    id: string
    units: number
  }): Promise<IResponse<ICart>> {
    const { id, units, idClient } = productParams

    try {
      const product = await this.productService.checkAvailability(id, units)

      return await firstValueFrom(
        this.orderClient.send(CART_MESSAGES.ADD_CART, {
          id: idClient,
          product,
        }),
      )
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(PRODUCT_MESSAGES.REMOVE_FROM_CART)
  async removeFromCart(productParams: {
    idClient: string
    id: string
    units: number
  }): Promise<IResponse<ICart>> {
    const { id, idClient, units } = productParams

    try {
      const product = await this.productService.checkAvailability(id, units)

      return await firstValueFrom(
        this.orderClient.send(CART_MESSAGES.REMOVE_CART, {
          id: idClient,
          product,
        }),
      )
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(PRODUCT_MESSAGES.CREATE_ORDER)
  async createOrder(orderParams: { id: string }): Promise<IResponse<IOrder>> {
    const { id } = orderParams

    try {
      const cart: IResponse<ICart> = await firstValueFrom(
        this.orderClient.send(CART_MESSAGES.GET_CART, { id }),
      )

      if (cart.status !== HttpStatus.OK)
        return await this.someService.FormateData({
          error: true,
          message: cart.message,
        })

      const { cart: cartObject } = cart.data

      await this.productService.processOrder(cartObject)

      return await firstValueFrom(
        this.orderClient.send(ORDER_MESSAGES.CREATE_ORDER, { customerId: id }),
      )
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }
}
