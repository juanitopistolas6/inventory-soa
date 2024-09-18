import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CART_MESSAGES, manageActions } from './types'
import { ICart, IProductSqueme, IResponse } from './interfaces'
import { CartService, SomeService } from './services'

@Controller()
export class CartController {
  constructor(
    private cartService: CartService,
    private someService: SomeService,
  ) {}

  @MessagePattern(CART_MESSAGES.GET_CART)
  async getCart(cartParams: { id: string }): Promise<IResponse<ICart>> {
    const { id } = cartParams

    try {
      const cart = await this.cartService.Cart(id)

      return await this.someService.FormateData<ICart>({
        message: 'CART_RETURNED',
        data: cart,
      })
    } catch (e) {
      return await this.someService.FormateData({
        message: e.message,
        error: true,
      })
    }
  }

  @MessagePattern(CART_MESSAGES.ADD_CART)
  async addItem(addParams: {
    id: string
    product: IProductSqueme
  }): Promise<IResponse<ICart>> {
    const { id, product } = addParams

    try {
      const cartUpdated = await this.cartService.ManageCart(
        id,
        product,
        manageActions.ADD,
      )

      return await this.someService.FormateData<ICart>({
        data: cartUpdated,
        message: 'ITEM_ADDED_TO_CART',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(CART_MESSAGES.REMOVE_CART)
  async removeItem(removeParams: {
    id: string
    product: IProductSqueme
  }): Promise<IResponse<ICart>> {
    const { id, product } = removeParams

    try {
      const cartUpdated = await this.cartService.ManageCart(
        id,
        product,
        manageActions.REMOVE,
      )

      return await this.someService.FormateData<ICart>({
        data: cartUpdated,
        message: 'ITEM_ADDED_TO_CART',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }
}
