import { Store } from 'redux';
import { createLocalHandler, createProxy, ServicesProxy } from 'ghost-rpc';

import { IAppActions, getActions } from '../../ui/src/app/actions';
import { IAppState, getStore } from '../../ui/src/app/store';
import { IAppServiceConstructionParams, IAppServiceContext, IAppServices, servicesFactory } from '../../shared/services';
import { mockRepositories } from '../../shared/mock-repositories';

export interface ITestWorkflowContext {
  services: ServicesProxy<IAppServices>;
  actions: IAppActions;
  store: Store<IAppState>;
}

const getTestSetup = () => {
  const handler = createLocalHandler<IAppServiceConstructionParams, null>(servicesFactory, () => {
    const context: IAppServiceContext = {
      loggedInUserId: 1
    };
  
    return {
      repositories: mockRepositories,
      context
    };
  });

  const services = createProxy<IAppServices>(handler)
  const store = getStore();
  const actions = getActions(store, services);

  return {
    services,
    actions,
    store
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
