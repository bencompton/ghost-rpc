import { GhostRpcServices } from '.';
import { IServiceExecutionResult } from './service-executor';

export type ProxyTransportHandler = (
  serviceName: string,
  methodName: string,
  methodArgs: any[]
) => Promise<IServiceExecutionResult>;

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
  serviceName: string
) => {
  const serviceProxyOptions = {
    get(target: any, methodName: string, reciever: any) {
      return async (...args: any[]) => {
        const executionResult = await transportHandler(serviceName, methodName, args);

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

const serviceProxies: GhostRpcServices<any> = {};

export default <T>(transportHandler: ProxyTransportHandler): GhostRpcServices<T> => {
  const servicesProxyOptions = {
    get(target: any, serviceName: string, receiver: any) {
      if (!serviceProxies[serviceName]) {
        serviceProxies[serviceName] = createServiceProxy(transportHandler, serviceName);
      }

      return serviceProxies[serviceName];
    }
  };

  return new Proxy({}, servicesProxyOptions) as T;
};
