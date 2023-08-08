// api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToSQL, executeQuery } from './sql';

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, password } = req.body;

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Query the [Members] table for the provided username and password
    const query = `
      SELECT M.*, D.depart_name 
      FROM Members M
      LEFT JOIN Depart D ON M.depart = D.depart
      WHERE M.username = '${username}' AND M.password = '${password}'
    `;
    const result = await executeQuery(pool, query);

    // Check if the login is successful
    if (result.recordset.length > 0) {
      const { username, fname, lname, level, depart, depart_name } = result.recordset[0];

      // Set cookies with the encoded values
      const expirationTimeInSeconds = 3600;

      const encodedFname = encodeURIComponent(fname);
      const encodedLname = encodeURIComponent(lname);
      const encodedDname = encodeURIComponent(depart_name);

      res.setHeader('Set-Cookie', [
        `username=${username}; Path=/; Max-Age=${expirationTimeInSeconds}`,
        `fname=${encodedFname}; Path=/; Max-Age=${expirationTimeInSeconds}`,
        `lname=${encodedLname}; Path=/; Max-Age=${expirationTimeInSeconds}`,
        `level=${level}; Path=/; Max-Age=${expirationTimeInSeconds}`,
        `depart=${depart}; Path=/; Max-Age=${expirationTimeInSeconds}`,
        `departname=${encodedDname}; Path=/; Max-Age=${expirationTimeInSeconds}`
      ]);

      // ตอบกลับ JSON response พร้อมใช้งาน fname และ lname ที่ถอดรหัสแล้ว
      res.status(200).json({ message: 'Login successful'});
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
