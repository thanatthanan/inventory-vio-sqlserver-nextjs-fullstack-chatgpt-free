// api/sql.ts
import { ConnectionPool, config } from 'mssql';

const dbConfig = {
  user: 'sa',
  password: 'password',
  server: 'ipserver',
  database: 'databasename',
  options: {
    encrypt: false,
  },
};

let pool: ConnectionPool | null = null;

export async function connectToSQL(): Promise<ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  pool = new ConnectionPool(dbConfig);
  await pool.connect();
  return pool;
}

export async function executeQuery(
  pool: ConnectionPool,
  query: string
): Promise<any> {
  const result = await pool.query(query);
  return result;
}
