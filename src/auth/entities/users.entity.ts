import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ValidRoles } from '../interfaces/valid.roles';
import { Product } from 'src/products/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('varchar', {
    length: 255,
  })
  @Index('UQ_user_email', { unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: ValidRoles[];

  @OneToMany(() => Product, (Product) => Product.user)
  product: Product;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.email = this.email.toLowerCase();
  }
}
