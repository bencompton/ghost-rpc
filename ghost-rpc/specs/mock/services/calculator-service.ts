import { ITestAppServiceContext } from ".";

export default class {
  private context: ITestAppServiceContext;

  constructor(context: ITestAppServiceContext) {
    this.context = context;
  }

  public add(...numbers: number[]) {
    return numbers.reduce((accumulatedValue, nextValue) => {
      return accumulatedValue + nextValue;
    }, 0);
  }
}