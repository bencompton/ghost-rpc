import { ServicesFactory } from '.';
import { ProxyTransportHandler } from './create-proxy';
import { MiddlewareRegistration, Next, PreRequestHook, PreRequestHookCallback, PreRequestHookResult } from './pre-request-hook';
import serviceExecutor from './service-executor';

export type LocalHandlerPreRequestHook<GlobalRequestParamsType> =
  (globalRequestParams: GlobalRequestParamsType | null, next: Next) => Promise<PreRequestHookResult>;

export interface ProxyTransportHandlerWithMiddlewareRegistration extends ProxyTransportHandler, MiddlewareRegistration { }

export default <ConstructionParams, GlobalRequestParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>
): ProxyTransportHandlerWithMiddlewareRegistration => {
  const preRequestHooks: PreRequestHook[] = [];
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
      preRequestHooks
    );
  };

  const localHandlerWithMiddleware = localHandler as ProxyTransportHandlerWithMiddlewareRegistration;

  localHandlerWithMiddleware.use = (preRequestHook: PreRequestHook) => {
    preRequestHooks.push(preRequestHook);

    return localHandlerWithMiddleware;
  };

  return localHandlerWithMiddleware;
};
