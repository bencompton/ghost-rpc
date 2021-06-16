import { ServicesFactory } from './';
import { dateReviver, Reviver } from './json-parse-reviver';
import serviceExecutor, { IServiceExecutionResult, PreRequestHookResult, WrappedPreRequestHook } from './service-executor';

export type FastifyMiddlewarePreRequestHook<ConstructionParams> =
  (request: any, globalParams: any) => PreRequestHookResult<ConstructionParams>;

export default <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory,
  preRequestHook?: FastifyMiddlewarePreRequestHook<ConstructionParams>,
  serializer: JSON = JSON,
  reviver?: Reviver
) => {
  const basePathWithNoTrailingSlash = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return (fastify: { route: any }, options: any, done: () => void) => {
    fastify.route({
      method: 'POST',
      url: `${basePathWithNoTrailingSlash}/:serviceName/:methodName`,
      async handler(request: any, reply: any) {
        reply.headers({
          'Content-Type': 'application/json'
        });
  
        const params = request.params;
        const serviceName: string = params.serviceName;
        const methodName: string = params.methodName;
        const deserializedBody = serializer.parse(request.body, reviver || dateReviver);
        const methodArguments: any[] = deserializedBody.methodArguments;
        const globalParams: any = deserializedBody.globalParams;
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
      },
      onRequest(request: any, reply: any, done: any) {
        // Change content type to plain text so the body won't be parsed before the request is processed
        request.headers['content-type'] = 'text/plain';
        done();
      }
    });

    done();
  };
};
