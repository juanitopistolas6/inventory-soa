import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'
import { ProductCategory } from '../types'

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUrl()
  banner: string

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory

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
