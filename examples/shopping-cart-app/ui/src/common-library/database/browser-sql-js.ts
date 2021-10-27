import { createConnection } from 'typeorm';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm';
import initSqlJs from 'sql.js';

import * as entities from '../../../../database/schema/';

export const getConnection = async () => {
  let sqlWasmPath: string;

  if (typeof sqlWasm === 'function') {
    sqlWasmPath = sqlWasm.toString().match(/"(.*)"/)[1];
  } else {
    sqlWasmPath = sqlWasm;
  }

  const SQL = await initSqlJs({ locateFile: () => sqlWasmPath });

  (window as any).SQL = SQL;

  const connection = await createConnection({
    type: 'sqljs',
    autoSave: false,
    entities: Object.keys(entities).map((entity: string) => { return (entities as any)[entity]; }),
    logging: ['query', 'schema'],
    synchronize: true
  });

  return connection;
};
