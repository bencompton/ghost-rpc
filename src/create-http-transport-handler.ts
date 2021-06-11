import { ProxyTransportHandler } from './create-proxy';
import { IServiceExecutionResult } from './service-executor';

const httpTransportHandler = async <GlobalParams>(
  baseUrl: string,
  serviceName: string,
  methodName: string,
  methodArgs: any[],
  globalParams: GlobalParams
) => {
  const baseUrlWithNoTrailingSlash = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${baseUrlWithNoTrailingSlash}/${serviceName}/${methodName}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      args: methodArgs,
      globalParams
    })
  });

  return await response.json() as IServiceExecutionResult;
};

export default(baseUrl: string): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalParams: any
  ) => {
    return httpTransportHandler(baseUrl, serviceName, methodName, methodArgs, globalParams);
  };
};
