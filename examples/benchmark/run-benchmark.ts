import autocannon from 'autocannon';

import { startServer } from './server';

const ghostRpcSetup = {
  url: 'http://localhost:8080',
  requests: [{
    method: 'POST',
    path: '/api/productSearchService/getFeaturedProducts',
    body: '{"methodArguments":[],"globalRequestParams":null}',
    headers: {}
  }]
};

const fastifySetup = {
  url: 'http://localhost:8080/featured-products',
};

const runBenchmark = async (
  ghostRpcOrFastify: string,
  config: any,
  connections: number
) => {
  const title = `${ghostRpcOrFastify} - ${connections} connections`;
  console.log(`\nRunning benchmark for "${title}"\n`);

  return new Promise((resolve, reject) => {
    const instance = autocannon({
      title,
      connections,
      duration: 60,
      ...config
    }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }

      console.log(`\nBenchmark "${title}" complete\n`, err, res)
    });

    autocannon.track(instance);
  });
};

const start = async () => {
  await startServer();

  await runBenchmark('Ghost RPC', ghostRpcSetup, 10);
  await runBenchmark('Fastify', fastifySetup, 10);
  await runBenchmark('Ghost RPC', ghostRpcSetup, 100);
  await runBenchmark('Fastify', fastifySetup, 100);
  await runBenchmark('Ghost RPC', ghostRpcSetup, 1000);
  await runBenchmark('Fastify', fastifySetup, 1000);
  await runBenchmark('Ghost RPC', ghostRpcSetup, 2000);
  await runBenchmark('Fastify', fastifySetup, 2000);
  await runBenchmark('Ghost RPC', ghostRpcSetup, 4000);
  await runBenchmark('Fastify', fastifySetup, 4000);
  
  process.exit(0);
};

start();