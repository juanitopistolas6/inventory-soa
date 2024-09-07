import { IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  password: string
}
