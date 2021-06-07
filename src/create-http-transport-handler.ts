import { ProxyTransportHandler } from './create-proxy';
import { IServiceExecutionResult } from './service-executor';

const httpTransportHandler = async (
  baseUrl: string,
  serviceName: string,
  methodName: string,
  methodArgs: any[]
) => {
  const baseUrlWithNoTrailingSlash = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${baseUrlWithNoTrailingSlash}/${serviceName}/${methodName}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(methodArgs)
  });

  return await response.json() as IServiceExecutionResult;
};

export default (baseUrl: string): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[]
  ) => {
    return httpTransportHandler(baseUrl, serviceName, methodName, methodArgs);
  };
};
