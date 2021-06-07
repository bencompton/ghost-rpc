import TodoService from './todo-service';

export interface IAppServices {
    todo: TodoService;
}

export const services: IAppServices = {
    todo: new TodoService()
};
