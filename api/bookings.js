import { pool } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT time, booking_date
      FROM slots
      WHERE booked_by = $1
      ORDER BY booking_date, time
      `,
      [username]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
}