import { IServiceExecutionResult } from "./service-executor";

export type Next = (constructionParams?: any) => Promise<RequestHookResult>;

export type RequestHookRegistration =  {
  use(requestHook: RequestHook): RequestHookRegistration;
}

export type RequestHookResult = {
  executionResult: IServiceExecutionResult;
}

export type RequestHook = (globalRequestParams: any, next: Next) => Promise<any>;