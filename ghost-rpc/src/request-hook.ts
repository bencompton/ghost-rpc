import { IServiceExecutionResult } from "./service-executor";

export type Next<TConstructionParams> = (constructionParams?: TConstructionParams) => Promise<RequestHookResult>;

export type RequestHookRegistration =  {
  use(requestHook: RequestHook<any, any>): RequestHookRegistration;
}

export type RequestHookResult = {
  executionResult: IServiceExecutionResult;
}

export type RequestHook<TGlobalRequestParams, TConstructionParams> = (globalRequestParams: TGlobalRequestParams, next: Next<TConstructionParams>) => Promise<RequestHookResult>;