import { IServiceExecutionResult } from './service-executor';

export class RpcProxyError extends Error {    
  public readonly serviceExecutionResult: IServiceExecutionResult;

  constructor(serviceExecutionResult: IServiceExecutionResult) {
    super(serviceExecutionResult.error?.message);
    Object.setPrototypeOf(this, RpcProxyError.prototype);
    this.serviceExecutionResult = serviceExecutionResult;      
  }
}
