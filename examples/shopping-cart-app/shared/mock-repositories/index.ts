import MockCartRepository from './mock-cart-repository';
import MockProductSearchRepository from './mock-product-search-repository';

export interface ICartRepository extends MockCartRepository {};
export interface IProductSearchRepository extends MockProductSearchRepository {};

export interface IAppRepositories {
  cartRepository: ICartRepository;
  productSearchRepository: IProductSearchRepository;
}

export const mockRepositories: IAppRepositories = {
  cartRepository: new MockCartRepository(),
  productSearchRepository: new MockProductSearchRepository()
};
