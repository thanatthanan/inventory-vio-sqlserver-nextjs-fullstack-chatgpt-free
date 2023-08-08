// src/pages/api/admin/depart/
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query
    const result = await executeQuery(pool, 'SELECT * FROM Depart ORDER BY id DESC;');

    // Return the query result as the API response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
