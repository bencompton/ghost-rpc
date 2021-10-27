import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FeaturedProduct {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Column({ type: 'int', unsigned: true })
  product_id!: number;
}
