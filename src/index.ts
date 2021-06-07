import createProxy from './create-proxy';
import createFastifyMiddleware from './create-fastify-middleware';
import createHttpTransportHandler from './create-http-transport-handler';
import createLocalHandler from './create-local-handler';

export type GhostRpcService<Type> = {
  [Property in keyof Type]: Type[Property] extends (...args: any[]) => Promise<any> ? 
    Type[Property] :
    (
      Type[Property] extends (...args: any[]) => any ? 
        (...args: Parameters<Type[Property]>) => Promise<ReturnType<Type[Property]>> :
        Type[Property]
    );
};

export type GhostRpcServices<Type> = { [Property in keyof Type]: GhostRpcService<Type[Property]> };

export type BaseServices = { [serviceName: string]: any };

export {
  createProxy,
  createFastifyMiddleware,
  createHttpTransportHandler,
  createLocalHandler
};
