import { IsEnum, IsNotEmpty } from 'class-validator'
import { ProductCategory } from '../types'

export class CategoryDto {
  @IsNotEmpty()
  @IsEnum(ProductCategory, {
    message:
      'Category must be one of the following: Mobile, Laptop, Camera, TV',
  })
  type: ProductCategory
}
