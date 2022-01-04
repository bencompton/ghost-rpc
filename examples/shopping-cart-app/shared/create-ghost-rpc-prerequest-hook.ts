import { RequestHook } from 'ghost-rpc';

import { getRepositories } from './repositories';
import { IAppServiceContext } from './services';
import SqlJsConnectionManager from '../database/connections/connection-factory';
import { Next } from 'ghost-rpc/dist/es5/src/pre-request-hook';

export default (connectionManager: SqlJsConnectionManager): RequestHook => {
  return async (globalRequestParams: any, next: Next) => {
    const context: IAppServiceContext = {
      loggedInUserId: 1
    };

    const connection = await connectionManager.getConnection();
    const repositories = getRepositories(connection);

    globalRequestParams = globalRequestParams || {};
    globalRequestParams.context = context;
    globalRequestParams.connection = connection;
    globalRequestParams.repositories = repositories;

    next(globalRequestParams);
  }
};
