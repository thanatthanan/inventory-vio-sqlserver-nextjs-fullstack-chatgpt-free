// src/pages/api/admin/depart/edit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../../sql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { depart, depart_name, div, div_name } = req.body;

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to update the existing department
    const query = `
      UPDATE Depart
      SET depart_name = '${depart_name}', div = '${div}', div_name = '${div_name}'
      WHERE depart = '${depart}'
    `;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: 'Depart updated successfully' });
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
