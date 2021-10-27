import { createReducer } from 'redux-retro';

import ProductSearchActions from '../actions/ProductSearchActions';
import CartActions from '../actions/CartActions';
import { IProductSearchResult } from '../../../../shared/repositories/product-search-repository';

export interface IProductState {
  downloadedProducts: { [productId: number]: IProductSearchResult };
}

const initialState: IProductState = {
  downloadedProducts: {}
};

const convertProductListToMap = (products: IProductSearchResult[]) => {
  return products.reduce(
    (productMap, nextProduct) => {
      return {
        ...productMap,
        [nextProduct.id]: nextProduct
      };
    },
    {}
  );
};

const getDownloadedProductsWithNewProductsAdded = (state: IProductState, newProducts: IProductSearchResult[]) => {
  return {
    ...state,
    downloadedProducts: {
      ...state.downloadedProducts,
      ...convertProductListToMap(newProducts)
    }
  };
};

export default createReducer<IProductState>(initialState)
  .bindAction(ProductSearchActions.prototype.featuredProductFetchSucceeded, (state, action) => {
    return getDownloadedProductsWithNewProductsAdded(state, action.payload);
  })
  .bindAction(ProductSearchActions.prototype.productSearchSucceeded, (state, action) => {
    return getDownloadedProductsWithNewProductsAdded(state, action.payload.products);
  })
  .bindAction(CartActions.prototype.cartFetchSucceeded, (state, action) => {
    return getDownloadedProductsWithNewProductsAdded(state, action.payload);
  });
