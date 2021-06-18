import * as React from 'react';
import { Spin, Icon } from 'antd/lib/';

import '../../../less/LoadingSpinner.less';

export interface ILoadingSpinnerContainer {
  isLoading: boolean;
}

export default (props: ILoadingSpinnerContainer) => {
  if (props.isLoading) {
    return (
      <div className="loading-spinner">
        <Spin size="large" indicator={<Icon type="loading" style={{ fontSize: 35 }} />} />
      </div>
    );
  } else {
    return null;
  }
};
