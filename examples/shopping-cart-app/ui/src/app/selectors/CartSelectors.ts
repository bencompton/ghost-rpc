import { IAppState } from '../store';
import { getDownloadedProducts } from './ProductSelectors';

export const getProductIdsInCart = (state: IAppState) => state.cart.productIdsInCart;
export const getCartProductCount = (state: IAppState) => state.cart.productIdsInCart.length;

export const productAlreadyInCart = (state: IAppState, productId: number) => {
  return state.cart.productIdsInCart.indexOf(productId) !== -1;
};

export const getProductsInCart = (state: IAppState) => {
  const downloadedProducts = getDownloadedProducts(state);
  const productIdsInCart = getProductIdsInCart(state);

  return productIdsInCart.map((productId) => {
    return downloadedProducts[productId];
  });
};
