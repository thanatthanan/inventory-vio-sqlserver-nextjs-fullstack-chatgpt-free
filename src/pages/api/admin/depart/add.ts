// src/pages/api/admin/depart/add.ts
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

    // Execute a SQL query to insert a new member
    const query = `
    INSERT INTO Depart (depart, depart_name, div, div_name) 
    VALUES ('${depart}', '${depart_name}', '${div}', '${div_name}')`;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: 'Depart added successfully' });
  } catch (error) {
    console.error('SQL Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
