import * as React from 'react';

import ProductSearchContainer from './containers/ProductSearchContainer';
import CartContainer from './containers/CartContainer';

export default [{
  path: '/',
  action: () => <ProductSearchContainer />
}, {
  path: '/cart/',
  action: () => <ProductSearchContainer><CartContainer /></ProductSearchContainer>
}];
