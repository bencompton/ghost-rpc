import { connect } from 'react-redux-retro';

import { IAppState } from '../store';
import { IAppActions } from '../actions';
import CartPage from '../components/cart/CartPage';
import { getProductsInCart } from '../selectors/CartSelectors';

export const mapStateToProps = (state: IAppState) => {
  return {
    productsInCart: getProductsInCart(state)
  };
};

export const mapActionsToProps = (actions: IAppActions) => {
  return {
    onReturnToProductSearch: actions.cart.returnToProductSearch,
    onProceedToCheckout: actions.checkout.proceedToCheckout
  };
};

export default connect(mapStateToProps, mapActionsToProps, CartPage);
