import { ServiceFactory, ServicesFactory } from '.';

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

export type PreRequestHookResult = {
  serviceExecutionResult: IServiceExecutionResult;
  globalResponseParams?: any;
}

export type PreRequestHookCallback = (constructionParams: any) => Promise<IServiceExecutionResult>;

export type WrappedPreRequestHook =
  (globalRequestParams: any, next: PreRequestHookCallback) => PreRequestHookResult | Promise<PreRequestHookResult>;

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
        return {
          status: 'executionFailed',
          error: { message: error.message, stack: error.stack }
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
  wrappedPreRequestHook: WrappedPreRequestHook | null = null
): Promise<IServiceExecutionResult> => {
  let preRequestHookResult: PreRequestHookResult 
    | Promise<PreRequestHookResult> 
    | undefined = undefined;

  const serviceFactory = servicesFactory[serviceName];  

  if (!serviceFactory || typeof serviceFactory !== 'function') {
    return {
      status: 'serviceNotFound',
      error: { message: `Services factory provided no instantiator for service type ${serviceName}`, stack: null }
    };
  }    

  if (wrappedPreRequestHook) {
    preRequestHookResult = wrappedPreRequestHook(globalRequestParams, (constructionParams) => {
      return invokeService<ConstructionParams>(
        serviceName,
        methodName,
        serviceFactory,
        methodArguments,
        constructionParams
      );
    });

    if ((preRequestHookResult as PromiseLike<any>).then) {
      preRequestHookResult = await preRequestHookResult;
    }
  
    if (preRequestHookResult) {
      if ((preRequestHookResult as PreRequestHookResult).serviceExecutionResult) {
        return (preRequestHookResult as PreRequestHookResult).serviceExecutionResult as IServiceExecutionResult;
      } else {
        throw new Error('Pre-request hook returned no service execution result');
      }
    } else {
      throw new Error('Pre-request hook returned nothing');
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
