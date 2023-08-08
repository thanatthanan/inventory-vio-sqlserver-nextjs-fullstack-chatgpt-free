// src/pages/api/admin/depart/[depart].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from '../../sql';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const { depart } = req.query;
  
      if (!depart) {
        return res.status(400).json({ error: 'Missing department ID' });
      }
  
      // Connect to the SQL Server
      const pool = await connectToSQL();
  
      // Execute a SQL query to fetch the department data by depart
      const query = `
        SELECT depart, depart_Name, div, div_name
        FROM Depart
        WHERE depart = '${depart}'
      `;
      const result = await executeQuery(pool, query);
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      // Return the department data
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('SQL Server error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
