import * as React from 'react';
import { List, Avatar } from 'antd/lib/';

import { ICartProduct } from '../../../../../shared/repositories/cart-repository';

export interface ICartProductListProps {
  productsInCart: ICartProduct[];
}

export default (props: ICartProductListProps) => (
  <List
    itemLayout="horizontal"
    dataSource={props.productsInCart}
    locale={{ emptyText: 'Nothing in your cart :(' }}
    renderItem={(item: ICartProduct) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`./assets/images/products/${item.image}`} />}
          title={<a href="https://ant.design">{item.name}</a>}
          description={item.description}
        />
        <div>${item.price}</div>
      </List.Item>
    )}
  />
);
