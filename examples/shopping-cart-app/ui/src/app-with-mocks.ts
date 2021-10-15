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

const handler = createLocalHandler<IAppServiceConstructionParams, null>(
  servicesFactory, 
  async (globalRequestParams, next) => {

  const context: IAppServiceContext = {
    loggedInUserId: 1
  };

  const constructionParams = {
    repositories: mockRepositories,
    context
  };

  const serviceExecutionResult = await next(constructionParams);

  return {
    serviceExecutionResult
  };
});

const ghostRpcServices = createProxy<IAppServices>(handler);
const store = getStore();
const actions = getActions(store, ghostRpcServices);

renderApp(store, actions);

actions.appStartup.startApp();
