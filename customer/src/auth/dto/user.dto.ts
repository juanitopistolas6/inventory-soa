import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UserDto {
  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'phone field must have 10 characters' })
  phone: string
}

export class CreateUserDto extends UserDto {
  salt: string
}
