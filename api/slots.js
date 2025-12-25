import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, date, time
      FROM slots
      WHERE booked = false
      ORDER BY date, time
      `
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load slots" });
  }
}