import createProxy from './create-proxy';
import createHttpTransportHandler from './create-http-transport-handler';
import createLocalHandler from './create-local-handler';
import type { IServiceExecutionResult } from './service-executor';
import { RpcProxyError } from './rpc-proxy-error';
import { RequestHook, RequestHookResult } from './request-hook';

export type ServiceProxy<Type> = {
  [Property in keyof Type]: Type[Property] extends (...args: any[]) => Promise<any> ? 
    Type[Property] :
    (
      Type[Property] extends (...args: any[]) => any ? 
        (...args: Parameters<Type[Property]>) => Promise<ReturnType<Type[Property]>> :
        Type[Property]
    );
};

export type onBeforeServiceCallCallback =  (serviceName: string, methodName: string, methodArguments: any[]) => void | Promise<void>;
export type onAfterServiceCallCallback = (result: IServiceExecutionResult) => void | Promise<void>;

export type ServicesProxy<Type> = {
  [Property in keyof Type]: ServiceProxy<Type[Property]> 
} & {
  onBeforeServiceCall(callback: onBeforeServiceCallCallback): void;
  onServiceCallCompleted(callback: onAfterServiceCallCallback): void;
}

export type Class = new (...args: any[]) => any;

export type Services = { [serviceName: string]: any };

export type ServiceFactory<ConstructionParams, Service> = (params: ConstructionParams) => Service;

export type ServicesFactory<T, ConstructionParams> = { 
  [ServiceName in keyof T]: ServiceFactory<ConstructionParams, T[ServiceName]> 
};

export {
  createProxy,
  createHttpTransportHandler,
  createLocalHandler,
  IServiceExecutionResult,
  RpcProxyError,
  RequestHook,
  RequestHookResult as RequestHookResult
};
