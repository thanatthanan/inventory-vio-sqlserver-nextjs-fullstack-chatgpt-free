// src/pages/api/admin/user/add.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToSQL, executeQuery } from "../../sql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, password, fname, lname, level, depart } = req.body;

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query to insert a new member
    const query = `
    INSERT INTO Members (username, password, fname, lname, level, depart) 
    VALUES ('${username}', '${password}', '${fname}', '${lname}', '${level}', '${depart}')`;
    await executeQuery(pool, query);

    // Return success response
    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("SQL Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
