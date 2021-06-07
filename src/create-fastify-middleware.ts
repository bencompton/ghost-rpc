import { BaseServices } from './';
import serviceExecutor from './service-executor';

export default <T extends BaseServices>(basePath: string, services: T) => {
  const basePathWithNoTrailingSlash = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return (fastify: { post: any }, options: any, done: () => void) => {
    fastify.post(`${basePathWithNoTrailingSlash}/:serviceName/:methodName`, async (request: any, reply: any) => {
      reply.headers({
        'Content-Type': 'application/json'
      });

      const params = request.params;
      const serviceName: string = params.serviceName;
      const methodName: string = params.methodName;
      const methodArguments: any[] = request.body;

      const serviceExecutionResult = await serviceExecutor(services, serviceName, methodName, methodArguments);

      switch (serviceExecutionResult.status) {
        case 'methodNotFound':
        case 'serviceNotFound':
          reply.statusCode = 404;
          break;
        case 'executionFailed':
          reply.statusCode = 500;
          break;
        case 'success':
          reply.statusCode = 200;
          break;
      }

      reply.send(serviceExecutionResult);
    });
  
    done();
  }  
};
