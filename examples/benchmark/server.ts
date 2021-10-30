import fastify, { FastifyInstance } from 'fastify';
import { createFastifyMiddleware } from 'ghost-rpc-fastify';

import { getConnection } from '../shopping-cart-app/database/connections/sql-js-node';
import { addAllMockData } from '../shopping-cart-app/database/mock-data/data-management';
import ProductSearchRepository from '../shopping-cart-app/shared/repositories/product-search-repository';
import ProductSearchService from '../shopping-cart-app/shared/services/product-search-service';

import { servicesFactory } from '../shopping-cart-app/shared/services';
import createGhostRpcHandlerPreRequestHook from '../shopping-cart-app/shared/create-ghost-rpc-prerequest-hook';
import DatabaseConnectionFactory from '../shopping-cart-app/database/connections/connection-factory';

const setupFastifyRestEndpoint = async (server: FastifyInstance) => {
  const connection = await getConnection();

  addAllMockData(connection);

  server.get('/featured-products', async () => {
    const productSearchRepository = new ProductSearchRepository(connection);
    const productSearchService = new ProductSearchService(productSearchRepository);

    return await productSearchService.getFeaturedProducts();
  });
};

const setupGhostRpcEndpoint = async (server: FastifyInstance) => {
  const databaseConnection = new DatabaseConnectionFactory(getConnection, true);  
  const preRequestHook = createGhostRpcHandlerPreRequestHook(databaseConnection);
  
  const ghostRpcMiddleware = createFastifyMiddleware(
    '/api/',
    servicesFactory,
    (request, globalRequestParams, next) => preRequestHook(globalRequestParams, next)
  );

  server.register(ghostRpcMiddleware);  
};

export const startServer = async () => {
  const server = fastify();

  await setupFastifyRestEndpoint(server);
  await setupGhostRpcEndpoint(server);

  try {
    await server.listen('8080', '0.0.0.0');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};