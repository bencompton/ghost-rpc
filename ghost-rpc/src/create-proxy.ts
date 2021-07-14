import { onAfterServiceCallCallback, onBeforeServiceCallCallback, ServicesProxy } from '.';
import { RpcProxyError } from './rpc-proxy-error';
import { IServiceExecutionResult } from './service-executor';

export type ProxyTransportHandler = (
  serviceName: string,
  methodName: string,
  methodArgs: any[],
  globalRequestParams: any
) => Promise<IServiceExecutionResult>;

export type GlobalRequestParamsRequestHook<GlobalRequestParams> = () => GlobalRequestParams | Promise<GlobalRequestParams>;

const createServiceProxy = (
  transportHandler: ProxyTransportHandler,
  serviceName: string,
  onBeforeServiceCallCallbacks: onBeforeServiceCallCallback[],
  onAfterServiceCallCallbacks: onAfterServiceCallCallback[],
  globalParamsRequestHook?: GlobalRequestParamsRequestHook<any>
) => {
  const serviceProxyOptions = {
    get(target: any, methodName: string, reciever: any) {
      return async (...args: any[]) => {
        let globalRequestParams: any = null;

        if (globalParamsRequestHook) {
          const globalParamsRequestHookResult = globalParamsRequestHook();

          if ((globalParamsRequestHookResult as PromiseLike<any>).then) {
            globalRequestParams = await globalParamsRequestHookResult;
          } else {
            globalRequestParams = globalParamsRequestHookResult;
          }          
        }

        const beforeServiceCallbackResults = onBeforeServiceCallCallbacks
          .map(callback => callback(serviceName, methodName, args));

        const beforeServiceCallbackPromises = beforeServiceCallbackResults
          .filter((result) => result && (result as PromiseLike<any>).then !== undefined);

        if (beforeServiceCallbackPromises.length) {
          await Promise.all(beforeServiceCallbackPromises);
        }

        const executionResult = await transportHandler(serviceName, methodName, args, globalRequestParams);

        const afterServiceCallbackResults = onAfterServiceCallCallbacks
          .map(callback => callback(executionResult));

        const afterServiceCallbackPromises = afterServiceCallbackResults
          .filter((result) => result && (result as PromiseLike<any>).then !== undefined);

        if (afterServiceCallbackPromises.length) {
          await Promise.all(afterServiceCallbackPromises);
        }

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
  globalParamsRequestHook?: GlobalRequestParamsRequestHook<any>
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
