import pool from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slot_id, username } = req.body;

  if (!slot_id || !username) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const check = await pool.query(
      "SELECT is_booked FROM slots WHERE id=$1",
      [slot_id]
    );

    if (check.rows.length === 0 || check.rows[0].is_booked) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    await pool.query(
      "UPDATE slots SET is_booked=true, booked_by=$1 WHERE id=$2",
      [username, slot_id]
    );

    res.json({ message: "Booking confirmed" });
  } catch {
    res.status(500).json({ error: "Booking failed" });
  }
}
