import * as React from 'react';
import { Card, Button } from 'antd/lib/';

const { Meta } = Card;

import { ISearchResultProduct } from '../../selectors/ProductSearchSelectors';

import '../../../less/product/Product.less';

export interface IProductProps {
  product: ISearchResultProduct;

  onAddToCart(productId: number): void;
}

const getAddToCartButton = (props: IProductProps) => {
  if (props.product.isInCart) {
    return (
      <Button
        disabled
        icon="shopping-cart"
      >
        In Cart
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => props.onAddToCart(props.product.id)}
        type="primary"
        icon="shopping-cart"
      >
        Add to Cart
      </Button>
    );
  }
};

export const ProductImage = (props: { name: string, image: string }) => (
  <div
    className="product-image"
    style={{ backgroundImage: `url(./assets/images/products/${props.image})` }}
  />
);

export default (props: IProductProps) => (
  <Card
    className="product"
    cover={<ProductImage name={props.product.name} image={props.product.image} />}
    actions={[getAddToCartButton(props)]}
  >
    <Meta
      title={props.product.name}
      description={props.product.description}
    />
  </Card>
);
