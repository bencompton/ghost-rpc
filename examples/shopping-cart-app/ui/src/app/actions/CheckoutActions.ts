import { ServiceProxy } from 'ghost-rpc';
import { Actions } from 'redux-retro';
import { Store } from 'redux';

import { IAppState } from '../store';
import CartService from '../../../../shared/services/cart-service';
import AppStartupActions from './AppStartupActions';

export default class CheckoutActions extends Actions<IAppState> {
  private cartService: ServiceProxy<CartService>;
  private appStartupActions: AppStartupActions;

  constructor(
    store: Store<IAppState>,
    appStartupActions: AppStartupActions,
    cartService: ServiceProxy<CartService>
  ) {
    super(store);

    this.cartService = cartService;
    this.appStartupActions = appStartupActions;
  }

  public async proceedToCheckout() {
    await this.cartService.proceedToCheckout();
    await this.appStartupActions.startApp();
  }
}
