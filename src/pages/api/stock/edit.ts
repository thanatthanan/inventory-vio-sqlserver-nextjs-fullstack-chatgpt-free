import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id, item_code, item_name, note, unit, depart } = req.body;

      // Connect to SQL Server
      const pool = await connectToSQL();

      // Update the stock item in the database
      const query = `UPDATE stock SET item_code = '${item_code}', item_name = '${item_name}', note = '${note}', unit = '${unit}', depart = '${depart}' WHERE id = ${id}`;
      await executeQuery(pool, query);

      res.status(200).json({ message: 'Stock item updated successfully' });
    } catch (error) {
      console.error('Error updating stock item:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
