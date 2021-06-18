import { connect } from 'react-redux-retro';

import { IAppState } from '../store';
import { IAppActions } from '../actions';
import ProductPage from '../components/product/ProductPage';
import {
  getCurrentSearchResults,
  getCurrentSearchText,
  searchResultsLoading,
  getSearchErrorMessage
} from '../selectors/ProductSearchSelectors';
import { getCartProductCount } from '../selectors/CartSelectors';

export const mapStateToProps = (state: IAppState) => {
  return {
    searchResults: getCurrentSearchResults(state),
    cartProductCount: getCartProductCount(state),
    currentSearchText: getCurrentSearchText(state),
    searchResultsLoading: searchResultsLoading(state),
    errorMessage: getSearchErrorMessage(state)
  };
};

export const mapActionsToProps = (actions: IAppActions) => {
  return {
    onAddToCart: actions.cart.addToCart,
    onSearchChanged: actions.productSearch.searchForProduct,
    onViewCart: actions.cart.viewCart
  };
};

export default connect(mapStateToProps, mapActionsToProps, ProductPage);
