import * as React from 'react';
import { Icon } from 'antd/lib/';

import '../../../less/cart/EmptyCart.less';

export default () => (
  <div className="empty-cart">
    <div>
      <div><Icon type="shopping-cart" /></div>
      <div>Gasp!</div>
      <div>This cart is <strong>empty</strong>!</div>
    </div>
  </div>
);
