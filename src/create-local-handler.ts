import { ServicesFactory } from '.';
import { ProxyTransportHandler } from './create-proxy';
import serviceExecutor, { IServiceExecutionResult, WrappedPreRequestHook } from './service-executor';

export type LocalHandlerPreRequestHook<ConstructionParams, GlobalParamsType> =
  (globalParams: GlobalParamsType | null) => IServiceExecutionResult | ConstructionParams;

export default <ConstructionParams, GlobalParams>(
  servicesFactory: ServicesFactory,
  preRequestHook?: LocalHandlerPreRequestHook<ConstructionParams, GlobalParams>
): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalParams: GlobalParams | null
  ) => {
    let wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null;
    
    if (preRequestHook) {
      wrappedPreRequestHook = (
        globalParams: GlobalParams | null
      ) => {
        return preRequestHook(globalParams);
      };
    }

    return serviceExecutor<ConstructionParams>(
      servicesFactory,
      serviceName,
      methodName,
      methodArgs,
      globalParams,
      wrappedPreRequestHook
    );
  };
};
