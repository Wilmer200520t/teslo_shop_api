import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Product title',
    example: 'Nike Air Max 90',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product category',
    example: ['men', 'women', 'kids', 'unisex'],
  })
  @IsIn(['men', 'women', 'kids', 'unisex'])
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Product tags',
    example: ['nike', 'shoes', 'running'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
