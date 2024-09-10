import { UserService } from './user.service'
import { SomeService } from '../utils/someService'
import { UpdateUserDto } from './dto'
import { Controller, HttpStatus } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { User, Messages } from '../types'
import { IResponse } from '../interfaces'

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private someService: SomeService,
  ) {}

  @MessagePattern(Messages.GET_ALL)
  async getAll(): Promise<IResponse<Array<User>>> {
    const users = await this.userService.findAll()

    return await this.someService.FormateData<Array<User>>({
      data: users,
      message: 'ALL_USERS_RETURNED',
    })
  }

  @MessagePattern(Messages.GET_CUSTOMER)
  async getCustomer(getParams: { id: string }): Promise<IResponse<User>> {
    try {
      const { id } = getParams

      const user = await this.userService.Customer(id)

      return this.someService.FormateData({
        data: user,
        message: 'USER_RETURNED',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
        status: HttpStatus.BAD_REQUEST,
      })
    }
  }

  @MessagePattern(Messages.UPDATE_PASSWORD)
  async updatePassword(updatePassParams: {
    id: string
    password: string
  }): Promise<IResponse<User>> {
    try {
      const { id, password } = updatePassParams

      const salt = await this.userService.Customer(id, 'salt')

      const newPassword = await this.someService.GeneratePassword(
        password,
        salt.salt,
      )

      const userUpdated = await this.userService.changePassowrd(id, newPassword)

      return this.someService.FormateData({
        data: userUpdated,
        message: 'PASSWORD_UPDATED',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
        status: HttpStatus.BAD_REQUEST,
      })
    }
  }

  @MessagePattern(Messages.UPDATE_CUSTOMER)
  async updateCustomer(updateCustomerParams: {
    updateUser: UpdateUserDto
    id: string
  }): Promise<IResponse<User>> {
    try {
      const { id, updateUser } = updateCustomerParams

      const userUpdated = await this.userService.updateCustomer(id, updateUser)

      return await this.someService.FormateData({
        data: userUpdated,
        message: 'CUSTOMER_UPDATED',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
        status: HttpStatus.BAD_REQUEST,
      })
    }
  }
}
