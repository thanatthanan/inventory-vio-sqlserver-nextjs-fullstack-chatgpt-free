//api/admin/username/check.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ error: 'Missing item code' });
      return;
    }

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to check if the item code exists
    const query = `SELECT * FROM Members WHERE username = '${username}'`;
    const result = await executeQuery(pool, query);

    // Check if the item code exists
    if (result.recordset.length > 0) {
      res.status(200).json({ username, exists: true });
    } else {
      res.status(200).json({ username, exists: false });
    }
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
