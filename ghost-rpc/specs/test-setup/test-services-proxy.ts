import { createLocalHandler, createProxy, ServicesProxy } from "../../src";
import { ProxyTransportHandlerWithMiddlewareRegistration } from "../../src/create-local-handler";
import { ITestAppServiceConstructionParams, ITestAppServices, testServicesFactory } from "../mock/services";

export interface ITestWorkflowContext {
  handler: ProxyTransportHandlerWithMiddlewareRegistration;
  services: ServicesProxy<ITestAppServices>;
}

export const getServicesProxy = () => {
  const handler = createLocalHandler<ITestAppServiceConstructionParams, null>(
    testServicesFactory
  );

  const services = createProxy<ITestAppServices>(handler)

  return {
    handler,
    services
  };
};