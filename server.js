import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

/* ================= DATABASE ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= LOGIN ================= */
app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body;

  const r = await pool.query(
    "SELECT username FROM users WHERE username=$1 AND password=$2 AND role=$3",
    [username, password, role]
  );

  if (r.rows.length === 0) {
    return res.json({ success: false });
  }

  res.json({ success: true, username, role });
});

/* ================= SIGNUP ================= */
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false });
  }

  try {
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1,$2,'user')",
      [username, password]
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

/* ================= AUTO CREATE SLOTS ================= */
async function ensureSlotsForDate(date) {
  const exists = await pool.query(
    "SELECT 1 FROM slots WHERE booking_date=$1 LIMIT 1",
    [date]
  );

  if (exists.rows.length > 0) return;

  const times = [
    "10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM",
    "03:00 PM","04:00 PM","05:00 PM","06:00 PM",
    "07:00 PM","08:00 PM","09:00 PM","10:00 PM"
  ];

  for (const t of times) {
    await pool.query(
      "INSERT INTO slots (booking_date, time, is_booked) VALUES ($1,$2,false)",
      [date, t]
    );
  }
}

/* ================= GET SLOTS ================= */
app.get("/api/slots", async (req, res) => {
  const date = req.query.date;
  if (!date) return res.json([]);

  await ensureSlotsForDate(date);

  const r = await pool.query(
    "SELECT id, time FROM slots WHERE booking_date=$1 AND is_booked=false",
    [date]
  );

  res.json(r.rows);
});

/* ================= BOOK SLOT ================= */
app.post("/api/book", async (req, res) => {
  const { slot_id, username } = req.body;

  const check = await pool.query(
    "SELECT 1 FROM slots WHERE id=$1 AND is_booked=false",
    [slot_id]
  );

  if (check.rows.length === 0) {
    return res.json({ message: "Slot already booked" });
  }

  await pool.query(
    "UPDATE slots SET is_booked=true, booked_by=$1 WHERE id=$2",
    [username, slot_id]
  );

  res.json({ message: "Appointment booked successfully" });
});

/* ================= USER BOOKINGS (SEND SLOT ID) ================= */
app.get("/api/bookings/:username", async (req, res) => {
  const r = await pool.query(
    "SELECT id, booking_date, time FROM slots WHERE booked_by=$1",
    [req.params.username]
  );
  res.json(r.rows);
});

/* ================= CANCEL SLOT (FIXED) ================= */
app.post("/api/cancel", async (req, res) => {
  const { slot_id, username } = req.body;

  await pool.query(
    "UPDATE slots SET is_booked=false, booked_by=NULL WHERE id=$1 AND booked_by=$2",
    [slot_id, username]
  );

  res.json({ message: "Booking cancelled successfully" });
});

/* ================= ADMIN VIEW ================= */
app.get("/api/admin/bookings", async (req, res) => {
  const r = await pool.query(
    "SELECT booking_date, time, booked_by FROM slots WHERE is_booked=true"
  );
  res.json(r.rows);
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
