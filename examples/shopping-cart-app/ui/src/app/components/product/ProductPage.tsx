import * as React from 'react';
import { Layout } from 'antd/lib/';

const { Content } = Layout;

import ProductPageToolbar, { IProductPageToolbarProps } from './ProductPageToolbar';
import ProductSearchResults, { IProductSearchResultsProps } from './ProductSearchResults';

import '../../../less/product/ProductPage.less';

export interface IProductPageProps
  extends IProductPageToolbarProps, IProductSearchResultsProps, React.Props<any> { }

export default (props: IProductPageProps) => (
  <Layout className="product-page">
    <ProductPageToolbar
      cartProductCount={props.cartProductCount}
      currentSearchText={props.currentSearchText}
      onSearchChanged={props.onSearchChanged}
      onViewCart={props.onViewCart}
    />
      <Content>
        <ProductSearchResults
          searchResults={props.searchResults}
          searchResultsLoading={props.searchResultsLoading}
          errorMessage={props.errorMessage}
          onAddToCart={props.onAddToCart}
        />
      </Content>
      {props.children}
  </Layout>
);
