import * as React from 'react';
import { Store } from 'redux';
import UniversalRouter from 'universal-router';

export interface IRouterProps {
  store: Store<any>;
  routes: any[];
}

export interface IRouterState {
  currentRouteComponent: React.ReactElement<any> | null;
}

export default class Router extends React.Component<IRouterProps, IRouterState> {
  private routerContextInfo = new RouterContextInfo();

  constructor(props: IRouterProps, context: any) {
    super(props, context);

    this.state = {
      currentRouteComponent: null
    };
  }

  public render() {
    return (
      <RouterContext.Provider value={this.routerContextInfo}>
        {this.state.currentRouteComponent || null}
      </RouterContext.Provider>
    );
  }

  public componentDidMount() {
    const router = new UniversalRouter(this.props.routes);
    let currentLocation = '';

    this.props.store.subscribe(() => {
      const previousLocation = currentLocation;
      currentLocation = this.props.store.getState().router.pathname;

      if (previousLocation !== currentLocation) {
        router.resolve(currentLocation)
          .then((currentRouteComponent) => {
            return this.routerContextInfo
              .waitForDelayedUnmountPromises()
              .then(() => this.setState({ currentRouteComponent }));
          });
      }
    });
  }
}

export class RouterContextInfo {
  delayedUnmountPromises: Promise<void>[] = [];

  addDelayedUnmount(promise: Promise<void>) {
    this.delayedUnmountPromises.push(promise);
  }

  waitForDelayedUnmountPromises() {
    if (!this.delayedUnmountPromises.length) {
      return Promise.resolve();
    }

    const combinedPromise = Promise.all(this.delayedUnmountPromises).then(() => {});

    this.delayedUnmountPromises = [];

    return combinedPromise;
  }
}

export const RouterContext = React.createContext(new RouterContextInfo());
