import pool from "./db.js";

export default async function handler(req, res) {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "username required" });
    }

    const result = await pool.query(
      `
      SELECT id, time, booking_date
      FROM slots
      WHERE booked_by = $1
        AND is_booked = true
      ORDER BY booking_date, time
      `,
      [username]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
}