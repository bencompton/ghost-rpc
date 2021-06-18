import { createReducer } from 'redux-retro';

import ProductSearchActions from '../actions/ProductSearchActions';
import CartActions from '../actions/CartActions';
import { IProduct } from '../../../../shared/services/product-search-service';

export interface IProductState {
  downloadedProducts: { [productId: number]: IProduct };
}

const initialState: IProductState = {
  downloadedProducts: {}
};

const convertProductListToMap = (products: IProduct[]) => {
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

const getDownloadedProductsWithNewProductsAdded = (state: IProductState, newProducts: IProduct[]) => {
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
