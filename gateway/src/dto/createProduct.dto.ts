import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  banner: string

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsString()
  suplier: string

  @IsNotEmpty()
  @IsNumber()
  units: number
}
