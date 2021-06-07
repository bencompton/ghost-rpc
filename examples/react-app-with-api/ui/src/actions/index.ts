import { Store } from 'redux';
import { GhostRpcServices } from '../../../../src';

import { IAppServices } from '../../shared/services/';
import { IAppState } from '../store';
import TodoActions from './todo-actions';

export interface IAppActions {
  todo: TodoActions;
}

export const getActions = (store: Store<IAppState>, services: GhostRpcServices<IAppServices>) => {
  return <IAppActions>{
    todo: new TodoActions(store, services.todo)
  };
};
