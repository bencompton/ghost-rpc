import { BaseServices } from '.';

export type ServiceExecutionResultStatus =
  'serviceNotFound'
  | 'methodNotFound'
  | 'executionFailed'
  | 'success';

export interface IServiceExecutionResult {
  status: ServiceExecutionResultStatus;
  error?: { message: string, stack: string | null };
  result?: any;
}

export default async (
  services: BaseServices,
  serviceName: string,
  methodName: string,
  methodArguments: any[]
): Promise<IServiceExecutionResult> => {
  const service = services[serviceName];

  if (!service) {
    return {
      status: 'serviceNotFound'
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
