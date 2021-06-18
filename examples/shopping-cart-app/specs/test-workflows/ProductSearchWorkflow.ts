import BaseWorkflow from './BaseWorkflow';

import * as ProductContainer from '../../ui/src/app/containers/ProductSearchContainer';

export default class ProductSearchWorkflow extends BaseWorkflow {
  public get currentSearchResults() {
    return ProductContainer.mapStateToProps(this.context.store.getState()).searchResults;
  }
}
