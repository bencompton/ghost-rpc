import { ServicesFactory } from 'ghost-rpc';

import ProductSearchService from './product-search-service';
import CartService from './cart-service';
import { IAppRepositories } from '../repositories';

export interface IAppServices {
  cartService: CartService;
  productSearchService: ProductSearchService;
}

export interface IAppServiceContext {
  loggedInUserId: number;
}

export interface IAppServiceConstructionParams {
  repositories: IAppRepositories;
  context: IAppServiceContext;
}

export const servicesFactory: ServicesFactory<IAppServices, IAppServiceConstructionParams> = {
  cartService(params) {
    return new CartService(params.context, params.repositories.cartRepository);
  },

  productSearchService(params) {
    return new ProductSearchService(params.repositories.productSearchRepository);
  }
};
