import pool from "./db.js";

export default async function handler(req, res) {
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
    console.error("SLOTS ERROR:", err);
    res.status(500).json({ error: "Failed to load slots" });
  }
}