import { IsNotEmpty, IsString } from 'class-validator'

export class CredentialsDto {
  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  password: string
}
