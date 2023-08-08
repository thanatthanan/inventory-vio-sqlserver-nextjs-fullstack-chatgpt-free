import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { item_code, item_name, note, unit, depart } = req.body; // Retrieve item_code, item_name, quantity, unit, and note from request body

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to insert a new stock item
    const query = `INSERT INTO Stock (item_code, item_name, note, unit, remaining, depart) VALUES ('${item_code}', '${item_name}','${note}','${unit}' ,0 , ${depart})`;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: 'Stock item added successfully' });
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
