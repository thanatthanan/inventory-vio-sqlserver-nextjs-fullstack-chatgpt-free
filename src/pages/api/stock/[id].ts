import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query; // Extract the member ID from the request query params

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to fetch the member by ID
    const query = `SELECT * FROM Stock WHERE id = ${id}`;
    const result = await executeQuery(pool, query);

    // Check if a member was found
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Stock not found' });
    } else {
      // Return the member as the API response
      res.status(200).json(result.recordset[0]);
    }
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
