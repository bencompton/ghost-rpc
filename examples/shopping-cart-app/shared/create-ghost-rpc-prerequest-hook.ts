import { PreRequestHook } from 'ghost-rpc';

import { getRepositories } from './repositories';
import { IAppServiceContext } from './services';
import SqlJsConnectionManager from '../database/connections/connection-factory';

export default (connectionManager: SqlJsConnectionManager): PreRequestHook => {
  return async (globalRequestParams, next) => {
    const context: IAppServiceContext = {
      loggedInUserId: 1
    };

    const connection = await connectionManager.getConnection();
    const repositories = getRepositories(connection);
  
    const constructionParams = {
      repositories,
      context
    };
  
    const serviceExecutionResult = await next(constructionParams);
  
    return {
      serviceExecutionResult
    };
  }
};
