import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { AuthService } from './auth.service'
import { SomeService } from 'src/utils/someService'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private someService: SomeService,
  ) {}

  @Post('register')
  async createCustomer(@Body() userDto: UserDto) {
    const salt = await this.someService.GenerateSalt()

    const hashedPassword = await this.someService.GeneratePassword(
      userDto.password,
      salt,
    )

    userDto.password = hashedPassword

    return await this.authService.Create({ ...userDto, salt })
  }

  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    const user = await this.authService.findUser(userDto.user)

    const isUser = await this.someService.VerifyPassword(
      userDto.password,
      user.password,
      user.salt,
    )

    if (!isUser) throw new NotFoundException()

    const token = await this.someService.GenerateSignature({
      id: user._id,
      user: user.user,
      name: user.name,
      type: user.type,
    })

    return {
      token,
      id: user._id,
    }
  }
}
