import { createReducer } from 'redux-retro';

import ProductSearchActions from '../actions/ProductSearchActions';

export interface IProductSearchState {
  loading: boolean;
  errorMessage: string;
  currentSearchText: string;
  currentSearchResultProductIds: number[];
  featuredProductIds: number[];
}

const initialState: IProductSearchState = {
  currentSearchResultProductIds: [],
  currentSearchText: '',
  featuredProductIds: [],
  loading: true,
  errorMessage: ''
};

export default createReducer<IProductSearchState>(initialState)
  .bindAction(ProductSearchActions.prototype.featuredProductFetchSucceeded, (state, action) => {
    return {
      ...state,
      featuredProductIds: action.payload.map(product => product.id),
      loading: false,
      errorMessage: ''
    };
  })
  .bindAction(ProductSearchActions.prototype.currentSearchTextChanged, (state, action) => {
    return {
      ...state,
      currentSearchText: action.payload,
      loading: true
    };
  })
  .bindAction(ProductSearchActions.prototype.productSearchSucceeded, (state, action) => {
    return {
      ...state,
      currentSearchResultProductIds: action.payload.products.map(product => product.id),
      loading: false,
      errorMessage: ''
    };
  })
  .bindAction(ProductSearchActions.prototype.productSearchFailed, (state, action) => {
    return {
      ...state,
      errorMessage: action.payload,
      loading: false
    };
  });
