export interface ITodo {
    id: number;
    name: string;
}

export default class {
  public async addTodo(name: string) {
    const id = await Promise.resolve(5);

    return <ITodo>{
      id,
      name
    };
  };
  
  public deleteTodo(id: number) {
    return 'heya';
  };
  
  public editTodo(todo: ITodo) {

  };
}
