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
    const result = await executeQuery(pool, `
    SELECT d.*, m.depart_name, m.div, m.div_name
      FROM Members d
      INNER JOIN Depart m ON d.depart = m.depart
      ORDER BY d.id DESC;
      `);

    // Return the query result as the API response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
