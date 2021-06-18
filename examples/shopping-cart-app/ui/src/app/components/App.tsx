import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux-retro';
import 'antd/dist/antd.css';

import Router from '../../common-library/router/Router';
import { IAppState } from '../store';
import { IAppActions } from '../actions';

import routes from '../routes';

export interface IAppProps {
  store: Store<IAppState>;
  actions: IAppActions;
}

export const App = (props: IAppProps) => (
  <Provider store={props.store} actions={props.actions}>
    <Router routes={routes} store={props.store} />
  </Provider>
);

export const renderApp = (store: Store<IAppState>, actions: IAppActions) => {
  ReactDOM.render(<App store={store} actions={actions} />, document.getElementById('root') as HTMLElement);
};
