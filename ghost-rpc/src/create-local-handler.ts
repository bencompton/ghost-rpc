import { ServicesFactory } from '.';
import { ProxyTransportHandler } from './create-proxy';
import serviceExecutor, { WrappedPreRequestHook, PreRequestHookResult } from './service-executor';

export type LocalHandlerPreRequestHook<ConstructionParams, GlobalRequestParamsType> =
  (globalRequestParams: GlobalRequestParamsType | null) => PreRequestHookResult<ConstructionParams>;

export default <ConstructionParams, GlobalRequestParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  preRequestHook?: LocalHandlerPreRequestHook<ConstructionParams, GlobalRequestParams>
): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalRequestParams: GlobalRequestParams | null
  ) => {
    let wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null;
    
    if (preRequestHook) {
      wrappedPreRequestHook = (
        globalRequestParams: GlobalRequestParams | null
      ) => {
        return preRequestHook(globalRequestParams);
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
