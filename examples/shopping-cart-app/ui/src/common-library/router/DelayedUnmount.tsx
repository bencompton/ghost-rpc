import * as React from 'react';

import { RouterContext, RouterContextInfo } from './Router';

interface IDelayedUnmounterProps {
  routeContextInfo: RouterContextInfo;
  unmountPromise: Promise<any>;
}

class DelayedUnmounter extends React.Component<IDelayedUnmounterProps, any> {
  public componentDidMount() {
    this.props.routeContextInfo.addDelayedUnmount(this.props.unmountPromise);
  }

  public render() {
    return <>{this.props.children}</>;
  }
}

export interface IDelayedUnmountProps extends React.Props<any> {
  unmountPromise: Promise<any>;
}

export default (props: IDelayedUnmountProps) => (
  <RouterContext.Consumer>
    {(routeContextInfo) => {
      return (
        <DelayedUnmounter routeContextInfo={routeContextInfo} unmountPromise={props.unmountPromise}>
          {props.children}
        </DelayedUnmounter>
      );
    }}
  </RouterContext.Consumer>
);
