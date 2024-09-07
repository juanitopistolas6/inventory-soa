import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { UpdatePasswordDto, UserDecorator } from './dto/'
import { User } from './decorators/get-user'
import { SomeService } from 'src/utils/someService'
import { UpdateUserDto } from './dto/update-user.dto'

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private someService: SomeService,
  ) {}

  @Get()
  async getAll() {
    return await this.userService.findAll()
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    return await this.userService.Customer(id)
  }

  @Put('change-pass')
  async updatePassword(
    @Body() password: UpdatePasswordDto,
    @User() user: UserDecorator,
  ) {
    const salt = await this.userService.Customer(user.id, 'salt')

    const newPassword = await this.someService.GeneratePassword(
      password.password,
      salt.salt,
    )

    return await this.userService.changePassowrd(user.id, newPassword)
  }

  @Patch()
  async updateCustomer(
    @Body() updateUser: UpdateUserDto,
    @User('id') id: string,
  ) {
    return this.userService.updateCustomer(id, updateUser)
  }
}
