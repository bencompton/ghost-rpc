import * as React from 'react';
import { Drawer, Icon } from 'antd/lib/';
import { DrawerProps } from 'antd/lib/drawer';
import MediaQuery from 'react-responsive';

import '../../../less/cart/CartPage.less';

import CartContent, { ICartContentProps } from './CartContent';
import ManagedDrawer from '../../../common-library/ManagedDrawer';

export interface ICartPageProps extends ICartContentProps {
  onReturnToProductSearch(): void;
}

export default (props: ICartPageProps) => (
  <MediaQuery query="(max-width: 767px)">
    {match => (
      <ManagedDrawer
        onClose={props.onReturnToProductSearch}
        className="cart-page"
        width={match ? '100%' : 400}
      >
        <h2><Icon type="shopping-cart" />&nbsp;<span>My Cart</span></h2>
        <CartContent {...props} />
      </ManagedDrawer>
    )}
  </MediaQuery>
);
