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

      if (!cart) throw new NotFoundException()

      return cart
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async ManageCart(id: string, product: IProductSqueme, action: manageActions) {
    if (action === manageActions.ADD) {
    } else {
    }
  }
}
