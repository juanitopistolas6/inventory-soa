import { UserService } from './user.service'
import { SomeService } from '../utils/someService'
import { UpdateUserDto } from './dto/update-user.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { Messages } from '../types/messages_types'

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private someService: SomeService,
  ) {}

  @MessagePattern(Messages.GET_ALL)
  async getAll() {
    return await this.userService.findAll()
  }

  @MessagePattern(Messages.GET_CUSTOMER)
  async getCustomer(getParams: { id: string }) {
    const { id } = getParams

    return await this.userService.Customer(id)
  }

  @MessagePattern(Messages.UPDATE_PASSWORD)
  async updatePassword(updatePassParams: { id: string; password: string }) {
    const { id, password } = updatePassParams

    const salt = await this.userService.Customer(id, 'salt')

    const newPassword = await this.someService.GeneratePassword(
      password,
      salt.salt,
    )

    return await this.userService.changePassowrd(id, newPassword)
  }

  @MessagePattern(Messages.UPDATE_CUSTOMER)
  async updateCustomer(updateCustomerParams: {
    updateUser: UpdateUserDto
    id: string
  }) {
    const { id, updateUser } = updateCustomerParams

    return this.userService.updateCustomer(id, updateUser)
  }
}
