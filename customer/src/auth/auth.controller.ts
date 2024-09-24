import {
  Body,
  Controller,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { UserDto, LoginUserDto } from './dto/'
import { AuthService } from './auth.service'
import { SomeService } from '../utils/someService'
import { MessagePattern } from '@nestjs/microservices'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MessagesAuth } from '../types'
import { IResponse, token, User } from '../interfaces'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private someService: SomeService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  @MessagePattern(MessagesAuth.REGISTER)
  async createCustomer(@Body() userDto: UserDto): Promise<IResponse<User>> {
    try {
      const salt = await this.someService.GenerateSalt()

      const hashedPassword = await this.someService.GeneratePassword(
        userDto.password,
        salt,
      )

      userDto.password = hashedPassword

      const newCustomer = await this.authService.Create({ ...userDto, salt })

      return await this.someService.FormateData<User>({
        data: newCustomer,
        message: 'NEW_CUSTOMER_CREATED',
        status: HttpStatus.CREATED,
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
      })
    }
  }

  @MessagePattern(MessagesAuth.LOGIN)
  async login(userDto: LoginUserDto): Promise<IResponse<token>> {
    try {
      console.log(userDto)
      const user = await this.authService.findUser(userDto.user)

      const isUser = await this.someService.VerifyPassword(
        userDto.password,
        user.password,
        user.salt,
      )

      if (!isUser)
        return await this.someService.FormateData<null>({
          error: true,
          message: 'NOT_FOUND_ERROR',
          status: HttpStatus.NOT_FOUND,
        })

      const token = await this.someService.GenerateSignature({
        id: user._id,
        user: user.user,
        name: user.name,
        type: user.type,
      })

      return await this.someService.FormateData<token>({
        data: {
          id: user._id,
          token,
        },
        message: 'LOGIN_TOKEN_GENERATED',
      })
    } catch (e) {
      return await this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @MessagePattern(MessagesAuth.VERIFY_TOKEN)
  async verifyToken(tokenParam: { token: string }): Promise<IResponse<User>> {
    const { token } = tokenParam

    if (!token) throw new UnauthorizedException()
    try {
      const payload: token = await this.jwt.verifyAsync(token, {
        secret: this.configService.get('SECRET_KEY'),
      })

      const user = await this.authService.findUserById(payload.id)

      delete user.orders

      return await this.someService.FormateData({
        data: user,
        message: 'TOKEN_VERIFIED_SUCCESFULLY',
      })
    } catch {
      return await this.someService.FormateData({
        error: true,
        message: 'ERROR_VERIFYING_TOKEN',
        status: HttpStatus.UNAUTHORIZED,
      })
    }
  }
}
