import { RequestHook } from 'ghost-rpc';

import { getRepositories } from './repositories';
import { IAppServiceContext } from './services';
import SqlJsConnectionManager from '../database/connections/connection-factory';

export default (connectionManager: SqlJsConnectionManager): RequestHook<any, any> => {
  return async (globalRequestParams: any, next) => {
    const context: IAppServiceContext = {
      loggedInUserId: 1
    };

    const connection = await connectionManager.getConnection();
    const repositories = getRepositories(connection);

    globalRequestParams = globalRequestParams || {};
    globalRequestParams.context = context;
    globalRequestParams.connection = connection;
    globalRequestParams.repositories = repositories;

    return await next(globalRequestParams);
  }
};
