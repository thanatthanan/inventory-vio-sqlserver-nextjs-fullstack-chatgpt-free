// api/stock/history.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToSQL, executeQuery } from "../../sql";

interface HistoryItem {
  rec_id: number;
  stock_id: number;
  quantity: number;
  remaining: number;
  type: string;
  username: string;
  date: string;
  datesave: string;
  item_name: string;
  item_code: string;
  depart: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Retrieve the "depart" value from the cookie
    const { stock_id } = req.query;

    // Connect to the SQL Server
    const pool = await connectToSQL();

    // Execute a SQL query with a WHERE clause to filter by "depart"
    const result = await executeQuery(
      pool,
      `
      SELECT sh.*, s.item_name, s.item_code, s.depart
      FROM StockHistory sh
      INNER JOIN Stock s ON sh.stock_id = s.id
      WHERE s.stock_id = ${stock_id}
      ORDER BY sh.rec_id DESC;
      `
    );

    // Transform the query result into the desired format (HistoryItem[])
    const historyList: HistoryItem[] = result.recordset.map((item: any) => ({
      rec_id: item.rec_id,
      stock_id: item.stock_id,
      quantity: item.quantity,
      remaining: item.remaining,
      type: item.type,
      username: item.username,
      date: item.date,
      datesave: item.datesave,
      item_name: item.item_name,
      item_code: item.item_code,
      depart: item.depart,
      ref: item.ref,
    }));

    // Return the transformed data as the API response
    res.status(200).json(historyList);
  } catch (error) {
    console.error("SQL Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
