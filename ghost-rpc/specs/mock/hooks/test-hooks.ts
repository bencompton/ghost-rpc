import { RequestHook, RequestHookResult } from "../../../src/request-hook";
import { ITestAppServiceConstructionParams } from "../services";

export const genericTestHook1: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  return next(globalRequestParams);
};

export const genericTestHook2: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  return await next(globalRequestParams);
};

export const testHookMultipleNext: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  next();

  return await next(globalRequestParams);
};

export const shortCircuitHook: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  return {
    executionResult: {
      status: 'notAuthenticated',
      result: null
    }
  } as RequestHookResult;
};

export const globalResponseHook: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  const results = await next(globalRequestParams);

  results.executionResult = {
    status: 'success'
  };

  results.executionResult.globalResponseParams = {};

  results.executionResult.globalResponseParams.testValue = 500;

  return results;
};
