import { createProxy, createHttpTransportHandler } from 'ghost-rpc';

import { IAppServices } from '../../shared/services';

import { renderApp } from './app/components/App';
import { getActions } from './app/actions';
import { getStore } from './app/store';

const init = async () => {
  const handler = createHttpTransportHandler('/api/');  
  const ghostRpcServices = createProxy<IAppServices>(handler);
  const store = getStore();
  const actions = getActions(store, ghostRpcServices);
  
  renderApp(store, actions);
  
  actions.appStartup.startApp();  
};

init();
