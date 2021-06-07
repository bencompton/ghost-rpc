import { BaseServices } from '.';
import { ProxyTransportHandler } from './create-proxy';
import serviceExecutor from './service-executor';

export default (services: BaseServices): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[]
  ) => {
    return serviceExecutor(services, serviceName, methodName, methodArgs);
  };
};
