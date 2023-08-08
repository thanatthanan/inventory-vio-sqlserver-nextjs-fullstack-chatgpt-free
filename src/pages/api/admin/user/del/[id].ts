import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../../../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query; // รับข้อมูล ID จาก request query params

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to delete the Members by ID
    const query = `DELETE FROM Members WHERE id = ${id}`;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: 'Members deleted successfully' });
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
