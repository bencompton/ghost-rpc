import { ServicesFactory } from '../../../../ghost-rpc/src/';
import TodoService from './todo-service';

export interface IAppServices {
  todo: TodoService;
}

export const servicesFactory: ServicesFactory = {
  todo() {
    return new TodoService();
  }
};
