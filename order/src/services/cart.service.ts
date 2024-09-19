import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IProductSqueme } from 'src/interfaces'
import { ICartSqueme } from 'src/models'
import { manageActions } from 'src/types'

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private cartModel: Model<ICartSqueme>) {}

  async Cart(id: string) {
    try {
      const cart = await this.cartModel.findOne({ idCustomer: id })

      if (!cart) throw new NotFoundException('Cart not found.')

      return cart
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async CreateCart(idCustomer: string, products?: IProductSqueme) {
    return await this.cartModel.create({ idCustomer, cart: products })
  }

  async ManageCart(id: string, product: IProductSqueme, action: manageActions) {
    const cart = await this.cartModel.findOne({ idCustomer: id })

    if (!cart) return await this.CreateCart(id, product)

    const itemFound = cart.cart.find(
      (product) => product.product._id.toString() === product.product._id,
    )

    if (action === manageActions.ADD) {
      // ADD ITEM TO CART
      if (itemFound) {
        // IF ITEM WAS FOUND
        await this.cartModel.updateOne(
          {
            idCustomer: id,
            'cart.product.id': product.product._id,
          },
          { $set: { 'cart.$.units': itemFound.units + product.units } },
        )
      } else {
        // IF ITEM WAS NOT FOUND
        await this.cartModel.updateOne(
          { idCustomer: id },
          { $push: { cart: product } },
        )
      }
    } else {
      // REMOVE ITEM FROM CART

      if (!itemFound) throw new NotFoundException('Product not found in cart')

      const unitsToUpdate = itemFound.units - product.units

      if (unitsToUpdate <= 0) {
        await this.cartModel.updateOne(
          {
            idCustomer: id,
            'cart.product.id': product.product._id,
          },
          { $pull: { cart: { 'product._id': itemFound.product._id } } },
        )
      } else {
        await this.cartModel.updateOne(
          {
            idCustomer: id,
            'cart.product.id': product.product._id,
          },
          { $set: { 'cart.$.units': unitsToUpdate } },
        )
      }
    }

    return await this.cartModel.findOne({ idCustomer: id })
  }
}
