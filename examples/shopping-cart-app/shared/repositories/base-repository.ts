import { Connection } from 'typeorm';

export default class {
  protected connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }
}
