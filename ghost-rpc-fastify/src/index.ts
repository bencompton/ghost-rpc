import { FastifyPluginCallback, FastifyRequest } from 'fastify';


import { Reviver } from '../../ghost-rpc/src/json-parse-reviver';
import httpRequestHandler from '../../ghost-rpc/src/http-request-handler';
import { ISerializer } from '../../ghost-rpc/src/serializer';
import { PreRequestHook, PreRequestHookResult } from '../../ghost-rpc/src/pre-request-hook';
import { ServicesFactory } from '../../ghost-rpc/src';

export type FastifyMiddlewarePreRequestHookResult =
  PreRequestHookResult & {
    headers?: Headers;
  };

export type FastifyMiddlewarePreRequestHook =
  (
    request: FastifyRequest,
    globalRequestParams: any
  ) => Promise<FastifyMiddlewarePreRequestHookResult>

export const createFastifyMiddleware = <ConstructionParams>(
  basePath: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  preRequestHook?: FastifyMiddlewarePreRequestHook,
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

        let wrappedPreRequestHooks: PreRequestHook[] = [];

        if (preRequestHook) {
          wrappedPreRequestHooks.push(async (globalRequestParams: any | null) => {
            // let fastifyPreRequestHookResult = await preRequestHook(request, globalRequestParams);
            const requestHeaders = request.headers;
            // if (request.headers) {
            //   (request.headers).forEach((value, key) => {
            //     reply.header(key, value);
            //   });
            // }
            let returnHeaders = Object.keys(request.headers);

            returnHeaders.forEach((key) => {
              reply.header(key, request.headers[key]);
            });

            return {
              context: globalRequestParams.context,
              repositories: globalRequestParams.repositories,
              headers: returnHeaders
            };
          });
        }

        const result = await httpRequestHandler(
          request.body as string,
          serviceName,
          methodName,
          servicesFactory,
          wrappedPreRequestHooks,
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
