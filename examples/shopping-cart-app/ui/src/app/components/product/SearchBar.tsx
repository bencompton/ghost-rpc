import * as React from 'react';
import { Input } from 'antd/lib/';

const { Search } = Input;

import '../../../less/product/SearchBar.less';

export interface ISearchBarProps {
  currentSearchText: string;

  onSearchChanged(searchText: string): void;
}

export default (props: ISearchBarProps) => (
  <Search
    placeholder="Search for products"
    onSearch={value => props.onSearchChanged(value)}
    enterButton
    size="large"
  />
);
