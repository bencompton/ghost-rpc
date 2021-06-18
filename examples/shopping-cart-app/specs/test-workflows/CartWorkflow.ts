import BaseWorkflow from './BaseWorkflow';

import * as ProductContainer from '../../ui/src/app/containers/ProductSearchContainer';
import * as CartContainer from'../../ui/src/app/containers/CartContainer';

export default class CartWorkflow extends BaseWorkflow {
  public get cartBadge() {
    return ProductContainer.mapStateToProps(this.context.store.getState()).cartProductCount;
  }

  public async addProductToCart(productId: number) {
    await ProductContainer.mapActionsToProps(this.context.actions).onAddToCart(productId);
  }

  public async viewCart() {
    await ProductContainer.mapActionsToProps(this.context.actions).onViewCart();
  }

  public get cartScreen() {
    return CartContainer.mapStateToProps(this.context.store.getState());
  }
}
