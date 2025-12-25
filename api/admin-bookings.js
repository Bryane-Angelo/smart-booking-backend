import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, booked_by, time, booking_date
      FROM slots
      WHERE is_booked = true
      ORDER BY booking_date, time
      `
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("ADMIN BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to load admin bookings" });
  }
}