import { Store } from 'redux';
import { createLocalHandler, createProxy, ServicesProxy } from 'ghost-rpc';
import { getConnection } from '../../database/connections/sql-js-node';

import { IAppActions, getActions } from '../../ui/src/app/actions';
import { IAppState, getStore } from '../../ui/src/app/store';
import { IAppServiceConstructionParams, IAppServices, servicesFactory } from '../../shared/services';
import createGhostRpcHandlerPreRequestHook from '../../shared/create-ghost-rpc-prerequest-hook';
import DatabaseConnectionFactory from '../../database/connections/connection-factory';

export interface ITestWorkflowContext {
  services: ServicesProxy<IAppServices>;
  actions: IAppActions;
  store: Store<IAppState>;
  databaseConnection: DatabaseConnectionFactory;
}

const getTestSetup = () => {
  const databaseConnection = new DatabaseConnectionFactory(getConnection, true);

  const handler = createLocalHandler<IAppServiceConstructionParams, null>(
    servicesFactory
  );

  handler.use(createGhostRpcHandlerPreRequestHook(databaseConnection));

  const services = createProxy<IAppServices>(handler)
  const store = getStore();
  const actions = getActions(store, services);

  return {
    services,
    actions,
    store,
    databaseConnection
  };
};

export default class BaseWorkflow {
  public context: ITestWorkflowContext;

  constructor(context: ITestWorkflowContext | null = null) {
    if (context) {
      this.context = context;
    } else {
      this.context = getTestSetup();
    }
  }

  public startApp() {
    return this.context.actions.appStartup.startApp();
  }
}
