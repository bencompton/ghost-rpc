import { Like } from 'typeorm';

import { Product } from '../../database/schema';
import { FeaturedProduct } from '../../database/schema/featured-product';
import BaseRepository from './base-repository';

export interface IProductSearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const products: IProductSearchResult[] = [{
  id: 1,
  name: 'iPhone',
  description: 'Apple iPhone',
  price: 399,
  image: 'iphone.jpg'
}, {
  id: 2,
  name: 'Samsung Galaxy',
  description: 'Samsung Galaxy',
  price: 299,
  image: 'samsung-galaxy.jpg'
}, {
  id: 3,
  name: 'Macbook Pro',
  description: 'Macbook Pro',
  price: 1299,
  image: 'macbook-pro.jpg'
}, {
  id: 4,
  name: 'Dell XPS 13',
  description: 'Dell XPS 13',
  price: 999,
  image: 'dell-xps-13.jpg'
}];

export default class extends BaseRepository {
  public async getFeaturedProducts() {
    return await this.connection
      .createQueryBuilder()
      .from(Product, 'p')
      .innerJoin(FeaturedProduct, 'fp', 'p.id = fp.product_id')
      .select(['p.id as id', 'name', 'description', 'price', 'image'])
      .execute() as IProductSearchResult[];
  }

  public async getProductSearchResults(searchText: string) {
    return await this.connection
      .createQueryBuilder()
      .from(Product, 'p')
      .where({
        name: Like(`%${searchText}%`)
      })
      .orWhere({
        description: Like(`%${searchText}%`)
      })
      .select(['id', 'name', 'description', 'price', 'image'])
      .execute() as IProductSearchResult[];
  }
}
