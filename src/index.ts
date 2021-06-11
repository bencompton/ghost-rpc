import createProxy from './create-proxy';
import createFastifyMiddleware from './create-fastify-middleware';
import createHttpTransportHandler from './create-http-transport-handler';
import createLocalHandler from './create-local-handler';

export type ServiceProxy<Type> = {
  [Property in keyof Type]: Type[Property] extends (...args: any[]) => Promise<any> ? 
    Type[Property] :
    (
      Type[Property] extends (...args: any[]) => any ? 
        (...args: Parameters<Type[Property]>) => Promise<ReturnType<Type[Property]>> :
        Type[Property]
    );
};

export type ServicesProxy<Type> = { [Property in keyof Type]: ServiceProxy<Type[Property]> };

export type Class = new (...args: any[]) => any;

export type Services = { [serviceName: string]: any }

export type ServiceFactory<ConstructionParams, Service> = (params: ConstructionParams) => Service;

export type ServicesFactory = { 
  [serviceName: string]: ServiceFactory<any, any> 
};

export {
  createProxy,
  createFastifyMiddleware,
  createHttpTransportHandler,
  createLocalHandler
};
