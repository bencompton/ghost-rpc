import { FastifyPluginCallback, FastifyRequest } from 'fastify';


import { Reviver } from '../../ghost-rpc/src/json-parse-reviver';
import httpRequestHandler from '../../ghost-rpc/src/http-request-handler';
import { ISerializer } from '../../ghost-rpc/src/serializer';

import { ServicesFactory } from '../../ghost-rpc/src';
import { Next, RequestHook, RequestHookResult } from '../../ghost-rpc/src/request-hook';

export type FastifyMiddlewareRequestHookResult =
  RequestHookResult & {
    headers?: Headers;
  };

export type FastifyMiddlewareRequestHook =
  (
    request: FastifyRequest,
    globalRequestParams: any,
    next: Next<any>
  ) => Promise<FastifyMiddlewareRequestHookResult>

export const createFastifyMiddleware = <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  requestHook?: FastifyMiddlewareRequestHook,
  serializer: ISerializer = JSON,
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

        let wrappedRequestHooks: RequestHook<undefined,ConstructionParams>[] = [];

        if (requestHook) {
          wrappedRequestHooks.push(async (globalRequestParams: any | null, next) => {
            let fastifyHookResult = await requestHook(request, globalRequestParams, next);

            if(fastifyHookResult.headers){
              fastifyHookResult.headers.forEach((value: any, key: any) => {
                reply.header(key, value);
              });
            }

            return fastifyHookResult;
          });
        }

        const result = await httpRequestHandler(
          request.body as string,
          serviceName,
          methodName,
          servicesFactory,
          wrappedRequestHooks,
          serializer,
          reviver
        );

        reply.statusCode = result.statusCode;

        if (result.serviceExecutionResult.error) {
          fastify.log.error(result.serviceExecutionResult.error);
        }

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
