import BaseWorkflow, { ITestWorkflowContext } from './BaseWorkflow';
import * as CartContainer from '../../ui/src/app/containers/CartContainer';
import CartWorkflow from './CartWorkflow';

export default class CheckoutWorkflow extends BaseWorkflow {
  private cartWorkflow: CartWorkflow;

  constructor(context?: ITestWorkflowContext) {
    super(context);

    this.cartWorkflow = new CartWorkflow(context);
  }

  public async proceedToCheckout() {
    await this.cartWorkflow.viewCart();
    await CartContainer.mapActionsToProps(this.context.actions).onProceedToCheckout();
  }
}
