import { Actions } from 'redux-retro';
import { Store } from 'redux';
import { ServiceProxy } from 'ghost-rpc';

import { productAlreadyInCart } from '../selectors/CartSelectors';
import CartService from '../../../../shared/services/cart-service';
import MainNavigationActions from './MainNavigationActions';
import { IAppState } from '../store';
import { ICartProduct } from '../../../../shared/repositories/cart-repository';

export default class CartActions extends Actions<IAppState> {
  private cartService: ServiceProxy<CartService>;
  private mainNavigationActions: MainNavigationActions;

  constructor(
    store: Store<IAppState>,
    cartService: ServiceProxy<CartService>,
    mainNavigationActions: MainNavigationActions
  ) {
    super(store);

    this.cartService = cartService;
    this.mainNavigationActions = mainNavigationActions;
  }

  public async fetchCart() {
    try {
      const cartProducts = await this.cartService.loadMyCart();
      this.cartFetchSucceeded(cartProducts);
    } catch (error) {
      this.cartFetchFailed(error as Error);
    }
  }

  public cartFetchSucceeded(cartProducts: ICartProduct[]) {
    return cartProducts;
  }

  public cartFetchFailed(error: Error) {
    return error.message;
  }

  public async addToCart(productId: number) {
    if (productAlreadyInCart(this.getState(), productId)) {
      return;
    }

    try {
      await this.cartService.addToCart(productId);
      this.productAddedToCart(productId);
    } catch (error) {
      this.addToCartFailed(error as Error);
    }
  }

  public productAddedToCart(productId: number) {
    return productId;
  }

  public addToCartFailed(error: Error) {
    return error.message;
  }

  public viewCart() {
    this.mainNavigationActions.navigateTo('/cart/');
  }

  public returnToProductSearch() {
    this.mainNavigationActions.goBack();
  }
}
