import fastify from 'fastify';
import { createFastifyMiddleware } from 'ghost-rpc-fastify';

import { servicesFactory } from '../../shared/services';
import { getConnection } from '../../database/connections/sql-js-node';
import createGhostRpcHandlerPreRequestHook from '../../shared/create-ghost-rpc-prerequest-hook';
import DatabaseConnectionFactory from '../../database/connections/connection-factory';

const start = async () => {
  const server = fastify({
    logger: true
  });

  const databaseConnection = new DatabaseConnectionFactory(getConnection, true);  
  const preRequestHook = createGhostRpcHandlerPreRequestHook(databaseConnection);
  
  const ghostRpcMiddleware = createFastifyMiddleware(
    '/api/',
    servicesFactory,
    (request, globalRequestParams, next) => preRequestHook(globalRequestParams, next)
  );

  server.register(ghostRpcMiddleware);

  try {
    await server.listen(8080, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
