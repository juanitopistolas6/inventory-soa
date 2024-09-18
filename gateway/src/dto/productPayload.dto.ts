import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ProductPayloadDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsNumber()
  units: number
}
