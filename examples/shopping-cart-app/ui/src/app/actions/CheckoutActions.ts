import { Actions } from 'redux-retro';
import { Store } from 'redux';
import { IAppState } from '../store';
import MainNavigationActions from './MainNavigationActions';

export default class CheckoutActions extends Actions<IAppState> {
  private mainNavigationActions: MainNavigationActions;

  constructor(
    store: Store<IAppState>,
    mainNavigationActions: MainNavigationActions
  ) {
    super(store);

    this.mainNavigationActions = mainNavigationActions;
  }

  public proceedToCheckout(): any {
    this.mainNavigationActions.navigateTo('/');

    return null;
  }
}
