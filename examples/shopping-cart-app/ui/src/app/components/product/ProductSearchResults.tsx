import * as React from 'react';
import { Spin } from 'antd/lib/';

import ProductList from './ProductList';
import ProductSearchError from './ProductSearchError';
import { ISearchResultProduct } from '../../selectors/ProductSearchSelectors';

export interface IProductSearchResultsProps {
  errorMessage: string;
  searchResultsLoading: boolean;
  searchResults: ISearchResultProduct[];

  onAddToCart(productId: number): void;
}

export default (props: IProductSearchResultsProps) => {
  if (props.errorMessage) {
    return <ProductSearchError />;
  } else if (props.searchResultsLoading) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <ProductList
        products={props.searchResults}
        onAddToCart={props.onAddToCart}
      />
    );
  }
};
