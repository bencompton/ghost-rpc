import { IAppState } from '../store';
import { getProductIdsInCart } from './CartSelectors';
import { getDownloadedProducts } from './ProductSelectors';
import { IProduct } from '../../../../shared/services/product-search-service';

export interface ISearchResultProduct extends IProduct {
  isInCart: boolean;
}

export const getCurrentSearchResults = (state: IAppState) => {
  const productIdsInCart = getProductIdsInCart(state);
  const productIds = state.productSearch.currentSearchText.length
    ? state.productSearch.currentSearchResultProductIds
    : state.productSearch.featuredProductIds;
  const downloadedProducts = getDownloadedProducts(state);

  return productIds.map((productId) => {
    const product = downloadedProducts[productId];

    return { ...product, isInCart: productIdsInCart.indexOf(product.id) !== -1 } as ISearchResultProduct;
  });
};

export const getCurrentSearchText = (state: IAppState) => {
  return state.productSearch.currentSearchText;
};

export const searchResultsLoading = (state: IAppState) => {
  return state.productSearch.loading;
};

export const getSearchErrorMessage = (state: IAppState) => {
  return state.productSearch.errorMessage;
};
