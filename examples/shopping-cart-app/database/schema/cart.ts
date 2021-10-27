import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryColumn({ type: 'int', unsigned: true })
  user_id!: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  product_id!: number;
}
