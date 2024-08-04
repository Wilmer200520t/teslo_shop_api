import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async executeSeed() {
    await this.productsService.deleteAllProducts();

    for (const product of initialData.products) {
      await this.productsService.create(product);
    }

    return 'Seed executed Successfully!!';
  }
}
