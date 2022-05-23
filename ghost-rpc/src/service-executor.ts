import { ServiceFactory, ServicesFactory } from '.';
import { RequestHook, RequestHookResult } from './request-hook';

export type ServiceExecutionResultStatus =
  'serviceNotFound'
  | 'methodNotFound'
  | 'executionFailed'
  | 'notAuthenticated'
  | 'notAuthorized'
  | 'success';

export interface IServiceExecutionResult {
  status: ServiceExecutionResultStatus;
  error?: { message: string, stack: string | null };
  result?: any;
  globalResponseParams?: any;
}

const invokeService = async <ConstructionParams>(
  serviceName: string,
  methodName: string,
  serviceFactory: ServiceFactory<ConstructionParams, any>,
  methodArguments: any[],
  constructionParams?: ConstructionParams
): Promise<IServiceExecutionResult> => {
  const service = serviceFactory(constructionParams as ConstructionParams);

  if (!service) {
    return {
      status: 'serviceNotFound',
      error: { message: `Services factory provided no valid service for ${serviceName}`, stack: null }
    };
  } else {
    const method = service[methodName];
    let result: unknown = null;

    if (!method) {
      return {
        status: 'methodNotFound',
        error: { message: `${serviceName}.${methodName} not found`, stack: null }
      };
    } else if (typeof method !== 'function') {
      return {
        status: 'methodNotFound',
        error: { message: `No valid implementation found for ${serviceName}.${methodName}`, stack: null }
      }
    } else {
      try {
        const methodReturnValue = method.apply(service, methodArguments);

        if ((methodReturnValue as PromiseLike<any>).then) {
          result = await methodReturnValue;
        } else {
          result = methodReturnValue;
        }
      } catch (error) {
        let executionFailedError: { message: string, stack: string };

        if (error instanceof Error) {
          executionFailedError = { message: error.message, stack: error.stack || '' };
        } else {
          executionFailedError = { message: 'An unexpected error occurred', stack: '' }
        }

        return {
          status: 'executionFailed',
          error: executionFailedError,
          globalResponseParams: {}
        }
      }

      return {
        status: 'success',
        result,
        globalResponseParams: {}
      }
    }
  }
};

export default async <ConstructionParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  serviceName: string,
  methodName: string,
  methodArguments: any[],
  globalRequestParams: any,
  requestHooks: Array<RequestHook<any, any>> | null = null
): Promise<IServiceExecutionResult> => {
  const serviceFactory = servicesFactory[serviceName];

  if (!serviceFactory || typeof serviceFactory !== 'function') {
    return {
      status: 'serviceNotFound',
      error: { message: `Services factory provided no instantiator for service type ${serviceName}`, stack: null }
    };
  }

  if (requestHooks) {
    let prevIndex = -1;

    const hookHandler = async (index: number, context: any): Promise<RequestHookResult> => {
      if (index === prevIndex) {
        throw new Error("next() already called.");
      }

      if (index === requestHooks.length) {
        const serviceExecutionResult = await invokeService<ConstructionParams>(
          serviceName,
          methodName,
          serviceFactory,
          methodArguments,
          context
        ) as IServiceExecutionResult;

        return {
          executionResult: serviceExecutionResult
        } as RequestHookResult;
      }

      prevIndex = index;

      const requestHook = requestHooks[index];

      return requestHook(context, async (params) => {
        return await hookHandler(index + 1, params)
      });
    };

    const hookResult = await hookHandler(0, globalRequestParams);

    return hookResult.executionResult;
  }

  return invokeService(
    serviceName,
    methodName,
    serviceFactory,
    methodArguments
  );
};
