import { getServicesProxy, ITestWorkflowContext } from "./test-setup/test-services-proxy";
import * as testHooks from "./mock/hooks/test-hooks";
import CalculatorService from "./mock/services/calculator-service";
import { IServiceExecutionResult } from "../src";

describe('Request Hooks', () => {
  let servicesProxy: ITestWorkflowContext;

  
  beforeEach(() => {
    servicesProxy = getServicesProxy();
  });

  describe('When I add no Request Hooks and invoke a service', () => {
    let addResult: number;

    beforeEach(async () => {
      addResult = await servicesProxy.services.calculatorService.add(2,2);
    });

    it('should directly execute the service', ()=> {
      expect(addResult).toBe(4);
    });
  });

  describe('When I add one Request Hook and invoke a service', () => {
    let addResult: number;

    beforeEach(async () => {
      servicesProxy.handler.use(testHooks.genericTestHook1);
      addResult = await servicesProxy.services.calculatorService.add(2,2);
    });

    it('should run my Request hook before running the service', async () => {
      expect(addResult).toBe(4);
    });

    describe('When I call next() from my Request Hook', () => {
      beforeEach(async () => {
      });
      it.todo('should invoke my service and return an object with a Service Execution Result property');
    });
  });

  describe('When I add two request Hooks and invoke a service', () => {
    let addResult: number;
    const hook1Spy = jest.spyOn(testHooks, "genericTestHook1");
    const hook2Spy = jest.spyOn(testHooks, "genericTestHook2");
    const serviceSpy = jest.spyOn(CalculatorService.prototype, "add");

    beforeEach(async () => {
      servicesProxy.handler.use(testHooks.genericTestHook1);
      servicesProxy.handler.use(testHooks.genericTestHook2);
      addResult = await servicesProxy.services.calculatorService.add(2,2);
    });

    afterEach(() => {
      hook1Spy.mockReset();
      hook2Spy.mockReset();
      serviceSpy.mockReset();
    });

    describe('When I call next() from the first Request Hook', () => {
      it('should invoke the second Request Hook and return its Service Execution Result payload', async () => {
        const hook1Result = await hook1Spy.mock.results[0].value;
        const typeCheck = (tbd: any): tbd is IServiceExecutionResult => { return true; }

        expect(typeCheck(hook1Result)).toBeTruthy();
      });
    });

    describe('When I call next() from the second Request Hook', () => {
      it('should invoke my service and return an object with a Service Execution Result property', () => {
        const hook1Order = hook1Spy.mock.invocationCallOrder[0];
        const hook2Order = hook2Spy.mock.invocationCallOrder[0];
        const serviceOrder = serviceSpy.mock.invocationCallOrder[0];

        expect(hook1Order).toBeLessThan(hook2Order);
        expect(hook2Order).toBeLessThan(serviceOrder);
        expect(addResult).toBe(4);
      });
    });
  });

  describe('When I call next() more than once from a Request Hook', () => {
    beforeEach(async () => {
      servicesProxy.handler.use(testHooks.testHookMultipleNext);
    });
    it('should throw an error', async () => {
      await expect(servicesProxy.services.calculatorService.add(2,2)).rejects.toThrowError();
    });
  });


  describe('When I pass construction params into Next()', () => {
    it.todo('should pass those construction params into the service factory for the service being called')
  });

  describe('When I pass no construction params into Next()', () => {
    it.todo('it should pass undefined for params in the service factory for the service being called')
  });

  describe('When I have multiple Request Hooks and the first hook short circuits', () => {
    const hook1Spy = jest.spyOn(testHooks, "shortCircuitHook");
    const hook2Spy = jest.spyOn(testHooks, "genericTestHook1");
    const serviceSpy = jest.spyOn(CalculatorService.prototype, "add");
    
    const serviceCall = async () => {
      return await servicesProxy.services.calculatorService.add(2,2)
    };
    beforeEach(async() => {
      servicesProxy.handler.use(testHooks.shortCircuitHook);
      servicesProxy.handler.use(testHooks.genericTestHook1);
    });

    afterEach(() => {
      hook1Spy.mockReset();
      hook2Spy.mockReset();
      serviceSpy.mockReset();
    });

    it('should not invoke the second Request Hook', async () => {
      await expect(serviceCall()).rejects.toThrowError();
      expect(hook1Spy).toHaveBeenCalled();
      expect(hook2Spy).toHaveBeenCalledTimes(0);
    });

    it('should not execute the requested service', () => {
      expect(serviceSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('When global response parameters are added to the execution result', () => {
    const hook1Spy = jest.spyOn(testHooks, "genericTestHook1");

    beforeEach(async () => {
      servicesProxy = getServicesProxy();

      servicesProxy.handler.use(testHooks.genericTestHook1);
      servicesProxy.handler.use(testHooks.globalResponseHook);

      await servicesProxy.services.calculatorService.add(2,2);
    });
    it('should return those response params up through the response pipeline', async () => {
      const hook1Result = await hook1Spy.mock.results[0].value;
      
      expect(hook1Result.executionResult.globalResponseParams.testValue).toBe(500);
    });
  });
});
