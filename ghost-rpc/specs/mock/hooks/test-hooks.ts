import { RequestHook } from "../../../src/request-hook";
import { ITestAppServiceConstructionParams } from "../services";

export const genericTestHook1: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  const results =  await next(globalRequestParams);

  // results.executionResult.globalResponseParams.boom = 500;

  return results;
};

export const genericTestHook2: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  return next(globalRequestParams);
};

export const testHookMultipleNext: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
  next();
  
  return next(globalRequestParams);
};

// export const testHookNoNextCall: RequestHook<undefined, ITestAppServiceConstructionParams> = async (globalRequestParams, next) => {
//   return undefined;
// };
