import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  size: string[];

  @IsIn(['men', 'women', 'kids', 'unisex'])
  @IsOptional()
  gender?: string;
}
