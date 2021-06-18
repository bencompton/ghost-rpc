import * as React from 'react';
import { Button } from 'antd/lib/';

import CartProductList, { ICartProductListProps } from './CartProductList';
import EmptyCart from './EmptyCart';

export interface ICartContentProps extends ICartProductListProps {
  onProceedToCheckout(): void;
}

export default (props: ICartContentProps) => {
  if (props.productsInCart.length > 0) {
    return (
      <>
        <CartProductList productsInCart={props.productsInCart} />
        <Button
          className="proceed-to-checkout"
          type="primary"
          size="large"
          onClick={props.onProceedToCheckout}
        >
          Proceed to Checkout
        </Button>
      </>
    );
  } else {
    return <EmptyCart />;
  }
};
