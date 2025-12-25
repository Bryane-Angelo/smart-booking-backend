import pool from "./db.js";

export default async function handler(req, res) {
  try {
    // Default = today (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const { date } = req.query;
    const selectedDate = date || today;

    const result = await pool.query(
      `
      SELECT 
        id,
        time,
        is_booked,
        booked_by,
        booking_date
      FROM slots
      WHERE booking_date = $1
      ORDER BY id
      `,
      [selectedDate]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("SLOTS API ERROR:", err);
    res.status(500).json({ error: "Failed to load slots" });
  }
}