import { Connection } from 'typeorm';

import CartRepository from './cart-repository';
import ProductSearchRepository from './product-search-repository';

export interface ICartRepository extends CartRepository {};
export interface IProductSearchRepository extends ProductSearchRepository {};

export interface IAppRepositories {
  cartRepository: ICartRepository;
  productSearchRepository: IProductSearchRepository;
}

export const getRepositories = (connection: Connection): IAppRepositories => {
  return {
    cartRepository: new CartRepository(connection),
    productSearchRepository: new ProductSearchRepository(connection)
  };
};
