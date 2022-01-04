import { ServicesFactory, RequestHook } from '.';
import { dateReviver, Reviver } from './json-parse-reviver';
import { ISerializer } from './serializer';
import serviceExecutor, { IServiceExecutionResult } from './service-executor';

export default async <ConstructionParams>(
  body: string,
  serviceName: string,
  methodName: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  wrappedRequestHooks: RequestHook[] | null = null,
  serializer: ISerializer = JSON,
  reviver?: Reviver  
) => {
  const deserializedBody = serializer.parse<any>(body, reviver || dateReviver);
  const methodArguments: any[] = deserializedBody.methodArguments;
  const globalRequestParams: any = deserializedBody.globalRequestParams;
  let serviceExecutionResult: IServiceExecutionResult;

  serviceExecutionResult = await serviceExecutor(
    servicesFactory,
    serviceName,
    methodName,
    methodArguments,
    globalRequestParams,
    wrappedRequestHooks
  );

  let statusCode: number;

  switch (serviceExecutionResult.status) {
    case 'success':
      statusCode = 200;
      break;
    case 'notAuthenticated':
      statusCode = 401;
      break;
    case 'notAuthorized':
      statusCode = 403;
      break;                    
    case 'methodNotFound':
    case 'serviceNotFound':
      statusCode = 404;
      break;
    default:
      statusCode = 500;
      break;
  }

  return {
    serviceExecutionResult,
    statusCode
  };
};
