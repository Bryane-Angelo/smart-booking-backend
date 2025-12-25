import pool from "./db.js";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, date, time FROM slots WHERE booked_by=$1 ORDER BY date, time",
      [username]
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to load bookings" });
  }
}
