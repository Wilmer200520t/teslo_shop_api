import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async executeSeed() {
    await this.productsService.deleteAllProducts();
    const insertPromises = [];

    for (const product of initialData.products) {
      insertPromises.push(this.productsService.create(product));
    }

    await Promise.all(insertPromises);

    return 'Seed executed Successfully!!';
  }
}
