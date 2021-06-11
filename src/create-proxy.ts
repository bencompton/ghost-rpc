import { ServicesProxy } from '.';
import { IServiceExecutionResult } from './service-executor';

export type ProxyTransportHandler = (
  serviceName: string,
  methodName: string,
  methodArgs: any[],
  globalParams: any
) => Promise<IServiceExecutionResult>;

export type GlobalParamsRequestHook = () => any;

const getError = (executionResult: IServiceExecutionResult) => {
  let message: string = '';

  if (executionResult.error && executionResult.error.message) {
    message = executionResult.error.message;
  } else {
    message = `Execution resulted in a status of ${executionResult.status}`;
  }

  return new Error(message);
};

const createServiceProxy = (
  transportHandler: ProxyTransportHandler,
  serviceName: string,
  globalParamsRequestHook?: GlobalParamsRequestHook
) => {
  const serviceProxyOptions = {
    get(target: any, methodName: string, reciever: any) {
      return async (...args: any[]) => {
        let globalParams: any = null;

        if (globalParamsRequestHook) {
          globalParams = globalParamsRequestHook();
        }

        const executionResult = await transportHandler(serviceName, methodName, args, globalParams);

        switch (executionResult.status) {
          case 'success':
            return executionResult.result;
          case 'executionFailed':
            throw getError(executionResult);
          case 'methodNotFound':
            throw getError(executionResult);
          case 'serviceNotFound':
            throw getError(executionResult);
        }
      }
    }
  }

  return new Proxy({}, serviceProxyOptions);
};

const serviceProxies: ServicesProxy<any> = {};

export default <AppServices>(
  transportHandler: ProxyTransportHandler,
  globalParamsRequestHook?: GlobalParamsRequestHook
): ServicesProxy<AppServices> => {
  const servicesProxyOptions = {
    get(target: any, serviceName: string, receiver: any) {
      if (!serviceProxies[serviceName]) {
        serviceProxies[serviceName] = createServiceProxy(transportHandler, serviceName, globalParamsRequestHook);
      }

      return serviceProxies[serviceName];
    }
  };

  return new Proxy({}, servicesProxyOptions);
};
