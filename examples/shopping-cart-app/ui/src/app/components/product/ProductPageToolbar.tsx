import * as React from 'react';
import { Layout, Col, Row, Badge, Icon } from 'antd/lib/';

const { Header } = Layout;

import SearchBar, { ISearchBarProps } from './SearchBar';
import Logo from './Logo';

import '../../../less/product/ProductPageToolbar.less';

export interface IProductPageToolbarProps extends ISearchBarProps {
  cartProductCount: number;

  onViewCart(): void;
}

export interface IProductPageToolbarState {
  searchEnabled: boolean;
}

export default class ProductPageToolbar extends React.Component<IProductPageToolbarProps, IProductPageToolbarState> {
  constructor(props: IProductPageToolbarProps, context: any) {
    super(props, context);

    this.state = {
      searchEnabled: false
    };
  }

  public render() {
    return (
      <Header className="product-page-toolbar">
        <Row type="flex" align="middle" justify="space-around">
          <Col xs={this.state.searchEnabled ? 0 : 12} sm={5} md={3} lg={2} xxl={1}><Logo /></Col>
          <Col xs={this.state.searchEnabled ? 2 : 0} sm={0}>
            <Icon type="arrow-left" onClick={this.onBackClicked.bind(this)} style={{ fontSize: 20 }} />
          </Col>
          <Col xs={this.state.searchEnabled ? 22 : 0} sm={15} md={17} lg={18} xxl={19}>
            <SearchBar
              onSearchChanged={this.props.onSearchChanged}
              currentSearchText={this.props.currentSearchText}
            />
          </Col>
          <Col xs={this.state.searchEnabled ? 0 : 4} sm={0}>
            <Icon
              type="search"
              onClick={this.onSearchIconClicked.bind(this)}
              className="button"
            />
          </Col>
          <Col xs={this.state.searchEnabled ? 0 : 1} sm={1}>
            <Badge count={this.props.cartProductCount}>
              <Icon type="shopping-cart" onClick={this.props.onViewCart} className="button" />
            </Badge>
          </Col>
        </Row>
      </Header>
    );
  }

  private onSearchIconClicked() {
    this.setState({
      searchEnabled: true
    });
  }

  private onBackClicked() {
    this.setState({
      searchEnabled: false
    });
  }
}
