import { ServicesFactory } from "../../../src";
import CalculatorService from "./calculator-service";

export interface ITestAppServices {
  calculatorService: CalculatorService;
}

export interface ITestAppServiceContext {
  [key: string]: any
}

export interface ITestAppServiceConstructionParams {
  constructionParams: ITestAppServiceContext;
}

export const testServicesFactory: ServicesFactory<ITestAppServices, ITestAppServiceConstructionParams> = {
  calculatorService(params) {
    return new CalculatorService(params);
  }
};