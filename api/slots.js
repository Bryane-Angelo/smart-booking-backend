import pool from "./db.js";

export default async function handler(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM slots WHERE is_booked = false ORDER BY date, time"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
}
