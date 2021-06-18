import { createReducer } from 'redux-retro';

import CartActions from '../actions/CartActions';
import CheckoutActions from '../actions/CheckoutActions';

export interface ICartState {
  productIdsInCart: number[];
}

const initialState: ICartState = {
  productIdsInCart: []
};

export default createReducer<ICartState>(initialState)
  .bindAction(CartActions.prototype.productAddedToCart, (state, action) => {
    return {
      ...state,
      productIdsInCart: [...state.productIdsInCart, action.payload]
    };
  })
  .bindAction(CartActions.prototype.cartFetchSucceeded, (state, action) => {
    return {
      ...state,
      productIdsInCart: action.payload.map(product => product.id)
    };
  })
  .bindAction(CheckoutActions.prototype.proceedToCheckout, () => {
    return initialState;
  });
