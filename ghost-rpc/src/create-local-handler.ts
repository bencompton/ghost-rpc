import { ServicesFactory } from '.';
import { ProxyTransportHandler } from './create-proxy';
import { RequestHookRegistration, Next, RequestHook, RequestHookResult } from './pre-request-hook';
import serviceExecutor from './service-executor';

export type LocalHandlerRequestHook<GlobalRequestParamsType> =
  (globalRequestParams: GlobalRequestParamsType | null, next: Next) => Promise<RequestHookResult>;

export interface ProxyTransportHandlerWithMiddlewareRegistration extends ProxyTransportHandler, RequestHookRegistration { }

export default <ConstructionParams, GlobalRequestParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>
): ProxyTransportHandlerWithMiddlewareRegistration => {
  const requestHooks: RequestHook[] = [];
  const localHandler: ProxyTransportHandler = (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalRequestParams: GlobalRequestParams | {}
  ) => {

    if (globalRequestParams && globalRequestParams === null) {
      globalRequestParams = {};
    }

    return serviceExecutor<ConstructionParams>(
      servicesFactory,
      serviceName,
      methodName,
      methodArgs,
      globalRequestParams,
      requestHooks
    );
  };

  const localHandlerWithMiddleware = localHandler as ProxyTransportHandlerWithMiddlewareRegistration;

  localHandlerWithMiddleware.use = (requestHook: RequestHook) => {
    requestHooks.push(requestHook);

    return localHandlerWithMiddleware;
  };

  return localHandlerWithMiddleware;
};
