import { FastifyPluginCallback, FastifyRequest } from 'fastify';

import { ServicesFactory } from '../../ghost-rpc/src';
import { Reviver } from '../../ghost-rpc/src/json-parse-reviver';
import { PreRequestHookResult, WrappedPreRequestHook } from '../../ghost-rpc/src/service-executor';
import httpRequestHandler from '../../ghost-rpc/src/http-request-handler';

export type FastifyMiddlewarePreRequestHookResult<ConstructionParams> = 
  PreRequestHookResult<ConstructionParams> & {
    headers: { [key: string]: string };
  }

export type FastifyMiddlewarePreRequestHook<ConstructionParams> =
  (
    request: FastifyRequest,
    globalRequestParams: any
  ) => FastifyMiddlewarePreRequestHookResult<ConstructionParams> | Promise<FastifyMiddlewarePreRequestHookResult<ConstructionParams>>

export const createFastifyMiddleware = <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  preRequestHook?: FastifyMiddlewarePreRequestHook<ConstructionParams>,
  serializer: JSON = JSON,
  reviver?: Reviver
): FastifyPluginCallback => {
  const basePathWithNoTrailingSlash = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return (fastify, options, done) => {
    fastify.route({
      method: 'POST',
      url: `${basePathWithNoTrailingSlash}/:serviceName/:methodName`,
      async handler(request, reply) {
        reply.headers({
          'Content-Type': 'application/json'
        });
  
        const params = request.params as { serviceName: string, methodName: string };
        const serviceName: string = params.serviceName;
        const methodName: string = params.methodName;

        let wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null;
        
        if (preRequestHook) {
          wrappedPreRequestHook = async (globalRequestParams: any | null) => {
            let fastifyPreRequestHookResult = preRequestHook(request, globalRequestParams);

            if ((fastifyPreRequestHookResult as PromiseLike<FastifyMiddlewarePreRequestHookResult<ConstructionParams>>).then) {
              fastifyPreRequestHookResult = await fastifyPreRequestHookResult;
            }

            if ((fastifyPreRequestHookResult as FastifyMiddlewarePreRequestHookResult<any>).headers) {
              reply.headers({
                ...reply.headers,
                ...(fastifyPreRequestHookResult as FastifyMiddlewarePreRequestHookResult<any>).headers
              });
            }

            return fastifyPreRequestHookResult;
          };
        }

        const result = await httpRequestHandler(
          request.body as string,
          serviceName,
          methodName,
          servicesFactory,
          wrappedPreRequestHook,
          serializer,
          reviver
        );

        reply.statusCode = result.statusCode;
        reply.send(result.serviceExecutionResult);
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
