import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
  size: string[];

  @Column('text')
  gender: string;

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
