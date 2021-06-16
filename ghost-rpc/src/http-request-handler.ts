import { ServicesFactory } from './';
import { dateReviver, Reviver } from './json-parse-reviver';
import serviceExecutor, { IServiceExecutionResult, WrappedPreRequestHook } from './service-executor';

export default async <ConstructionParams>(
  body: string,
  serviceName: string,
  methodName: string,
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null,
  serializer: JSON = JSON,
  reviver?: Reviver  
) => {
  const deserializedBody = serializer.parse(body, reviver || dateReviver);
  const methodArguments: any[] = deserializedBody.methodArguments;
  const globalParams: any = deserializedBody.globalParams;
  let serviceExecutionResult: IServiceExecutionResult;

  serviceExecutionResult = await serviceExecutor(
    servicesFactory,
    serviceName,
    methodName,
    methodArguments,
    globalParams,
    wrappedPreRequestHook
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
