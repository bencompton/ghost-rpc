import { ServiceFactory, ServicesFactory } from '.';
import { RequestHook, RequestHookResult } from './pre-request-hook';

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
          error: executionFailedError
        }
      }

      return {
        status: 'success',
        result
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
  requestHooks: Array<RequestHook> | null = null
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

    const handler = async (index: number, context: any): Promise<void | any> => {
      if (index === prevIndex) {
        throw new Error("next() already called.");
      }

      if (index === requestHooks.length) return context;

      prevIndex = index;

      const middleware = requestHooks[index];

      if (middleware) {
        await middleware(context,() => handler(index + 1, context));
      }
    };

    try {
      await handler(0, globalRequestParams);
      const serviceExecutionResult = await invokeService<ConstructionParams>(
        serviceName,
        methodName,
        serviceFactory,
        methodArguments,
        globalRequestParams
      ) as IServiceExecutionResult;
  

      return {
        ...serviceExecutionResult,
        globalResponseParams: globalRequestParams
      }
    } catch (error) {
      console.log(error);

      throw error;
    }
  } else {
    return invokeService(
      serviceName,
      methodName,
      serviceFactory,
      methodArguments
    );
  }
};
