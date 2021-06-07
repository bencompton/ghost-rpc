import React from 'react';
import ReactDOM from 'react-dom';
import { createHttpTransportHandler, createProxy } from '../../../../src';

import { IAppServices } from '../../shared/services';

const transportHandler = createHttpTransportHandler('./api/');
const ghostRpcServices = createProxy<IAppServices>(transportHandler);

const result = await ghostRpcServices.todo.addTodo('test');

console.log(result);

ReactDOM.render(
  React.createElement(React.StrictMode, null, React.createElement('div', null, 'Test example')),
  document.getElementById('root')
);
