import { Actions } from 'redux-retro';
import type { Store } from 'redux';
import { IAppState } from '../store';

import MainNavigationActions from './MainNavigationActions';
import ProductSearchActions from './ProductSearchActions';
import CartActions from './CartActions';

export default class AppStartupActions extends Actions<IAppState> {
  private mainNavigationActions: MainNavigationActions;
  private productSearchActions: ProductSearchActions;
  private cartActions: CartActions;

  constructor(
    store: Store<IAppState>,
    mainNavigationActions: MainNavigationActions,
    productSearchActions: ProductSearchActions,
    cartActions: CartActions
  ) {
    super(store);

    this.mainNavigationActions = mainNavigationActions;
    this.productSearchActions = productSearchActions,
    this.cartActions = cartActions
  }

  public async startApp() {
    this.mainNavigationActions.navigateTo('/');

    await Promise.all([
      this.productSearchActions.fetchFeaturedProducts(),
      this.cartActions.fetchCart()
    ]);
  }
}
