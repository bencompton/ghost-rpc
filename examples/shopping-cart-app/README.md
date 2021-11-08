# Shopping Cart Example App

This example leverages Ghost RPC with React, Redux / [Redux Retro](https://github.com/bencompton/redux-retro/) and [TypeORM](https://github.com/typeorm/typeorm) + [SQL.js](https://github.com/sql-js/sql.js). Here, we demonstrate sharing the same logic (service, database schemas / data access logic on the back-end and Redux state management logic on the front-end) between 3 different modes:

* Running the full stack in the browser (mock mode)
* Running the front-end in the browser and the back-end in Node.js (full mode)
* Running the full stack in lightning fast [Jest Cucumber](https://github.com/bencompton/jest-cucumber/) integration tests

This project is organized into the following directories:

* `ui` - Contains the React / Redux front-end with two build entrypoints: `app.ts` and `app-with-mocks.ts`. `app.ts` is used to build the front-end with a Ghost RPC proxy that uses a HTTP Transport Handler in order to call Ghost RPC services running in Node.js (full mode). `app-with-mocks.ts` is the front-end entrypoint with a Ghost RPC proxy that uses a Local Handler to call the Ghost RPC services directly in the browser without using Node.js (mock mode).

* `api` - Stands up a Fastify server in Node.js that exposes the Ghost RPC services over HTTP, which are called from the front-end built from `app.ts` (full mode).

* `shared` - Contains logic shared between the front-end UI and API, including the Ghost RPC services, and data repositories.

* `database` - The TypeORM database table schemas, mock database data, and other database utils go here.

* `specs` - Feature files, step definitions, and workflow classes for this project's [Jest Cucumber](https://github.com/bencompton/jest-cucumber/) integration tests go here. The integration tests exercise the full stack in the same manner as running the full stack in the browser with mock mode.

For a more detailed explanation of many of the concepts behind this example, please see the [Front-End First Development Tutorial](https://github.com/bencompton/frontend-first-development-tutorial/blob/master/integration-tests.md). This tutorial covers building a simple shopping cart app with [I/O Source](https://github.com/bencompton/io-source) mock REST services rather than running the full stack in the browser / integration tests with Ghost RPC, but the main concepts are the same.

## Quick Start

### Installation

To get started, clone this repository and navigate to the shopping-cart-app directory:

```
git clone git@github.com:bencompton/ghost-rpc.git
cd examples/shopping-cart-app
```

Next, run `npm install`. Note that this project's root `package.json` is a central point to manage npm scripts in all subdirectories in this project. It has post-install scripts to run `npm install` across ui, api, shared, database, and specs.

### Running the full stack in the browser (mock mode)

To try out mock mode in the browser, run `npm run dev` from the root `shopping-cart-app` directory. [Vite](https://vitejs.dev/) will expose the demo app on `localhost:3000`, and launch the app in your default browser.

With Ghost RPC, the idea is that as much of your full-stack development as possible happens in the browser. This typically enhances developer productivity because an entire dev environment can be launched with one command rather than going through an involved set of steps to run your back-end locally. Running the full stack in the browser lets you leverage in-browser dev tools for the full stack, as well as productivity-enhancing build tooling like HMR. For example, in this demo, try changing one of the the TypeScript database schema definitions, let Vite build your changes, then refresh the browser and you'll see your schema change will be available right away!

When the browser launches, TypeORM will automatically create all of the database tables in the back-end's in-memory SQL.js database that is running in the browser. In addition, the database tables will be populated with mock data. As you interact with the app, Redux Retro actions will be invoked, which will in turn invoke Ghost RPC services that call the back-end services running in the browser. The back-end services in turn invoke methods on repository classes that leverage the TypeORM query builder to run queries against SQL.js. Since SQL.js is storing data in memory only, when you refresh the browser, the database will get re-created and all previous state will be lost.

To query the in-memory SQL.js DB, launch the browser dev tools and run `db.query('select * from sqlite_master');` to see all of the table schemas. TypeORM also outputs all DB queries to the console for debugging purposes. Running `db.query` from the console is a convenient way to debug your data access logic.

### Running the front-end in the browser and the back-end in Node.js (full mode)

While running the full stack in the browser is convenient for development, the ability to run the back-end outside of the browser in Node.js is important for production, test environments, and debugging back-end issues that aren't reproducible in mock mode.

To spin up the front-end in Vite and the back-end in Node.js, run `npm run dev-full`, and then the app will launch shortly in your default browser. In full mode, this will expose the front-end in Vite's dev server on `localhost:3000`, launch Node.js exposing the Ghost RPC services via Fastify on `localhost:8080`, and configure Vite's proxy to forward HTTP requests to Ghost RPC from the front-end Vite dev server on `localhost:3000` to Node.js on `localhost:8080`.

For simplicty, Node.js is also using SQL.js with mock data in this demo, although in the real world, you would typically dependency inject a different TypeORM DBMS connection into your repositories for "full mode" (e.g., MySQL, PostgreSQL). If you're using TypeORM, the same schema definitions can be used for both SQL.js and your full DBMS. For relational databases, it is suggested that you use native column type annotations to ensure optimal use of your full DBMS, which will be ignored with SQL.js if they're not supported (e.g., TINYINT for MySQL would fall back to SQLite's INTEGER column type).

### Running the tests

The tests are executed by running `npm test` from the root `shopping-cart-app` directory. Each test ends up with its own individual SQL.js database to ensure there are no conflicts when Jest runs the tests in parallel. Since SQL.js is running in memory, these tests have no I/O, and you should typically be able to run hundreds of these tests in anywhere from less than a minute to two minutes.

In a nutshell, these tests exercise the app's React Redux containers, which can be considered a top-level API to the front-end. The tests invoke actions and read state from the React Redux containers via Workflow classes, which represent high-level functionality that users can access in your app (e.g., adding a product to cart).

For a more in-depth explanation of this type of test, please see the [Front-End First Development Tutorial](https://github.com/bencompton/frontend-first-development-tutorial/), and especially the section about [integration tests](https://github.com/bencompton/frontend-first-development-tutorial/blob/master/integration-tests.md).
