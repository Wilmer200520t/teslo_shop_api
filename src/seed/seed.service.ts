import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/auth/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async executeSeed() {
    await this.deleteTables();
    const insertPromisesUsers = [];
    const insertPromisesProducts = [];

    for (const user of initialData.users) {
      insertPromisesUsers.push(this.authService.create(user));
    }

    await Promise.all(insertPromisesUsers);

    const userDefault = await this.userRepository.findOne({
      where: { email: initialData.users[0].email },
    });

    for (const product of initialData.products) {
      insertPromisesProducts.push(
        this.productsService.create(product, userDefault),
      );
    }

    await Promise.all(insertPromisesProducts);

    return 'Seed executed Successfully!!';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.userRepository.delete({});
  }
}
