import { ServicesFactory } from '.';
import { ProxyTransportHandler } from './create-proxy';
import serviceExecutor, { PreRequestHook, PreRequestHookResult, PreRequestHookCallback } from './service-executor';

export type LocalHandlerPreRequestHook<GlobalRequestParamsType> = 
  (globalRequestParams: GlobalRequestParamsType | null, next: PreRequestHookCallback) => Promise<PreRequestHookResult>;

export default <ConstructionParams, GlobalRequestParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  preRequestHook?: LocalHandlerPreRequestHook<GlobalRequestParams>
): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalRequestParams: GlobalRequestParams | null
  ) => {
    let wrappedPreRequestHook: PreRequestHook | null = null;
    
    if (preRequestHook) {
      wrappedPreRequestHook = (
        globalRequestParams: GlobalRequestParams | null,
        next: PreRequestHookCallback
      ) => {
        return preRequestHook(globalRequestParams, next);
      };
    }

    return serviceExecutor<ConstructionParams>(
      servicesFactory,
      serviceName,
      methodName,
      methodArgs,
      globalRequestParams,
      wrappedPreRequestHook
    );
  };
};
