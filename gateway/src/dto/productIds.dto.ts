import { ArrayNotEmpty, IsArray, IsString } from 'class-validator'

export class ProductIdsDto {
  @IsArray() // Valida que el campo sea un array
  @ArrayNotEmpty() // Valida que el array no esté vacío
  @IsString({ each: true }) // Valida que cada elemento del array sea una string
  ids: string[]
}
