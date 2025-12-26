import pool from "./db.js";

const TIMES = [
  "10:00 AM","11:00 AM","12:00 PM",
  "01:00 PM","02:00 PM","03:00 PM",
  "04:00 PM","05:00 PM","06:00 PM",
  "07:00 PM","08:00 PM","09:00 PM",
  "10:00 PM"
];

export default async function handler(req, res) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "date required" });
  }

  try {
    // 1️⃣ Check if slots already exist for this date
    const existing = await pool.query(
      "SELECT * FROM slots WHERE booking_date = $1 ORDER BY id",
      [date]
    );

    // 2️⃣ If NOT, create slots automatically
    if (existing.rows.length === 0) {
      for (const time of TIMES) {
        await pool.query(
          `
          INSERT INTO slots (time, booking_date, is_booked)
          VALUES ($1, $2, false)
          `,
          [time, date]
        );
      }
    }

    // 3️⃣ Fetch slots again
    const slots = await pool.query(
      `
      SELECT id, time, is_booked
      FROM slots
      WHERE booking_date = $1
      ORDER BY id
      `,
      [date]
    );

    res.status(200).json(slots.rows);
  } catch (err) {
    console.error("SLOTS ERROR:", err);
    res.status(500).json({ message: "Failed to load slots" });
  }
}