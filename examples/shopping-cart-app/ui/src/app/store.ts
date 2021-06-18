import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware, startListener } from 'redux-first-routing';
import * as history from 'history';

import productSearchReducer, { IProductSearchState } from './reducers/ProductSearchReducer';
import cartReducer, { ICartState } from './reducers/CartReducer';
import productReducer, { IProductState } from './reducers/ProductReducer';

export interface IAppState {
  router: any;
  products: IProductState;
  productSearch: IProductSearchState;
  cart: ICartState;
}

export const getStore = () => {
  const memoryHistory = history.createMemoryHistory();

  const store = createStore(
    combineReducers<IAppState>({
      router: routerReducer,
      products: productReducer,
      productSearch: productSearchReducer,
      cart: cartReducer
    }),
    applyMiddleware(routerMiddleware(memoryHistory) as any)
  );

  startListener(memoryHistory, store);

  return store;
};
