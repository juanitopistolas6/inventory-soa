import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  password: string
}
