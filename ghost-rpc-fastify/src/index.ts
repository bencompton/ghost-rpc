import { FastifyPluginCallback, FastifyRequest } from 'fastify';

import { ServicesFactory } from '../../ghost-rpc/src';
import { Reviver } from '../../ghost-rpc/src/json-parse-reviver';
import { PreRequestHookCallback, PreRequestHookResult, WrappedPreRequestHook } from '../../ghost-rpc/src/service-executor';
import httpRequestHandler from '../../ghost-rpc/src/http-request-handler';

export type FastifyMiddlewarePreRequestHookResult = 
  PreRequestHookResult & {
    headers: { [key: string]: string };
  }

export type FastifyMiddlewarePreRequestHook =
  (
    request: FastifyRequest,
    globalRequestParams: any,
    next: PreRequestHookCallback
  ) => Promise<FastifyMiddlewarePreRequestHookResult>

export const createFastifyMiddleware = <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  preRequestHook?: FastifyMiddlewarePreRequestHook,
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

        let wrappedPreRequestHook: WrappedPreRequestHook | null = null;
        
        if (preRequestHook) {
          wrappedPreRequestHook = async (globalRequestParams: any | null, next: PreRequestHookCallback) => {
            let fastifyPreRequestHookResult = await preRequestHook(request, globalRequestParams, next);

            if ((fastifyPreRequestHookResult as FastifyMiddlewarePreRequestHookResult).headers) {
              reply.headers({
                ...reply.headers,
                ...(fastifyPreRequestHookResult as FastifyMiddlewarePreRequestHookResult).headers
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
