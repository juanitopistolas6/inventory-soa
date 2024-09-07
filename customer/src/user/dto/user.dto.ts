import { IsNotEmpty, IsString } from 'class-validator'

export class UserDecorator {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  type: string
}
