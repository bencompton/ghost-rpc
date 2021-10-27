import BaseRepository from './base-repository';
import { Cart, Product } from '../../database/schema/';
import { IProductSearchResult } from './product-search-repository';

export interface ICartProduct extends IProductSearchResult { }

export default class extends BaseRepository {
  public async getProductsInCart(userId: number) {
    return await this.connection
      .createQueryBuilder()
      .from(Product, 'p')
      .innerJoin(Cart, 'c', 'c.product_id = p.id')
      .where(`c.user_id = ${userId}`)
      .select(['id', 'name', 'description', 'price', 'image'])
      .execute() as ICartProduct[];
  }

  public async addToCart(userId: number, productId: number) {
    await this.connection
      .getRepository(Cart)
      .insert([{
        user_id: userId,
        product_id: productId
      }]);
  }

  public async clearCart(userId: number) {
    await this.connection
      .getRepository(Cart)
      .delete({
        user_id: userId
      });
  }
}
