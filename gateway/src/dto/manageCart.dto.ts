import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ManageCartDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsNumber()
  units: number
}
