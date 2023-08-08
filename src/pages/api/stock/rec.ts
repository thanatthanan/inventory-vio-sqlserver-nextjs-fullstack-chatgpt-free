import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id, quantity, username, date, remaining, ref, note } = req.body;

      // Connect to SQL Server
      const pool = await connectToSQL();

      // Update the stock quantity
      const updateQuery = `UPDATE stock SET remaining = remaining + ${quantity} WHERE id = ${id}`;
      await executeQuery(pool, updateQuery);

      // Insert data into StockRec table
      const insertQuery = `INSERT INTO StockHistory (id, quantity, username, date, remaining, type, ref, note) 
      VALUES (${id}, ${quantity}, '${username}','${date}', ${remaining + quantity} , 1, '${ref}', '${note}')`;
      await executeQuery(pool, insertQuery);

      res.status(200).json({ message: 'Stock remaining updated and record inserted successfully' });
    } catch (error) {
      console.error('Error updating stock remaining and inserting record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
