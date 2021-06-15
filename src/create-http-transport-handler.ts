import { ProxyTransportHandler } from './create-proxy';
import { dateReviver, Reviver } from './json-parse-reviver';
import { IServiceExecutionResult } from './service-executor';

const httpTransportHandler = async <GlobalParams>(
  baseUrl: string,
  serviceName: string,
  methodName: string,
  methodArguments: any[],
  globalParams: GlobalParams,
  serializer: JSON = JSON,
  reviver?: Reviver
) => {
  const baseUrlWithNoTrailingSlash = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${baseUrlWithNoTrailingSlash}/${serviceName}/${methodName}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: serializer.stringify({
      methodArguments,
      globalParams
    })
  });

  const responseText = await response.text();

  return serializer.parse(responseText, reviver || dateReviver) as IServiceExecutionResult;
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
