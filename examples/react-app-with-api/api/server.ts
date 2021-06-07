import fastify from 'fastify';
import * as path from 'path';
import { createFastifyMiddleware } from '../../../src';

import { services } from '../shared/services/';

const start = async () => {
  const server = fastify({
    logger: true
  });
  
  const ghostRpcMiddleware = createFastifyMiddleware('/api/', services);
  server.register(ghostRpcMiddleware);

  try {
    await server.listen(8080, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
