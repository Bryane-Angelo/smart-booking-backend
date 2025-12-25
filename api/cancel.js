import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: "booking_id required" });
  }

  try {
    await pool.query(
      `
      UPDATE slots
      SET
        is_booked = false,
        booked_by = NULL
      WHERE id = $1
      `,
      [booking_id]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
}