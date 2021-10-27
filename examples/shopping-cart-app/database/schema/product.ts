import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  description!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', length: 50 })  
  image!: string;
}
