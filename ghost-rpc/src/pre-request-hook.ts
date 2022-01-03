import { IServiceExecutionResult } from "./service-executor";

export type Next = () => Promise<any> | any;

export type MiddlewareRegistration =  {
  use(preRequestHook: PreRequestHook): MiddlewareRegistration;
}

export type PreRequestHookResult = {
  context: any,
  repositories: any
}

export type PreRequestHookCallback = (constructionParams: any) => Promise<IServiceExecutionResult>;

export type PreRequestHook = (globalRequestParams: any, next: Next) => Promise<any>;