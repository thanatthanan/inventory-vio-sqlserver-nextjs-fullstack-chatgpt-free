// pages/api/stock/depart.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = req.headers.cookie; // Get the cookies from the request headers
    const departCookie = cookies?.split('; ').find((cookie) => cookie.startsWith('depart=')); // Find the 'depart' cookie
    const depart = departCookie ? departCookie.split('=')[1] : null; // Extract the 'depart' value

    if (!depart) {
      res.status(400).json({ error: 'Depart not found in the cookie' });
      return;
    }

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to fetch the stock items based on depart
    const query = `SELECT * FROM Stock WHERE depart = '${depart}'`;
    const result = await executeQuery(pool, query);

    // Return the stock items as the API response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
