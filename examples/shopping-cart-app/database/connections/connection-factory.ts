import { Connection } from 'typeorm';

import { addAllMockData } from '../mock-data/data-management';

type TypeOrmConnectionFactory = () => Promise<Connection>;

export default class {
  private connection: Connection | null = null;
  private getTypeOrmConnection: TypeOrmConnectionFactory;
  private addTestData: boolean = false;

  constructor(getConnection: TypeOrmConnectionFactory, addTestData: boolean = false) {
    this.addTestData = addTestData;
    this.getTypeOrmConnection = getConnection;
  }

  public async getConnection() {
    if (!this.connection) {
      this.connection = await this.getTypeOrmConnection();

      if (this.addTestData) {
        await addAllMockData(this.connection);
      }
    }

    return this.connection;
  }
}
