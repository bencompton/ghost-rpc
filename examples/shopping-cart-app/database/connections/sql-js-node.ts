import { createConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import * as entities from '../schema';

export const getConnection = async () => {
  const connection = await createConnection({
    type: 'sqljs',
    name: `connection-${uuidv4()}`,
    autoSave: false,
    entities: Object.keys(entities).map((entity: string) => (entities as any)[entity]),
    logging: ['query', 'schema'],
    synchronize: true
  });

  return connection;
};
