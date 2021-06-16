import fastify from 'fastify';
import { createFastifyMiddleware } from '../../../ghost-rpc-fastify/src/';

import { servicesFactory } from '../shared/services/';

const start = async () => {
  const server = fastify({
    logger: true
  });
  
  const ghostRpcMiddleware = createFastifyMiddleware('/api/', servicesFactory);

  server.register(ghostRpcMiddleware);

  try {
    await server.listen(8080, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
