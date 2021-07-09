import { createLocalHandler, createProxy } from 'ghost-rpc';

import {
  IAppServiceConstructionParams,
  IAppServiceContext,
  IAppServices,
  servicesFactory
} from '../../shared/services';

import { renderApp } from './app/components/App';
import { getActions } from './app/actions';
import { getStore } from './app/store';
import { mockRepositories } from '../../shared/mock-repositories';

const handler = createLocalHandler<IAppServiceConstructionParams, null>(servicesFactory, () => {
  const context: IAppServiceContext = {
    loggedInUserId: 1
  };

  return {
    constructionParams: {
      repositories: mockRepositories,
      context
    }
  };
});

const ghostRpcServices = createProxy<IAppServices>(handler);
const store = getStore();
const actions = getActions(store, ghostRpcServices);

renderApp(store, actions);

actions.appStartup.startApp();
