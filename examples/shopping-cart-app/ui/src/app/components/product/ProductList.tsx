import * as React from 'react';
import { Row, Col } from 'antd/lib/';

import Product from './Product';
import { ISearchResultProduct } from '../../selectors/ProductSearchSelectors';
import ResponsiveGrid from '../../../common-library/ResponsiveGrid';

export interface IProductListProps {
  products: ISearchResultProduct[];
  onAddToCart(productId: number): void;
}

export default (props: IProductListProps) => (
  <ResponsiveGrid
    columnQueries={{
      '(max-width: 767px)': 1,
      '(min-width: 768px) and (max-width: 991px)': 2,
      '(min-width: 992px) and (max-width: 1199px)': 3,
      '(min-width: 1200px)': 4
    }}
    columnElement={(columns: number) => <Col span={24 / columns} />}
    rowElement={() => <Row gutter={24} />}
  >
    {
      props.products.map((product) => {
        return <Product key={product.id} product={product} onAddToCart={props.onAddToCart} />;
      })
    }
  </ResponsiveGrid>
);
