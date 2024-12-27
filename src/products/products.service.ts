import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { User } from 'src/auth/entities/users.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...ProductDetails } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...ProductDetails,
        images: images.map((url) =>
          this.productImageRepository.create({ url }),
        ),
        user,
      });

      await this.productRepository.save(product);

      return this.makeProductResponse(product);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const products = await this.productRepository.find({
      skip: paginationDto?.offset,
      take: paginationDto?.limit,
      relations: {
        images: true,
      },
    });

    return this.makeProductResponse(products);
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
          .leftJoinAndSelect('product.images', 'images')
          .getOne();
      }

      //More way to find a product
      //const product = await queryBuilder.where(search).getOne();

      //const product = await this.productRepository.findOne({
      //  where: [search],
      //});

      if (!product)
        throw new BadRequestException('Product `' + parameter + '` not found');

      return this.makeProductResponse(product);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const { images, ...ProductDetails } = updateProductDto;

      const product = await this.productRepository.preload({
        id: id,
        ...ProductDetails,
        user,
      }); //Preload is used to update only the fields that are passed

      if (!product)
        throw new BadRequestException('Product `' + id + '` not found');

      //Query runner
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((url) => {
          return this.productImageRepository.create({ url });
        });
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return await this.findOne(product.id);
    } catch (error) {
      this.handleDBError(error);
      queryRunner.rollbackTransaction();
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.productRepository.delete({ id });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any) {
    this.logger.error(error);

    let errorMessage = error.message || error.detail || error;
    errorMessage = errorMessage.replaceAll(/"/g, '');

    throw new BadRequestException(errorMessage);
  }

  private makeProductResponse(product: Product[] | Product) {
    if (Array.isArray(product)) {
      return product.map((product) => {
        const user = product.user;
        delete user.password;
        delete user.email;
        return {
          ...product,
          images: product.images.map((img) => img.url),
          user,
        };
      });
    }

    const user = product.user;
    delete user.password;
    delete user.email;

    return {
      ...product,
      images: product.images.map((img) => img.url),
      user,
    };
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder();

    try {
      return await query.delete().execute();
    } catch (error) {
      this.handleDBError(error);
    }
  }
}
