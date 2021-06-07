import { Actions } from 'redux-retro';
import { Store } from 'redux';
import { GhostRpcService } from '../../../../src/index';

import TodoService, { ITodo } from '../../shared/services/todo-service';

import { IAppState } from '../store';

export default class extends Actions<IAppState> {
  private todoService: GhostRpcService<TodoService>;

  constructor(store: Store<IAppState>, todoService: GhostRpcService<TodoService>) {
    super(store);

    this.todoService = todoService;
  }

  public async addTodo(name: string) {
    try {
      const todo = await this.todoService.addTodo(name);
      this.todoAddSuccessful(todo);
    } catch (err) {
      this.todoAddFailed();
    }
  }

  public todoAddSuccessful(todo: ITodo) {
    return todo;
  }

  public todoAddFailed() {

  }
}
