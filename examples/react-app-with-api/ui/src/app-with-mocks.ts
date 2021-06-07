import React from 'react';
import ReactDOM from 'react-dom';
import { createProxy, createLocalHandler } from '../../../../src';

import { IAppServices, services } from '../../shared/services';

const handler = createLocalHandler(services);
const ghostRpcServices = createProxy<IAppServices>(handler);

const result = await ghostRpcServices.todo.addTodo('test');

console.log(result);

ReactDOM.render(
  React.createElement(React.StrictMode, null, React.createElement('div', null, 'Test example')),
  document.getElementById('root')
);
