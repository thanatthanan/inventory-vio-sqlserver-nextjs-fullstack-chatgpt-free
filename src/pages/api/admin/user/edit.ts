// src/pages/api/admin/id/edit.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToSQL, executeQuery } from "../../sql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, username, fname, lname, password, depart, level } = req.body;

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to update the existing department
    const query = `
      UPDATE Members
      SET 
        username = '${username}',
        fname = '${fname}',
        lname = '${lname}',
        password = '${password}',
        depart = '${depart}',
        level = '${level}'
      WHERE id = '${id}'
    `;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: "Members updated successfully" });
  } catch (error) {
    console.error("SQL Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
