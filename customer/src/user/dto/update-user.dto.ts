import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  user?: string

  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'Phone field must have 10 characters' })
  phone?: string
}
