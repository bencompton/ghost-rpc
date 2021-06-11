import { ServicesFactory } from './';
import serviceExecutor, { IServiceExecutionResult, WrappedPreRequestHook } from './service-executor';

export type FastifyMiddlewarePreRequestHook<ConstructionParams> =
  (request: any, globalParams: any) => IServiceExecutionResult | ConstructionParams;

export default <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory,
  preRequestHook?: FastifyMiddlewarePreRequestHook<ConstructionParams>
) => {
  const basePathWithNoTrailingSlash = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return (fastify: { post: any }, options: any, done: () => void) => {
    fastify.post(`${basePathWithNoTrailingSlash}/:serviceName/:methodName`, async (request: any, reply: any) => {
      reply.headers({
        'Content-Type': 'application/json'
      });

      const params = request.params;
      const serviceName: string = params.serviceName;
      const methodName: string = params.methodName;
      const methodArguments: any[] = request.body.arguments;
      const globalParams: any = request.body.globalParams;
      let serviceExecutionResult: IServiceExecutionResult;

      let wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null;
      
      if (preRequestHook) {
        wrappedPreRequestHook = (globalParams: any | null) => {
          return preRequestHook(request, globalParams);
        };
      }

      serviceExecutionResult = await serviceExecutor(
        servicesFactory,
        serviceName,
        methodName,
        methodArguments,
        globalParams,
        wrappedPreRequestHook
      );

      switch (serviceExecutionResult.status) {
        case 'success':
          reply.statusCode = 200;
          break;
        case 'notAuthenticated':
          reply.statusCode = 401;
          break;
        case 'notAuthorized':
          reply.statusCode = 403;
          break;                    
        case 'methodNotFound':
        case 'serviceNotFound':
          reply.statusCode = 404;
          break;
        default:
          reply.statusCode = 500;
          break;
      }

      reply.send(serviceExecutionResult);
    });
  
    done();
  }  
};
