import { Controller } from '@nestjs/common'
import { OrderService } from './services/order.service'
import { MessagePattern } from '@nestjs/microservices'
import { IResponse, IOrder } from './interfaces'
import { SomeService } from './services'
import { ORDER_MESSAGES } from './types'

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private someService: SomeService,
  ) {}

  @MessagePattern(ORDER_MESSAGES.GET_ORDERS)
  async getOrders(orderParam: { id: string }): Promise<IResponse<IOrder[]>> {
    try {
      const { id } = orderParam

      const orders = await this.orderService.Orders(id)

      return await this.someService.FormateData<IOrder[]>({
        data: orders,
        message: 'ORDERS_FOUND',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(ORDER_MESSAGES.GET_ORDER)
  async getOrder(orderParams: { idOrder: string }): Promise<IResponse<IOrder>> {
    const { idOrder } = orderParams

    try {
      const order = await this.orderService.Order(idOrder)

      return await this.someService.FormateData<IOrder>({
        data: order,
        message: 'ORDER_FOUND',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(ORDER_MESSAGES.CREATE_ORDER)
  async newOrder(orderParams: {
    customerId: string
  }): Promise<IResponse<IOrder>> {
    const { customerId } = orderParams

    console.log(customerId)

    try {
      const order = await this.orderService.CreateOrder(customerId)

      return await this.someService.FormateData<IOrder>({
        data: order,
        message: 'ORDER_CREATED',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }
}
