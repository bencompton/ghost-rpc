import React from 'react';
import ReactDOM from 'react-dom';
import { createHttpTransportHandler, createProxy } from '../../../../ghost-rpc/src';

import { IAppServices } from '../../shared/services';

const transportHandler = createHttpTransportHandler('./api/');
const proxy = createProxy<IAppServices>(transportHandler);

ReactDOM.render(
  React.createElement(React.StrictMode, null, React.createElement('div', null, 'Test example')),
  document.getElementById('root')
);
