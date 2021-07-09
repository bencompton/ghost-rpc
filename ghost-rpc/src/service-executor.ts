import { ServicesFactory } from '.';

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
}

export type PreRequestHookResult<ConstructionParams> = {
  constructionParams?: ConstructionParams;
  serviceExecutionResult?: IServiceExecutionResult;
}

export type WrappedPreRequestHook<ConstructionParams> =
  (globalParams: any) => PreRequestHookResult<ConstructionParams> | Promise<PreRequestHookResult<ConstructionParams>>;

export default async <ConstructionParams>(
  servicesFactory: ServicesFactory<any, ConstructionParams>,
  serviceName: string,
  methodName: string,
  methodArguments: any[],
  globalParams: any,
  wrappedPreRequestHook: WrappedPreRequestHook<ConstructionParams> | null = null
): Promise<IServiceExecutionResult> => {
  let constructionParams: ConstructionParams;
  let preRequestHookResult: PreRequestHookResult<ConstructionParams> 
    | Promise<PreRequestHookResult<ConstructionParams>> 
    | undefined = undefined;

  if (wrappedPreRequestHook) {
    preRequestHookResult = wrappedPreRequestHook(globalParams);

    if ((preRequestHookResult as PromiseLike<any>).then) {
      preRequestHookResult = await preRequestHookResult;
    }
  }

  if (
    preRequestHookResult
    && (preRequestHookResult as IServiceExecutionResult).status
    && (preRequestHookResult as IServiceExecutionResult).result
  ) {
    return preRequestHookResult as IServiceExecutionResult;
  } else {
    constructionParams = preRequestHookResult as ConstructionParams;
  }
  
  const serviceFactory = servicesFactory[serviceName];  

  if (!serviceFactory || typeof serviceFactory !== 'function') {
    return {
      status: 'serviceNotFound',
      error: { message: `Services factory provided no instantiator for service type ${serviceName}`, stack: null }
    };
  }

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
