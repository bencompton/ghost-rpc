import { ProxyTransportHandler } from './create-proxy';
import { dateReviver, Reviver } from './json-parse-reviver';
import { ISerializer } from './serializer';
import { IServiceExecutionResult } from './service-executor';

const httpTransportHandler = async <GlobalRequestParams>(
  baseUrl: string,
  serviceName: string,
  methodName: string,
  methodArguments: any[],
  globalRequestParams: GlobalRequestParams,
  serializer: ISerializer = JSON,
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
      globalRequestParams: globalRequestParams
    })
  });

  const responseText = await response.text();

  return serializer.parse(responseText, reviver || dateReviver) as IServiceExecutionResult;
};

export default(
  baseUrl: string,
  serializer?: ISerializer,
  reviver?: Reviver
): ProxyTransportHandler => {
  return (
    serviceName: string,
    methodName: string,
    methodArgs: any[],
    globalRequestParams: any
  ) => {
    return httpTransportHandler(
      baseUrl,
      serviceName,
      methodName,
      methodArgs,
      globalRequestParams,
      serializer,
      reviver
    );
  };
};
