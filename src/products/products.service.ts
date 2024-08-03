import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const products = await this.productRepository.find({
      skip: paginationDto?.offset,
      take: paginationDto?.limit,
    });

    return products;
  }

  async findOne(parameter: string) {
    const queryBuilder = this.productRepository.createQueryBuilder();
    let product: Product;
    try {
      if (isUUID(parameter))
        product = await this.productRepository.findOneBy({ id: parameter });

      if (!isUUID(parameter)) {
        product = await queryBuilder
          .where('LOWER(title) = :title OR LOWER(slug) = :slug', {
            title: parameter.toLowerCase(),
            slug: parameter.toLowerCase(),
          })
          .getOne();
      }

      //More way to find a product
      //const product = await queryBuilder.where(search).getOne();

      //const product = await this.productRepository.findOne({
      //  where: [search],
      //});

      if (!product)
        throw new BadRequestException('Product `' + parameter + '` not found');

      return product;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);

      return await this.productRepository.remove(product);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any) {
    this.logger.error(error);

    throw new BadRequestException(error.detail || error.message || error);
  }
}
