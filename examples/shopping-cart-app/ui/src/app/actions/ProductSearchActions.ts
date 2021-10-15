import { Actions } from 'redux-retro';
import { Store } from 'redux';
import { ServiceProxy } from 'ghost-rpc';

import { IAppState } from '../store';
import ProductSearchService, { IProduct } from '../../../../shared/services/product-search-service';

export default class ProductSearchActions extends Actions<IAppState> {
  private productSearchService: ServiceProxy<ProductSearchService>;

  constructor(
    store: Store<IAppState>,
    productSearchService: ServiceProxy<ProductSearchService>
  ) {
    super(store);

    this.productSearchService = productSearchService;
  }

  public async fetchFeaturedProducts() {
    try {
      const products = await this.productSearchService.getFeaturedProducts();
      this.featuredProductFetchSucceeded(products);
    } catch (error) {
      this.featuredProductFetchFailed(error as Error);
    }
  }

  public featuredProductFetchSucceeded(products: IProduct[]) {
    return products;
  }

  public featuredProductFetchFailed(error: Error) {
    return error.message;
  }

  public async searchForProduct(searchText: string) {
    this.currentSearchTextChanged(searchText);

    try {
      const products = await this.productSearchService.searchForProduct(searchText);
      this.productSearchSucceeded(searchText, products);
    } catch (error) {
      this.productSearchFailed(error as Error);
    }
  }

  public currentSearchTextChanged(searchText: string) {
    return searchText;
  }

  public productSearchSucceeded(searchText: string, products: IProduct[]) {
    return {
      searchText,
      products
    };
  }

  public productSearchFailed(error: Error) {
    return error.message;
  }
}
