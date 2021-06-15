import { onAfterServiceCallCallback, onBeforeServiceCallCallback, ServicesProxy } from '.';
import { RpcProxyError } from './rpc-proxy-error';
import { IServiceExecutionResult } from './service-executor';

export type ProxyTransportHandler = (
  serviceName: string,
  methodName: string,
  methodArgs: any[],
  globalParams: any
) => Promise<IServiceExecutionResult>;

export type GlobalParamsRequestHook<GlobalParams> = () => GlobalParams | Promise<GlobalParams>;

const createServiceProxy = (
  transportHandler: ProxyTransportHandler,
  serviceName: string,
  onBeforeServiceCallCallbacks: onBeforeServiceCallCallback[],
  onAfterServiceCallCallbacks: onAfterServiceCallCallback[],
  globalParamsRequestHook?: GlobalParamsRequestHook<any>
) => {
  const serviceProxyOptions = {
    get(target: any, methodName: string, reciever: any) {
      return async (...args: any[]) => {
        let globalParams: any = null;

        if (globalParamsRequestHook) {
          const globalParamsRequestHookResult = globalParamsRequestHook();

          if ((globalParamsRequestHookResult as PromiseLike<any>).then) {
            globalParams = await globalParamsRequestHookResult;
          } else {
            globalParams = globalParamsRequestHookResult;
          }          
        }

        onBeforeServiceCallCallbacks.forEach(callback => callback(serviceName, methodName, args));

        const executionResult = await transportHandler(serviceName, methodName, args, globalParams);

        onAfterServiceCallCallbacks.forEach(callback => callback(executionResult));

        if (executionResult.status === 'success') {
          return executionResult.result;
        } else {
          throw new RpcProxyError(executionResult);
        }
      }
    }
  }

  return new Proxy({}, serviceProxyOptions);
};

export default <AppServices>(
  transportHandler: ProxyTransportHandler,
  globalParamsRequestHook?: GlobalParamsRequestHook<any>
): ServicesProxy<AppServices> => {
  const onBeforeServiceCallCallbacks: onBeforeServiceCallCallback[] = [];
  const onAfterServiceCallCallbacks: onAfterServiceCallCallback[] = [];

  const serviceProxies: ServicesProxy<any> = {
    onBeforeServiceCall(callback) {
      onBeforeServiceCallCallbacks.push(callback);
    },
  
    onServiceCallCompleted(callback) {
      onAfterServiceCallCallbacks.push(callback);
    }
  };

  const servicesProxyOptions = {
    get(target: any, serviceName: string, receiver: any) {
      if (!serviceProxies[serviceName]) {
        serviceProxies[serviceName] = createServiceProxy(
          transportHandler,
          serviceName,
          onBeforeServiceCallCallbacks,
          onAfterServiceCallCallbacks,
          globalParamsRequestHook
        );
      }

      return serviceProxies[serviceName];
    }
  };

  return new Proxy({}, servicesProxyOptions);
};
