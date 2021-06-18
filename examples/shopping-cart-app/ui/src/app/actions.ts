import { Store } from 'redux';
import { ServicesProxy } from 'ghost-rpc';

import ProductSearchActions from './actions/ProductSearchActions';
import CartActions from './actions/CartActions';
import { IAppState } from './store';
import MainNavigationActions from './actions/MainNavigationActions';
import AppStartupActions from './actions/AppStartupActions';
import CheckoutActions from './actions/CheckoutActions';
import { IAppServices } from '../../../shared/services';

export interface IAppActions {
  mainNavigation: MainNavigationActions;
  appStartup: AppStartupActions;
  productSearch: ProductSearchActions;
  cart: CartActions;
  checkout: CheckoutActions;
}

export const getActions = (store: Store<IAppState>, services: ServicesProxy<IAppServices>) => {
  const actions: IAppActions = { } as any;

  actions.mainNavigation = new MainNavigationActions(store);
  actions.productSearch = new ProductSearchActions(store, services.productSearchService);
  actions.cart = new CartActions(store, services.cartService, actions.mainNavigation);
  actions.checkout = new CheckoutActions(store, actions.mainNavigation);
  actions.appStartup = new AppStartupActions(store, actions.mainNavigation, actions.productSearch, actions.cart);

  return actions;
};
