import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ICartSqueme, IOrderScheme } from '../models'

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<IOrderScheme>,
    @InjectModel('Cart') private cartModel: Model<ICartSqueme>,
  ) {}

  async Orders(id: string) {
    const order = await this.orderModel.find({ userId: id })

    if (!order) throw new NotFoundException()

    return order
  }

  async CreateOrder(customerId: string) {
    const cartFound = await this.cartModel.findOne({ idCustomer: customerId })

    if (!cartFound) throw new NotFoundException('Cart not found')
    if (!cartFound.cart) throw new BadRequestException('Users cart is empty')

    const { cart } = cartFound

    let amount = 0

    cart.forEach((item) => {
      amount += item.product.price * item.units
    })

    try {
      const newOrder = await this.orderModel.create({
        userId: customerId,
        amount,
        items: cart,
      })

      await cartFound.updateOne({ $set: { cart: [] } })

      return newOrder
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async Order(id: string) {
    const order = await this.orderModel.findOne({ _id: id })

    if (!order) throw new NotFoundException('Order not found')

    return order
  }
}
