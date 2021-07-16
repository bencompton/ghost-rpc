# Ghost RPC

## Overview

### Why use RPC instead of REST?

Many web apps these days are SPAs built with React, Vue, Svelte, etc., and call a Node.js RESTful API built with Express, Fastify, Hapi, etc. While RESTful semantics are useful for creating standards-based APIs that can be exposed to various consumers, when the only goal is to invoke some code on the back-end, and your API is only called from your front-end, then RESTful semantics are overkill. A lot of time and brain power is spent ensuring that RESTful APIs correctly adhere to HTTP semantics, like using the correct verb, HTTP status code, etc., and this additional work yields few benefits.

### How is Ghost RPC different from other RPC frameworks?

Ghost RPC is designed for extreme productivity and testability for browser-based front-ends with Node.js back-ends. Ghost RPC leverages JavaScript proxies and provides a fluent TypeScript / JavaScript API to allow you to define and invoke your services and create highly testable apps with with minimal wasted effort.

In a nutshell, with Ghost RPC, you define service classes and proxies for invoking methods in your service classes. Your proxies can be configured to either call your services over the wire in Node.js (with simple middleware for exposing your services), or to directly instantiate and call your service classes for integration tests or running in the browser with mock data (e.g., via the repository pattern where mock or real repositories are dependency injected into your service classes that return mock data or connect to a real database respectively). These proxies to your service classes are then dependency injected into the rest of your app, and via the magic of polymorphism, your app doesn't care how the service operations are actually being invoked.

### Front-End First Developent

Running your services in the browser or integration tests with mock data is useful for practicing Front-End First Development. Engineers often start with the database schema or other back-end concerns and work backwards to the front-end, only to find that re-work is required because the front-end needs to work differently than initially imagined. With Front-End First development, an engineer begins by making the most optimal user experience possible with the back-end mocked out, and once the front-end is perfected and the data contract between the front-end and back-end is solidified, the back-end is implemented (e.g., database, message queues, etc.). Ghost RPC simplifies this process, and also allows you to build and test the back-end domain logic in your services as part of your Front-End First development process.

### Testability



allows you to define service classes that can either be invoked over the wire from your browser front-end to your Node.js back-end


, or that can be directly invoked from integration tests or in the browser for manual testing with mock data.

, you define service classes, proxies to those service classes, 

 to work only with Node.js and browser-based front-ends 

A lot of time and brain power is spent ensuring these RESTful APIs correctly adhere to HTTP semantics, like using the correct verb, HTTP status code, etc. Other RPC frameworks require extra work and complexity to define service contracts in a language-agnostic manner. 

In addition, testing the front-end and back-end together can usually only be accomplished with relatively brittle browser-based tests leveraging Selenium

Provides simple and fluent APIs for exposing endpoints to your TypeScript / JavaScript service classes and creating proxies


Let's assume your app has the following services that need to be exposed in your back-end API:

```typescript
// services/add-subtract-service.ts

export class AddSubtractService {
  public add(x: number, y: number) {
    return x + y;
  }

  public subtract(x: number, y: number) {
    return x - y;
  }
}

// services/multiply-divide-service.ts

export class MultiplyDivideService {
  public multiply(x: number, y: number) {
    return number1 * number2;
  }

  public divide(x: number, y: number) {
    return x / y;
  }
}
```

In order to facilitate calling your services, the first step with Ghost RPC is to create a factory for your services to allow Ghost RPC to create new instances of each service class as required. Ghost RPC is stateless and each service call uses a new instance of the relevant service class. If using TypeScript, you should also create an interface representing all of the services in your app, as shown below.

```typescript
  // services/index.ts

  import { ServicesFactory } from 'ghost-rpc';

  import { CalculatorService } from './services/calculator-service';
  import { TodoService } from './services/todo-service';

  export interface IAppServices {
    addSubtractService: AddSubtractService;
    multiplyDivideService: MultiplyDivideService;
  }

  export const servicesFactory: ServicesFactory<IAppServices> = {
    addSubtractService: () => new AddSubtractService(),
    multiplyDivideService: () => new MultiplyDivideService()
  } 
```

Next, we use the ghost-rpc-fastify plug-in to expose all of your services on the URL path of your choosing (e.g., /api/):

```typescript
  import { createFastifyMiddleware }
  import { servicesFactory } from './services/';

  const server = fastify();
  const ghostRpcMiddleware = createFastifyMiddleware('/api/', servicesFactory);
  server.register(ghostRpcMiddleware);
  
  ...
```

Then to call your services hosted in Fastify, you would create a Ghost RPC proxy with a HTTP Transport Handler (specifying the same URL path you used above, e.g., /api/):

```typescript
import { createProxy, createHttpTransportHandler } from 'ghost-rpc';

import { IAppServices } from './services/';

const handler = createHttpTransportHandler('/api/');
const proxy = createProxy<IAppServices>(handler);

const sum = await proxy.addSubtractService.add(2, 2);
console.log(sum); // 4

const product = await proxy.multiplyDivideService.divide(4, 2);
console.log(product); // 2
```

You can also create a proxy with a Local Handler, which calls methods on your service classes directly with no I/O. This is useful for running your back-end services in the browser for development, lightweight demo versions of your app, etc. It also allows you to create tests that exercise both your front-end and back-end logic simultaneously.

```typescript
import { createProxy, createLocalHandler } from 'ghost-rpc';

import { IAppServices, servicesFactory } from './services/';

const handler = createLocalHandler(servicesFactory);
const proxy = createProxy<IAppServices>(handler);

const sum = await proxy.addSubtractService.add(2, 2);

console.log(sum); // 4
```

A proxy created with a Local Handler and a proxy created with a HTTP Transport Handler are exactly the same as far as the rest of your app is concerned. The proxy objects in both cases is of type `ServicesProxy<IAppServices>`, and `proxy.addSubtractService` and `proxy.multiplyDivideService` are of types `ServiceProxy<AddSubtractService>` and `ServiceProxy<MultiplyDivideService>` respectively. So, if your front-end app were using Redux Thunk, you might have something like this:

```typescript
export const performAddition = (): ThunkAction<void, {}, {}, AnyAction> => 
  async (dispatch: ThunkDispatch<{}, {}, AnyAction>, proxy: ServicesProxy<IAppService>) => {
    const res = await api();
    dispatch(updateSession({ loggedIn: res }));
  };
```

