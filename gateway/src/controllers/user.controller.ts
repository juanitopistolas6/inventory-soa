import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { messagesCustomer } from '../types'
import { AuthGuard } from '../guards/auth.guard'
import { UpdatePassword, UserDto } from '../dto'
import { firstValueFrom } from 'rxjs'
import { IResponse, User } from '../interfaces'
import { Authorization, GetUser } from '../decorators'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
  ) {}

  @Get('whoami')
  @Authorization(false)
  whoami() {
    return { mesage: 'Your a customer :)' }
  }

  @Get()
  @Authorization(true)
  async getAll(): Promise<IResponse<Array<User>>> {
    const customersResponse: IResponse<Array<User>> = await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.GET_ALL, {}),
    )

    if (customersResponse.status !== HttpStatus.OK)
      throw new BadRequestException(customersResponse.message)

    return customersResponse
  }

  @Get(':id')
  @Authorization(true)
  async getCustomer(@Param('id') id: string): Promise<IResponse<User>> {
    const customerResponse: IResponse<User> = await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.GET_CUSTOMER, { id }),
    )

    if (customerResponse.status !== HttpStatus.OK)
      throw new BadRequestException(customerResponse.message)

    return customerResponse
  }

  @Put('update-password')
  @Authorization(true)
  async updatePassword(
    @GetUser() user: User,
    updatePassword: UpdatePassword,
  ): Promise<IResponse<User>> {
    const updatedCustomer: IResponse<User> = await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.UPDATE_CUSTOMER, {
        id: user._id,
        password: updatePassword.password,
      }),
    )

    if (updatedCustomer.status !== HttpStatus.OK)
      throw new BadRequestException(updatedCustomer.message)

    return updatedCustomer
  }

  @Post()
  @Authorization(false)
  async createCustomer(@Body() userObject: UserDto): Promise<IResponse<User>> {
    const userCreated: IResponse<User> = await firstValueFrom(
      this.customerServiceClient.send(messagesCustomer.REGISTER, userObject),
    )

    if (userCreated.status !== HttpStatus.CREATED)
      throw new BadRequestException(userCreated.message)

    return userCreated
  }
}
