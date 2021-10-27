import { createLocalHandler, createProxy } from 'ghost-rpc';

import {
  IAppServiceConstructionParams,
  IAppServices,
  servicesFactory
} from '../../shared/services';
import { getConnection } from './common-library/database/browser-sql-js';

import { renderApp } from './app/components/App';
import { getActions } from './app/actions';
import { getStore } from './app/store';
import createGhostRpcHandlerPreRequestHook from '../../shared/create-ghost-rpc-prerequest-hook';
import DatabaseConnectionFactory from '../../database/connections/connection-factory';

const init = async () => {
  const databaseConnection = new DatabaseConnectionFactory(getConnection, true);

  // This is for conveniently accessing the DB from the browser dev tools
  // (e.g., db.query('select * from product'))
  (window as any).db = await databaseConnection.getConnection();

  const handler = createLocalHandler<IAppServiceConstructionParams, null>(
    servicesFactory, 
    createGhostRpcHandlerPreRequestHook(databaseConnection)
  );
  
  const ghostRpcServices = createProxy<IAppServices>(handler);
  const store = getStore();
  const actions = getActions(store, ghostRpcServices);
  
  renderApp(store, actions);
  
  actions.appStartup.startApp();  
};

init();
