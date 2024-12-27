import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';
import { User } from 'src/auth/entities/users.entity';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
    nullable: false,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    nullable: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // Load images when loading product
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  private generateSlug(title: string): string {
    return title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
  }

  @BeforeInsert()
  checkSlugInsert() {
    this.slug = this.slug
      ? this.generateSlug(this.slug)
      : this.generateSlug(this.title);
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      ? this.generateSlug(this.slug)
      : this.generateSlug(this.title);
  }
}
